'use strict';
const faker = require('faker/locale/pt_BR');
const Factory = require('../utils/factory');
const Discount = require('../api/requests/discount.model');

class DiscountFactory extends Factory {
  schema() {
    return {
      type: faker.random.arrayElement(['absolute', 'percent']),
      value: faker.random.number(10),
      userEmail: faker.internet.email(),
    };
  }

  async modelCreate(values) {
    const created = await Discount.create(values);
    return created;
  }
}

module.exports = DiscountFactory;
