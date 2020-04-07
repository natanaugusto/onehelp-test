const supertest = require('supertest');
const app = require('../index');

const tester = supertest(app);

module.exports = tester;
