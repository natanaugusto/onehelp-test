'use strict';
const faker = require('faker/locale/pt_BR');
const Factory = require('../utils/factory');
const Discount = require('../api/requests/discount.model');

class DiscountFactory extends Factory {
  model() {
    return Discount;
  }
  schema() {
    return {
      type: faker.random.arrayElement(['absolute', 'percent']),
      value: faker.random.number(10),
      userEmail: faker.internet.email(),
    };
  }
}

module.exports = DiscountFactory;
