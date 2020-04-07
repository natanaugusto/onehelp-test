'user strict';
const Discount = require('./discount.model');
const { pricePerHour } = require('../../config').requests;

/**
 * Service to deal with Requests logics
 */
class RequestService {
  /**
   * Return the prices and discounts for a cleaning request
   * @param {object} request
   * @returns object
   */
  static async getPrice(request) {
    let price = Math.ceil(request.duration) * pricePerHour;
    const discounts = await Discount.find({
      userEmail: request.user.email,
    });
    discounts.forEach(({ type, value }) => {
      price = type === 'percent' ? price - price * value : price - value;
    });
    return { price, discounts };
  }

  /**
   * Consume all discounts apllyed to a request
   * @param {array} discounts
   */
  static consumeDiscounts(discounts) {
    try {
      discounts.forEach(async discount => {
        await Discount.deleteOne({ _id: discount._id });
      });
    } catch (err) {
      throw err;
    }
  }
}

module.exports = RequestService;
