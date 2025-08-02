const mongoose = require('mongoose');
const { Schema } = mongoose;

const contractSchema = new Schema({
  commission: {
    type: Number,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: false
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: false
  }
}, {
  timestamps: true // Automatically manage createdAt and updatedAt fields
});

// Creating the Contract model
const Contract = mongoose.model('Contract', contractSchema);

module.exports = Contract;
