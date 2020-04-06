'use strict';

const http = require('http');
const server = require('./server');
const mongoose = require('mongoose');

const { port } = require('./config').server;

async function bootstrap() {
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
  return http.createServer(server.callback()).listen(port);
}

bootstrap()
  .then(server =>
    console.log(`🚀 Server listening on port ${server.address().port}!`),
  )
  .catch(err => {
    setImmediate(() => {
      console.error('Unable to run the server because of the following error:');
      console.error(err);
      process.exit();
    });
  });
