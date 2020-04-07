'use strict';
const moment = require('moment');
const faker = require('faker/locale/pt_BR');
const Factory = require('../utils/factory');
const Request = require('../api/requests/request.model');

class RequestFactory extends Factory {
  schema() {
    return {
      date: moment().format('YYYY-MM-DD'),
      duration: Math.floor(Math.random() * 8) + 1,
      user: {
        name: faker.name.findName(),
        email: faker.internet.email().toLowerCase(),
      },
    };
  }

  async modelCreate(values) {
    const created = await Request.create(values);
    return created;
  }
}

module.exports = RequestFactory;
