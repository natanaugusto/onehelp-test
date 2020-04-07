'use strict';
const MockModel = require('jest-mongoose-mock');
const moment = require('moment');
const faker = require('faker/locale/pt_BR');
const tester = require('../tester');
const { pricePerHour } = require('../../config').requests;
const { apiVersion } = require('../../config').server;
const urlPrefix = `/api/${apiVersion}/requests`;

jest.mock('../../api/requests/request.model', () => new MockModel());
// jest.mock('../../api/requests/discount.model', () => new MockModel());

const Discount = require('../../api/requests/discount.model');

describe('POST /requests endpoint', () => {
  it('Creating a new cleaning request', async done => {
    const cleaningRequest = {
      date: moment().format('YYYY-MM-DD'),
      duration: Math.floor(Math.random() * 8),
      user: {
        name: faker.name.findName(),
        email: faker.internet.email().toLowerCase(),
      },
    };
    tester
      .post(urlPrefix)
      .send(cleaningRequest)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(
        200,
        Object.assign(cleaningRequest, {
          price: cleaningRequest.duration * pricePerHour,
        }),
        done,
      );
  });

  it('Create a new cleaning request consuming a discount type percent', async done => {
    const cleaningRequest = {
      date: moment().format('YYYY-MM-DD'),
      duration: 5,
      user: {
        name: faker.name.findName(),
        email: faker.internet.email().toLowerCase(),
      },
    };
    await Discount.create({
      type: 'percent',
      value: 0.2,
      userEmail: cleaningRequest.user.email,
    });
    // Duration * PricePerHour - Price * Discount Percent
    const price =
      cleaningRequest.duration * pricePerHour -
      cleaningRequest.duration * pricePerHour * 0.2;
    tester
      .post(urlPrefix)
      .send(cleaningRequest)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(
        200,
        Object.assign(cleaningRequest, {
          price: price,
        }),
        done,
      );
  });
});
