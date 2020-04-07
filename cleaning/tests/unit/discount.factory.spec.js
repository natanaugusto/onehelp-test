'use strict';

// const MockModel = require('jest-mongoose-mock');
require('../tester');
// jest.mock('../../api/requests/discount.model', () => new MockModel());

const DiscountFactory = require('../../factories/discount.factory');

describe('Test the DiscountFactory', () => {
  const userEmail = 'natan@mail.com';
  it('Testing create Discounts', async done => {
    let discount = await new DiscountFactory().create();
    expect(typeof discount).toBe('object');

    discount = await new DiscountFactory({ userEmail }).create();
    expect(discount.userEmail).toBe(userEmail);

    discount = await new DiscountFactory(null, 5).create();
    expect(discount.length).toBe(5);
    done();
  });

  it('Testing make Discounts', async done => {
    let discount = await new DiscountFactory().make();
    expect(typeof discount).toBe('object');

    discount = await new DiscountFactory({ userEmail }).make();
    expect(discount.userEmail).toBe(userEmail);

    discount = await new DiscountFactory(null, 5).make();
    expect(discount.length).toBe(5);
    done();
  });
});
