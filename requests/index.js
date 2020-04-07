'use strict';

const http = require('http');
const server = require('./server');
const mongoose = require('mongoose');

const { port } = require('./config').server;

function bootstrap() {
  const databaseConfig = require('./config').databaseConfig;
  // eslint-disable-next-line prettier/prettier
  const mongoURI = `${databaseConfig.host}:${databaseConfig.port}/${databaseConfig.database}`;
  // Connection with the MongoDB
  mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
  mongoose.connection.on('error', err => {
    throw new Error(err);
  });

  // Create the server
  const serverCreated =
    process.env.NODE_ENV === 'test'
      ? http.createServer(server.callback())
      : http.createServer(server.callback()).listen(port);
  return serverCreated;
}

const app = bootstrap();
module.exports = app;
