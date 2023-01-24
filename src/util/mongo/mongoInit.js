
import * as dotenv from 'dotenv';
dotenv.config()
import MongoDbContainer from '../../container.js';
import { MongoClient } from 'mongodb';

async function connectMongo() {
    try {
      const mongo = new MongoClient(process.env.DB_URL);
      const products = new MongoDbContainer(mongo, 'ecommerce', 'products');
      const cart = new MongoDbContainer(mongo, 'ecommerce', 'cart');
      const messages = new MongoDbContainer(mongo, 'chat', 'messages');
      const users =  new MongoDbContainer(mongo, 'userList', 'users');
      await mongo.connect();
      return { products, cart, messages, users};
    }
    catch(err) {
        console.log(`ERROR: ${err}`);
    }
}

export default connectMongo;