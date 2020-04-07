'use strict';
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
};

const MongoProvider = async () => {
  const databaseConfig = require('../config').databaseConfig;
  // eslint-disable-next-line prettier/prettier
  let mongoURI = `${databaseConfig.host}:${databaseConfig.port}/${databaseConfig.database}`;
  if (process.env.NODE_ENV === 'test') {
    const mongod = new MongoMemoryServer();
    mongoURI = await mongod.getConnectionString();
  }
  // Connection with the MongoDB
  mongoose.connect(mongoURI, mongoOptions);
  mongoose.connection.on('error', err => {
    throw new Error(err);
  });
};

module.exports = MongoProvider;
