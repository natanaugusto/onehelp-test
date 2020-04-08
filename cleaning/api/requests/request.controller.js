'use strict';

const Request = require('./request.model');
const RequestService = require('./discount.service');
const jsonp = require('../../utils/jsonp');

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

  async list(ctx) {
    try {
      const requests = await Request.find();
      ctx.body = jsonp(requests);
    } catch (err) {
      throw err;
    }
  }
}

module.exports = RequestController;
