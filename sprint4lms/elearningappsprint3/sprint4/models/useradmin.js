// models/User.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const Company = require("./Company");

const userAdminSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  profileImage: String,
  email: {
    type: String,
    unique: true,
    required: true
  },
  phoneNo: String,
  password: {
    type: String,
    required: true
  },
  resetPasswordToken: String,
  registerToken: Number,
  userType: String,
  variant: String,
  priority: Number,
  company: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: false
  }
}, {
  timestamps: true // Automatically manage createdAt and updatedAt fields
});

// Creating the User model
const UserAdmin = mongoose.model('UserAdmin', userAdminSchema);

module.exports = UserAdmin;
