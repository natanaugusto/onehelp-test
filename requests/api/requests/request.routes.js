'use strict';

const Controller = require('./request.controller');
const RequestController = new Controller();

module.exports = Router => {
  const router = new Router({
    prefix: '/requests',
  });

  router.post('/', RequestController.create);
  // .get('/', RequestController.list)
  // .get('/:id', RequestController.get)
  // .post('/', RequestController.create)
  // .put('/:id', RequestController.update)
  // .all('/', RequestController.patch)
  // .del('/:id', RequestController.delete);

  return router;
};
