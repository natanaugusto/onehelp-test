'use strict';

const Request = require('./request.model');
const RequestService = require('./request.service');

class RequestController {
  /**
   * Create a new Cleaning Request
   * @param {*} ctx
   */
  async create(ctx) {
    const request = ctx.request.body;
    request.duration = Math.ceil(request.duration);
    const { price, discounts } = await RequestService.getPrice(request);
    request.price = price;
    try {
      await Request.create(request);
      RequestService.consumeDiscounts(discounts);
      ctx.body = request;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = RequestController;
