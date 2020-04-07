'user strict';
const Discount = require('./discount.model');
const { pricePerHour } = require('../../config').requests;

/**
 * Service to deal with Discounts logics
 */
class DiscountService {
  /**
   * Return the prices and discounts for a cleaning request
   * @param {object} request
   * @returns object
   */
  static async getPrice(request) {
    const originalPrice = Math.ceil(request.duration) * pricePerHour;
    let price = originalPrice;
    let discountUsed;
    const discountsFind = await Discount.find({
      userEmail: request.user.email,
    });
    discountsFind.forEach(discount => {
      let newPrice =
        discount.type === 'percent'
          ? originalPrice - originalPrice * discount.value
          : originalPrice - discount.value;
      if (newPrice < price) {
        price = newPrice;
        discountUsed = discount;
      }
    });
    return { price, discountUsed };
  }

  /**
   * Consume all discounts apllyed to a request
   * @param {array} discounts
   */
  static async consumeDiscounts(discounts) {
    try {
      switch (typeof discounts) {
        case 'object':
          await Discount.deleteOne({ _id: discounts._id });
          break;
        case 'array':
          discounts.forEach(async discount => {
            await Discount.deleteOne({ _id: discount._id });
          });
          break;
      }
    } catch (err) {
      throw err;
    }
  }
}

module.exports = DiscountService;
