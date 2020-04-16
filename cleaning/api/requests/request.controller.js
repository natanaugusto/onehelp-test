'use strict';

const ObjectId = require('mongoose').Types.ObjectId;
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
      const reqCreated = await Request.create(request);
      await RequestService.consumeDiscounts(discountUsed);
      ctx.body = reqCreated;
      ctx.status = 201;
    } catch (err) {
      throw err;
    }
  }

  /**
   * List all cleaning requests
   * @param {*} ctx
   */
  async get(ctx) {
    try {
      const requests = await Request.find();
      ctx.body = jsonp(requests);
    } catch (err) {
      throw err;
    }
  }

  /**
   * Update a cleaning request
   * @param {*} ctx
   */
  async update(ctx, next) {
    try {
      const updated = await Request.updateOne(
        { _id: new ObjectId(ctx.params.id) },
        { $set: ctx.request.body },
      );
      if (!updated.n) {
        ctx.status = 404;
        return next();
      }
      ctx.body = await Request.findById(new ObjectId(ctx.params.id));
      ctx.status = 201;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Delete a cleaning request
   * @param {*} ctx
   */
  async delete(ctx) {
    try {
      await Request.deleteOne({ _id: new ObjectId(ctx.params.id) });
      ctx.status = 204;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Update many cleaning request
   * @param {*} ctx
   */
  patch(ctx) {
    try {
      const requests = ctx.request.body;
      requests.forEach(async request => {
        const id = new ObjectId(request._id);
        delete request.id;
        await Request.updateOne({ _id: id }, { $set: request });
      });
      ctx.status = 204;
    } catch (err) {
      throw err;
    }
  }

  async lastUpdate(ctx) {
    try {
      const lastUpdate = jsonp(
        await Request.findOne().sort([['updatedAt', -1]]),
      ).updatedAt;
      ctx.body = { lastUpdate };
    } catch (err) {
      throw err;
    }
  }
}

module.exports = RequestController;
