'use strict';

const Controller = require('./request.controller');
const RequestController = new Controller();

module.exports = Router => {
  const router = new Router({
    prefix: '/requests',
  });

  /**
   *
   * @api {post} /api/v1/requests title
   * @apiName CreateRquests
   * @apiGroup Requests
   * @apiVersion  0.1.0
   *
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
  // .get('/', RequestController.list)
  // .get('/:id', RequestController.get)
  // .post('/', RequestController.create)
  // .put('/:id', RequestController.update)
  // .all('/', RequestController.patch)
  // .del('/:id', RequestController.delete);

  return router;
};
