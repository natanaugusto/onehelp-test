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
        201,
        Object.assign(cleaningRequest, {
          price: cleaningRequest.duration * pricePerHour,
        }),
        done,
      );
  });

  it('Create a new cleaning request consuming a percentage discount', async done => {
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
        201,
        Object.assign(cleaningRequest, {
          price: price,
        }),
        done,
      );
  });

  it('Create a new cleaning request consuming a absolute discount', async done => {
    const cleaningRequest = {
      date: moment().format('YYYY-MM-DD'),
      duration: 5,
      user: {
        name: faker.name.findName(),
        email: faker.internet.email().toLowerCase(),
      },
    };
    let discount = {
      type: 'absolute',
      value: 15,
      userEmail: cleaningRequest.user.email,
    };
    await Discount.create(discount);
    // Duration * PricePerHour - Discount value
    const price = cleaningRequest.duration * pricePerHour - discount.value;
    tester
      .post(urlPrefix)
      .send(cleaningRequest)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(
        201,
        Object.assign(cleaningRequest, {
          price: price,
        }),
        done,
      );
    // discount = await Discount.find(discount);
    // expect(discount.length).toEqual(0);
  });

  it('Create a new cleaning request consuming the bigger discount', async done => {
    const cleaningRequest = {
      date: moment().format('YYYY-MM-DD'),
      duration: 5,
      user: {
        name: faker.name.findName(),
        email: faker.internet.email().toLowerCase(),
      },
    };
    let discounts = [
      {
        type: 'absolute',
        value: 15,
        userEmail: cleaningRequest.user.email,
      },
      {
        type: 'percent',
        value: 0.15,
        userEmail: cleaningRequest.user.email,
      },
    ];
    discounts.forEach(async discount => {
      await Discount.create(discount);
    });
    // Duration * PricePerHour - Price * Discount Percent
    const price =
      cleaningRequest.duration * pricePerHour -
      cleaningRequest.duration * pricePerHour * discounts[1].value;
    tester
      .post(urlPrefix)
      .send(cleaningRequest)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(
        201,
        Object.assign(cleaningRequest, {
          price: price,
        }),
        done,
      );
    discounts.forEach(async discount => {
      await Discount.deleteOne(discount);
    });
  });
});
