// AUTH , IS STUDENT , IS INSTRUCTOR , IS ADMIN

const jwt = require("jsonwebtoken");
require('dotenv').config();
const User  = require("../models/user");
const catchAsyncErrors = require("./catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");

// ================ AUTH ================
// user Authentication by checking token validating
exports.auth = (req, res, next) => {
    try {
        // extract token by anyone from this 3 ways
        const token = req.body?.token || req.cookies?.token || req.header('Authorization')?.replace('Bearer ', '');

        // if token is missing
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token is Missing'
            });
        }

        // console.log('Token ==> ', token);
        // console.log('From body -> ', req.body?.token);
        // console.log('from cookies -> ', req.cookies?.token);
        // console.log('from headers -> ', req.header('Authorization')?.replace('Bearer ', ''));

        // verify token
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET || "sprint4secret");
            // console.log('verified decode token => ', decode);
            
            // *********** example from console ***********
            // verified decode token =>  {
            //     email: 'buydavumli@biyac.com',
            //     id: '650d6ae2914831142c702e4c',
            //     accountType: 'Student',
            //     iat: 1699452446,
            //     exp: 1699538846
            //   }
            req.user = decode;
        }
        catch (error) {
            console.log('Error while decoding token');
            console.log(error);
            return res.status(401).json({
                success: false,
                error: error.message,
                messgae: 'Error while decoding token'
            })
        }
        // go to next middleware
        next();
    }
    catch (error) {
        console.log('Error while token validating');
        console.log(error);
        return res.status(500).json({
            success: false,
            messgae: 'Error while token validating'
        })
    }
}



exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies;
  
    if (!token) {
      return res.status(401).json({ message: "Please login to continue" });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY|| "sprint4secret");
  
      // Check if the user exists
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      req.user = user;
      next();
    } catch (error) {
      // Handle JWT errors
      if (error.name === "JsonWebTokenError") {
        return res
          .status(401)
          .json({ message: "Invalid token, please login again" });
      } else if (error.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "Token has expired, please login again" });
      }
  
      // Handle other errors
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });



// ================ IS STUDENT ================
exports.isStudent = (req, res, next) => {
    try {
        // console.log('User data -> ', req.user)
        if (req.user?.accountType != 'Student') {
            return res.status(401).json({
                success: false,
                messgae: 'This Page is protected only for student'
            })
        }
        // go to next middleware
        next();
    }
    catch (error) {
        console.log('Error while cheching user validity with student accountType');
        console.log(error);
        return res.status(500).json({
            success: false,
            error: error.message,
            messgae: 'Error while cheching user validity with student accountType'
        })
    }
}


// ================ IS INSTRUCTOR ================
exports.isInstructor = (req, res, next) => {
    try {
        // console.log('User data -> ', req.user)
        if (req.user?.accountType != 'Instructor') {
            return res.status(401).json({
                success: false,
                messgae: 'This Page is protected only for Instructor'
            })
        }
        // go to next middleware
        next();
    }
    catch (error) {
        console.log('Error while cheching user validity with Instructor accountType');
        console.log(error);
        return res.status(500).json({
            success: false,
            error: error.message,
            messgae: 'Error while cheching user validity with Instructor accountType'
        })
    }
}


// ================ IS ADMIN ================
exports.isAdmin = (req, res, next) => {
    try {
        // console.log('User data -> ', req.user)
        if (req.user.accountType != 'Admin') {
            return res.status(401).json({
                success: false,
                messgae: 'This Page is protected only for Admin'
            })
        }
        // go to next middleware
        next();
    }
    catch (error) {
        console.log('Error while cheching user validity with Admin accountType');
        console.log(error);
        return res.status(500).json({
            success: false,
            error: error.message,
            messgae: 'Error while cheching user validity with Admin accountType'
        })
    }
}




// seller shop auth
exports.isStudentEvent = catchAsyncErrors(async (req, res, next) => {
    const { shop_token } = req.cookies;
  
    if (!shop_token) {
      return res.status(401).json({ message: "Please login to continue" });
    }
  
    try {
      const decoded = jwt.verify(shop_token, process.env.JWT_SECRET_KEY);
  
      // Check if the user exists
      const shop = await Shop.findById(decoded.id);
      if (!shop) {
        return res.status(404).json({ message: "Shop not found" });
      }
  
      req.shop = shop;
      next();
    } catch (error) {
      // Handle JWT errors
      if (error.name === "JsonWebTokenError") {
        return res
          .status(401)
          .json({ message: "Invalid token, please login again" });
      } else if (error.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "Token has expired, please login again" });
      }
  
      // Handle other errors
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });
  
  // Admin auth
  exports.isAdminEvent = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res
          .status(500)
          .json({
            message: `Operation not permitted to ${req.user.role} ..Access denied`,
          });
      }
      next();
    };
  };
  