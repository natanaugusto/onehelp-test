'use strict';

require('../tester');

const Discount = require('../../api/requests/discount.model');
const DiscountFactory = require('../../factories/discount.factory');

describe('Test the DiscountFactory', () => {
  const userEmail = 'natan@mail.com';

  it('Testing the reset data for Discounts', async done => {
    const count = 10;
    await new DiscountFactory(null, count).create();
    let discounts = await Discount.find();
    expect(discounts.length).toBe(count);

    await new DiscountFactory(null, count).resetData();
    discounts = await Discount.find();
    expect(discounts.length).toBe(0);
    done();
  });

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
