'use strict';

const http = require('http');
const server = require('./server');
const { port } = require('./config').server;
const MongoProvider = require('./providers/mongodb.provider');

function bootstrap() {
  MongoProvider();
  // Create the server
  const serverCreated =
    process.env.NODE_ENV === 'test'
      ? http.createServer(server.callback())
      : http.createServer(server.callback()).listen(port);
  return serverCreated;
}

const app = bootstrap();
module.exports = app;
