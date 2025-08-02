const express = require(`express`);
const router = express.Router();
const User = require(`../models/user`);
const ErrorHandler = require(`../utils/ErrorHandler`);
const { upload } = require(`../multer`);
const fs = require(`fs`);
const uuid = require("uuid");
const jwt = require(`jsonwebtoken`);
const sendMail = require(`../utils/sendMail`);
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const { isAuthenticated, isAdmin } = require("../middlewares/auth");
const crypto = require("crypto");
const {
  generateOTP,
  generateEmailtemplate,
  generatePasswordresetToken,
  generateRandomPassword,
} = require("../utils/otp");
const { isValidObjectId } = require("mongoose");
const path = require("path");
const { promisify } = require("util");
const accessAsync = promisify(fs.access);
const unlinkAsync = promisify(fs.unlink);

// Create user with activation
router.post(
    `/create-user`,
    upload.single(`file`),
    catchAsyncErrors(async (req, res, next) => {
      try {
        const { name,username , first_name , email, password, phoneNumber } = req.body;

        const userEmail = await User.findOne({ email });

        if (userEmail) {
          if (req.file) {
            const filepath = `uploads/${req.file.filename}`;
            fs.unlink(filepath, (err) => {
              if (err) {
                console.log(err);
                return res.status(500).json({ message: `Error deleting file` });
              }
            });
          }

          return next(new ErrorHandler(`User already exists`, 400));
        }

        let avatar = {};
        if (req.file) {
          const fileId = uuid.v4();
          const protocol = req.protocol;
          const host = req.get("host");
          const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

          avatar = {
            public_id: fileId,
            url: fileUrl,
            filename: req.file.filename,
          };
        }

        const userData = {
          name,
          username ,
          first_name ,
          phoneNumber,
          email,

          avatar,
          password,
        };

        // Create activation token
        const activationToken = jwt.sign(
            userData,
            process.env.ACTIVATION_SECRET || 'default_secret',
            { expiresIn: '1h' }
        );

        // Construct the activation URL
        const activationUrl = `${process.env.FRONTEND_URL}/activation/${activationToken}`;
        const decoded = jwt.verify(
            activationToken,
            process.env.ACTIVATION_SECRET || 'default_secret'
        );

        // Check if user already exists
        let user = await User.findOne({ email: decoded.email });
        if (user) {
          return next(new ErrorHandler("User already exists", 400));
        }

        // Create the new user
        user = await User.create(decoded);

        // Send the JWT token as a response
        sendToken(user, 201, res);


       /* try {
          await sendMail({
            from: process.env.SMTP_MAIL,
            email: userData.email,
            subject: "Activate Your Account",
            html: generateEmailtemplate(activationUrl),
          });

          res.status(201).json({
            success: true,
            message: `Please check your email (${userData.email}) to activate your account!`,
          });
        } catch (error) {
          return next(new ErrorHandler(error.message, 500));
        }*/
      } catch (error) {
        return next(new ErrorHandler(error.message, 400));
      }
    })
);

// Activate user
router.post(
    "/activation",
    catchAsyncErrors(async (req, res, next) => {
      try {
        const { activation_token } = req.body;

        // Verify the activation token
        const decoded = jwt.verify(
            activation_token,
            process.env.ACTIVATION_SECRET || 'default_secret'
        );

        // Check if user already exists
        let user = await User.findOne({ email: decoded.email });
        if (user) {
          return next(new ErrorHandler("User already exists", 400));
        }

        // Create the new user
        user = await User.create(decoded);

        // Send the JWT token as a response
        sendToken(user, 201, res);
      } catch (error) {
        if (error.name === 'TokenExpiredError') {
          return next(new ErrorHandler("Activation token has expired", 400));
        }
        if (error.name === 'JsonWebTokenError') {
          return next(new ErrorHandler("Invalid activation token", 400));
        }
        return next(new ErrorHandler(error.message, 500));
      }
    })
);

// Google OAuth API
router.post(
    `/google`,
    catchAsyncErrors(async (req, res, next) => {
      try {
        const { name, email, photo } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
          sendToken(existingUser, 200, res);
        } else {
          const generatedPassword = generateRandomPassword();
          const fileId = uuid.v4();

          const newUser = new User({
            name,
            email,
            avatar: {
              public_id: fileId,
              url: photo,
              filename: null,
            },
            password: generatedPassword,
            isVerified: true,
          });

          await newUser.save();

          await sendMail({
            from: process.env.SMTP_MAIL,
            email: email,
            subject: "Your Auto-Generated Password",
            html: `Dear ${name},<br><br>Your auto-generated password is: <strong>${generatedPassword}</strong>.<br>You may use this password to log in with email and password.`,
          });

          sendToken(newUser, 201, res);
        }
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }
    })
);

// Login user
router.post(
    `/login-user`,
    catchAsyncErrors(async (req, res, next) => {
      try {
        const { email, password } = req.body;
        if (!email || !password) {
          return next(new ErrorHandler(`Please provide all the fields`, 400));
        }

        const user = await User.findOne({ email }).select(`+password`);
        if (!user) {
          return next(new ErrorHandler("User not found", 404));
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
          return next(new ErrorHandler("Invalid credentials", 401));
        }

        if (!user.isActive) {
          return next(new ErrorHandler("Please verify your email first", 401));
        }

        if (!user.isActive) {
          return next(new ErrorHandler("Your account is inactive", 401));
        }

        sendToken(user, 200, res);
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }
    })
);

// Load user
router.get(
    `/getuser`,
    isAuthenticated,
    catchAsyncErrors(async (req, res, next) => {
      try {
        const user = await User.findById(req.user.id);
        if (!user) {
          return next(new ErrorHandler(`User doesn't exist!`, 404));
        }

        res.status(200).json({
          success: true,
          user,
        });
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }
    })
);

// Logout user
router.get(
    `/logout`,
    isAuthenticated,
    catchAsyncErrors(async (req, res, next) => {
      try {
        res.cookie(`token`, null, {
          expires: new Date(Date.now()),
          httpOnly: true,
          sameSite: "none",
          secure: true,
        });
        res.status(200).json({
          success: true,
          message: "Logged out successfully",
        });
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }
    })
);

// Forgot password
router.post(
    `/forgot-password`,
    catchAsyncErrors(async (req, res, next) => {
      try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
          return next(new ErrorHandler(`No user with this email found`, 404));
        }

        const resetToken = generatePasswordresetToken();

        await user.updateOne({
          resetPasswordToken: resetToken.resetPasswordToken,
          resetPasswordExpire: resetToken.resetPasswordExpire,
        });

        const resetPasswordUrl = `${process.env.FRONTEND_URL}/password-reset/${resetToken.resetPasswordToken}`;

        const message = `Your password reset token is:\n\n${resetPasswordUrl}\n\nIf you didn't request this, please ignore this email.`;

        await sendMail({
          from: process.env.SMTP_MAIL,
          email: user.email,
          subject: `Password Recovery`,
          html: message,
        });

        res.status(200).json({
          success: true,
          message: `Email sent to ${user.email} successfully`,
        });
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }
    })
);

// Reset password
router.put(
    `/reset-password/:token`,
    catchAsyncErrors(async (req, res, next) => {
      try {
        const { newPassword, confirmPassword } = req.body;
        const resetPasswordToken = req.params.token;

        const user = await User.findOne({
          resetPasswordToken,
          resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
          return next(new ErrorHandler(`Invalid or expired token`, 400));
        }

        if (newPassword !== confirmPassword) {
          return next(new ErrorHandler(`Passwords don't match`, 400));
        }

        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        await sendMail({
          from: process.env.SMTP_MAIL,
          email: user.email,
          subject: "Password Updated",
          html: `Hello ${user.name}, your password has been updated successfully.`,
        });

        res.status(200).json({
          success: true,
          message: `Password updated successfully`,
        });
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }
    })
);

// Update user info
router.put(
    `/update-info`,
    isAuthenticated,
    catchAsyncErrors(async (req, res, next) => {
      try {
        const { name, email, phoneNumber } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
          return next(new ErrorHandler(`User not found`, 404));
        }

        user.name = name;
        user.email = email;
        user.phoneNumber = phoneNumber;

        await user.save();

        res.status(200).json({
          success: true,
          message: `Profile updated successfully`,
          user,
        });
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }
    })
);

// Update user avatar
router.put(
    `/update-avatar`,
    isAuthenticated,
    upload.single(`image`),
    catchAsyncErrors(async (req, res, next) => {
      try {
        const user = await User.findById(req.user.id);

        if (req.file) {
          // Delete old avatar if exists
          if (user.avatar?.filename) {
            const oldPath = `uploads/${user.avatar.filename}`;
            try {
              await unlinkAsync(oldPath);
            } catch (err) {
              console.log(`Error deleting old avatar: ${err.message}`);
            }
          }

          const fileId = uuid.v4();
          const protocol = req.protocol;
          const host = req.get("host");
          const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

          user.avatar = {
            public_id: fileId,
            url: fileUrl,
            filename: req.file.filename,
          };
        }

        await user.save();

        res.status(200).json({
          success: true,
          message: `Avatar updated successfully`,
          user,
        });
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }
    })
);

// Admin: Get all users
router.get(
    `/admin-all-users`,
    isAuthenticated,
    isAdmin(`Admin`),
    catchAsyncErrors(async (req, res, next) => {
      try {
        const users = await User.find().sort({ createdAt: -1 });
        res.status(200).json({
          success: true,
          users,
        });
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }
    })
);

// Admin: Update user role
router.put(
    `/update-user-role/:id`,
    isAuthenticated,
    isAdmin("Admin"),
    catchAsyncErrors(async (req, res, next) => {
      try {
        const { role } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
          return next(new ErrorHandler(`User not found`, 404));
        }

        user.role = role;
        await user.save();

        res.status(200).json({
          success: true,
          message: `User role updated to ${role}`,
        });
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }
    })
);

// Admin: Delete user
router.delete(
    `/delete-user/:id`,
    isAuthenticated,
    isAdmin("Admin"),
    catchAsyncErrors(async (req, res, next) => {
      try {
        const user = await User.findById(req.params.id);

        if (!user) {
          return next(new ErrorHandler(`User not found`, 404));
        }

        // Delete avatar file if exists
        if (user.avatar?.filename) {
          const filePath = `uploads/${user.avatar.filename}`;
          try {
            await unlinkAsync(filePath);
          } catch (err) {
            console.log(`Error deleting avatar file: ${err.message}`);
          }
        }

        await user.deleteOne();

        res.status(200).json({
          success: true,
          message: `User deleted successfully`,
        });
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }
    })
);

module.exports = router;