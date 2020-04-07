'use strict';

const Request = require('./request.model');
const RequestService = require('./discount.service');

class RequestController {
  /**
   * Create a new Cleaning Request
   * @param {*} ctx
   */
  async create(ctx) {
    const request = ctx.request.body;
    request.duration = Math.ceil(request.duration);
    const { price, discountUsed } = await RequestService.getPrice(request);
    request.price = price;
    try {
      await Request.create(request);
      await RequestService.consumeDiscounts(discountUsed);
      ctx.body = request;
      ctx.status = 201;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = RequestController;
