import { Router } from 'express'
import DiscountController from '@controllers/DiscountController'

const router = Router()
const controller = new DiscountController()

/**
 * 
 * @api {post} /discounts Create Discount
 * @apiName CreateDiscount
 * @apiGroup Discounts
 * @apiVersion v1
 * 
 * @apiParam  {String} type Enum for the types used (percent, absolute)
 * @apiParam  {Number} value The decimal value for the discount
 * @apiParam  {String} userEmail The user email for the discount
 * 
 * @apiParamExample  {json} Request-Example:
 * {
 *    "type": "percent",
 *	  "value": 0.23,
 *    "userEmail": "natan@mail.com"
 * }
 * 
 * @apiSuccess (201) {json} The discount was create
 */
router.post('/', controller.create)

/**
 * 
 * @api {get} /discounts List Discounts
 * @apiName ListDiscounts
 * @apiGroup Discounts
 * @apiVersion v1
 * 
 * @apiSuccess (200) {json} List of discounts
 * @apiSuccessExample {type} Success-Response:
 * [
 *   {
 *       "_id": "5e94f4fa3440ea0043ea3d4e",
 *       "type": "percent",
 *       "value": 0.23,
 *       "userEmail": "natan@mail.com",
 *       "createdAt": "2020-04-13T23:25:46.094Z",
 *       "updatedAt": "2020-04-13T23:25:46.094Z",
 *       "__v": 0
 *   }
 * ]
 * 
 */
router.get('/', controller.list)

/**
 * 
 * @api {patch} /discounts Update many discounts
 * @apiName PatchDiscounts
 * @apiGroup Discounts
 * @apiVersion v1
 * 
 * 
 * @apiParam  {String} type Enum for the types used (percent, absolute)
 * @apiParam  {Number} value The decimal value for the discount
 * @apiParam  {String} userEmail The user email for the discount
 * 
 * @apiSuccess (204) {type} name description
 * 
 * @apiParamExample  {type} Request-Example:
 * [
 *   {
 *       "_id": "5e94f4fa3440ea0043ea3d4e",
 *       "type": "percent",
 *       "value": 0.23,
 *       "userEmail": "natan@mail.com"
 *   },
 *   {
 *       "_id": "5e94f4fa3440ea0043ea3d4e",
 *       "type": "percent",
 *       "value": 0.23,
 *       "userEmail": "natan@mail.com"
 *   }
 * ]
 * 
 * 
 * @apiSuccessExample {empty} Success-Response:
 * No Content
 * 
 * 
 */
router.patch('/', controller.patch)

/**
 * 
 * @api {put} /discounts/:id Update Discount
 * @apiName UpdateDiscount
 * @apiGroup Discounts
 * @apiVersion v1
 * 
 * @apiParam  {String} type Enum for the types used (percent, absolute)
 * @apiParam  {Number} value The decimal value for the discount
 * @apiParam  {String} userEmail The user email for the discount
 * 
 * @apiParamExample  {json} Request-Example:
 * {
 *    "type": "percent",
 *	  "value": 0.23,
 *    "userEmail": "natan@mail.com"
 * }
 * 
 * @apiSuccess (201) {json} The discount was updated
 */
router.put('/:id', controller.update)

/**
 * @api {delete} /discounts/:id Delete Discount
 * @apiName DeleteDiscount
 * @apiGroup Discounts
 * @apiVersion v1
 *
 * @apiSuccess (204) {empty} No Content
 *
 * @apiSuccessExample {empty} Success-Response:
 * No Content
 */
router.delete('/:id', controller.delete)

/**
 * 
 * @api {get} /discounts/last-update Last Update Discount Date
 * @apiName LastUpdateDiscount
 * @apiGroup Discount
 * @apiVersion v1
 * 
 * @apiSuccess (200) {json} The last updated data
 * 
 * @apiSuccessExample {json} Success-Response:
 * {
 *     lastUpdate: '2020-04-15T00:52:27.947Z'
 * }
 * 
 * 
 */
router.get('/last-update', controller.lastUpdate)

export default router
