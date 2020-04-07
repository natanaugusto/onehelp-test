'use strict';

const tester = require('../tester');
const { pricePerHour } = require('../../config').requests;
const { apiVersion } = require('../../config').server;
const urlPrefix = `/api/${apiVersion}/requests`;
const RequestFactory = require('../../factories/request.factory');
const DiscountFactory = require('../../factories/discount.factory');

describe('POST /requests endpoint', () => {
  it('Creating a new cleaning request', async done => {
    const cleaningRequest = await new RequestFactory().make();
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
    const cleaningRequest = await new RequestFactory().make();
    const discount = await new DiscountFactory({
      type: 'percent',
      value: 0.2,
      userEmail: cleaningRequest.user.email,
    }).create();
    // Duration * PricePerHour - Price * Discount Percent
    const price =
      cleaningRequest.duration * pricePerHour -
      cleaningRequest.duration * pricePerHour * discount.value;
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
    const cleaningRequest = await new RequestFactory().make();
    const discount = await new DiscountFactory({
      type: 'absolute',
      value: 15,
      userEmail: cleaningRequest.user.email,
    }).create();
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
    const cleaningRequest = await new RequestFactory().make();
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
      await await new DiscountFactory(discount).create();
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
  });
});
