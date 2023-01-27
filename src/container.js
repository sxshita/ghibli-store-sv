import logger from './loggers/Log4jsLogger.js';

class MongoDbContainer {
    constructor(mongo, db, coll){
        this.db = db;
        this.coll = coll;
        this.mongo = mongo;
    }

    async save(object) {
        try{
            const res = await this.mongo.db(this.db).collection(this.coll).insertOne(object);
            logger.info(res)
            return res;
        }
        catch(err) {
            console.log(`ERROR: ${err}`);
        }
    }

    async getAll() {
        try{
            const allDocumentsFromCollection = await this.mongo.db(this.db).collection(this.coll).find().toArray();
            return allDocumentsFromCollection;
        }
        catch(err) {
            console.log(`ERROR: ${err}`);
        } 
    }

    async getById(id) {
        try {
            const allDocumentsFromCollection = await this.getAll();
            const document = allDocumentsFromCollection.find((d) => {
                const dId = JSON.stringify(d._id).split('"')[1];
                return dId === id;
            });

            return document;
        }
        catch (e){
            logger.error(e);
        }
    }

    async findUser(username) {
        try {
            const allDocumentsFromCollection = await this.getAll();
            const document = allDocumentsFromCollection.find(d => d.username === username);
            return document;
        }
        catch {

        }
    }

    async createArrayMessages() {
        try{
            const arrayMessagesFromScratch = {id: 444, messages: []};
            const res = await this.save(arrayMessagesFromScratch);
            return res.id;
        }
        catch(err) {
            console.log(`ERROR: ${err}`);
        }
    }

    async updateById(id, object) {
        try{
            const objectId = await this.getById(id);
            const objectUpdate = await this.mongo.db(this.db).collection(this.coll).updateOne({_id: objectId._id}, {
                $set: object
            });
            logger.info("updated:", objectUpdate);
            return objectUpdate;
        }
        catch(err) {
            console.log(`ERROR: ${err}`);
        } 
    }

    async saveMessage(arrayMessagesId, message) {
        try {
            if(arrayMessagesId && message){
                let arrayMessages = await this.getById(arrayMessagesId);

                const messages = arrayMessages.messages;
                messages.push(message);

                arrayMessages.messages = messages;

                await this.updateById(arrayMessagesId, arrayMessages);
            }
            else {
                console.log('Mensaje o ID de mensajes no ingresado');
            }
        }
        catch(err){
            console.log(`ERROR: ${err}`);
        }
    }

    async createCart() {
        try {
            const res = await this.mongo.db(this.db).collection(this.coll).insertOne({
                timestamp: Date.now(),
                products: []
            });

            logger.info(res)
            return res;
        }
        catch (e) {
            
        }
    }

}

export default MongoDbContainer;