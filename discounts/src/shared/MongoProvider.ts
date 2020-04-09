import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
};

const MongoProvider = async () => {
  const { DB_HOST, DB_PORT, DB_DATABASE } = process.env;
  // eslint-disable-next-line prettier/prettier
  let mongoURI = `${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;
  if (process.env.NODE_ENV === 'test') {
    const mongod = new MongoMemoryServer();
    mongoURI = await mongod.getConnectionString();
  }
  // Connection with the MongoDB
  mongoose.connect(mongoURI, mongoOptions);
  mongoose.connection.on('error', (err:any) => {
    throw new Error(err);
  });
};

export default MongoProvider;
