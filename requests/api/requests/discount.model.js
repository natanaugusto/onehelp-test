'use strict';

const mongoose = require('mongoose');

const schema = mongoose.Schema({
  type: {
    type: String,
    enum: ['percent', 'absolute'],
    require: true,
  },
  value: {
    type: Number,
    require: true,
  },
  userEmail: {
    type: String,
    required: true,
    lowercase: true,
  },
});

module.exports = mongoose.model('Discount', schema);
