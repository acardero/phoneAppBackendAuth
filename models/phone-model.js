'use strict';

const mongoose = require('mongoose');

const phoneSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: [true, 'The phone brand is required']
  },
  name: {
    type: String,
    required: [true, 'The phone name is required']
  },
  image: {
    type: String, default: ''
  },
  specs: {
    type: Array,
    default: []
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Phone = mongoose.model('Phone', phoneSchema);

module.exports = Phone;