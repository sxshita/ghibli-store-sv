
import * as dotenv from 'dotenv';
dotenv.config()
import MongoDbContainer from '../../container.js';
import { MongoClient } from 'mongodb';

async function connectMongo() {
    try {
      const mongo = new MongoClient("mongodb+srv://sasha:coder.sasha@cluster0.ezluz.mongodb.net/?retryWrites=true&w=majority");
      const products = new MongoDbContainer(mongo, 'ecommerce', 'products');
      const messages = new MongoDbContainer(mongo, 'chat', 'messages');
      const users =  new MongoDbContainer(mongo, 'userList', 'users');
      await mongo.connect();
      return { products, messages, users};
    }
    catch(err) {
        console.log(`ERROR: ${err}`);
    }
}

export default connectMongo;