'use strict';

const mongoose = require('mongoose');

const schema = mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
    min: 1,
    max: 8,
    default: 1,
  },
  price: {
    type: Number,
    required: true,
    default: 50.0,
  },
  user: {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
  },
});

module.exports = mongoose.model('Request', schema);
