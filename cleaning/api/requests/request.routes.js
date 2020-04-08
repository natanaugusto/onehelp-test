'use strict';

const Controller = require('./request.controller');
const RequestController = new Controller();

module.exports = Router => {
  const router = new Router({
    prefix: '/requests',
  });

  /**
   * @api {post} /api/v1/requests Create Request
   * @apiName CreateRquests
   * @apiGroup Requests
   * @apiVersion  0.1.0
   *
   * @apiParam  {Data} date Date when the cleaning request should be executed
   * @apiParam  {Number} duration Duration of the cleaning request
   * @apiParam  {String} user.name User name
   * @apiParam  {String} user.email User email
   *
   * @apiSuccess (201) {json} A new cleaning request was created
   *
   * @apiParamExample  {json} Request-Example:
   * {
   *   date: '2020-10-26',
   *   duration: 5,
   *   user: {
   *     name: 'Natan Augusto',
   *     email: 'natanaugusto@gmail.com'
   *   }
   * }
   *
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *   date: '2020-10-26',
   *   duration: 5,
   *   price: 250,
   *   user: {
   *     name: 'Natan Augusto',
   *     email: 'natanaugusto@gmail.com'
   *   }
   * }
   */
  router.post('/', RequestController.create);

  /**
   * @api {get} /api/v1/requests List Requests
   * @apiName ListRquests
   * @apiGroup Requests
   * @apiVersion  0.1.0
   *
   * @apiSuccess (200) {json} List of all requests
   *
   * @apiSuccessExample {json} Success-Response:
   * [
   *   {
   *     duration: 3,
   *     price: null,
   *     _id: '5e8d2b3eeb2249ed2136a62a',
   *     date: '2020-04-07T00:00:00.000Z',
   *     user: { name: 'Paula Saraiva', email: 'sulen.silva@live.com' },
   *     __v: 0
   *   },
   *   {
   *     duration: 8,
   *     price: null,
   *     _id: '5e8d2b3eeb2249ed2136a62b',
   *     date: '2020-04-07T00:00:00.000Z',
   *     user: { name: 'Breno Pereira', email: 'fbio_oliveira@live.com' },
   *     __v: 0
   *   }
   * ]
   */
  router.get('/', RequestController.get);

  /**
   * @api {put} /api/v1/requests/:id Update Request
   * @apiName UpdateRequest
   * @apiGroup Requests
   * @apiVersion  0.1.0
   *
   * @apiParam  {Data} date Date when the cleaning request should be executed
   * @apiParam  {Number} duration Duration of the cleaning request
   * @apiParam  {String} user.name User name
   * @apiParam  {String} user.email User email
   *
   * @apiSuccess (204) {empty} No content
   *
   * @apiParamExample  {json} Request-Example:
   * {
   *   date: '2020-10-26',
   *   duration: 5,
   *   user: {
   *     name: 'Natan Augusto',
   *     email: 'natanaugusto@gmail.com'
   *   }
   * }
   *
   * @apiSuccessExample {empty} Success-Response:
   * No Content
   */
  router.put('/:id', RequestController.update);

  /**
   * @api {delete} /api/v1/requests/:id Delete Request
   * @apiName DeleteRequest
   * @apiGroup Requests
   * @apiVersion  0.1.0
   *
   * @apiSuccess (204) {empty} No Content
   *
   * @apiSuccessExample {empty} Success-Response:
   * No Content
   */
  router.del('/:id', RequestController.delete);

  /**
   * @api {patch} /api/v1/requests Patch Requests
   * @apiName PatchRequests
   * @apiGroup Requests
   * @apiVersion  0.1.0
   *
   * @apiParam  {Array} none Multiple requests
   *
   * @apiSuccess (204) {empty} No Content
   *
   * @apiSuccessExample {empty} Success-Response:
   * No Content
   */
  router.all('/', RequestController.patch);

  return router;
};
