'use strict';

const mongoose = require('mongoose');

const schema = mongoose.Schema(
  {
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
      required: false,
      default: null,
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
  },
  { timestamps: true },
);

module.exports = mongoose.model('Request', schema);
