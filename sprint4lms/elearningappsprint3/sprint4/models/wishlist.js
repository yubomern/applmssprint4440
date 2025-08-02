

const mongoose = require('mongoose');
const { Schema } = mongoose;
const User  = require("./user");
const wishlistSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Productshop',
    required: false
  }
}, {
  timestamps: true // Automatically manage createdAt and updatedAt fields
});

// Creating the Wishlist model
const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist;
