'use strict';

const joi = require('joi');

const envSchema = joi
  .object({
    REQUEST_PRICE_PER_HOUR: joi.number().default(50),
  })
  .unknown()
  .required();
/**
 * Validate the env variables using joi.validate()
 */
const { error, value: envVars } = joi.validate(process.env, envSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  requests: {
    pricePerHour: envVars.REQUEST_PRICE_PER_HOUR,
  },
};

module.exports = config;
