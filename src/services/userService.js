import "../configs/dbConfig.js";
import { UsersModel } from "../models/userModel.js";
import logger from "../loggers/Log4jsLogger.js";

export class UserService {

    ID_FIELD = "_id";
    USERNAME_FIELD = 'username';

    static getInstance() {
        return new UserService();
    }

    constructor() {
        if(typeof UserService.instance === 'object') {
            return UserService.instance;
        }
        UserService.instance = this;
        return this;
    }
    
    async createUser(object) {
        try {
            return await UsersModel.create(object);
        } catch (error) {
            logger.error(error);
            return null;
        }
    }
    
    async loginUser(object) {
        try {
            const user = await UsersModel.findOne({
                [this.USERNAME_FIELD] : object.username
            });
            
            if (!user) {
                logger.info(`User '${object.username}' does not exist`)
                return null;   
            } 
            
            return await user.comparePassword(object.password);
        
        } catch (error) {
            logger.error(error);
            return null;
        }
    }

    async findUserByUsername(username) {
        try {
            return await UsersModel.findOne({ 
                [this.USERNAME_FIELD] : username
            }).exec();
        } catch (error) {
            logger.error(error);
            return null;
        }
    }

    async updateById(pId, newUser) {
        try {
            let user = await UsersModel.findById(pId);
            user = newUser;
            user.save();
            return user;
        } catch (error) {
            logger.error(error);
            return null;
        }
    }

    async deleteCart(username) {
        try {
            const user = await UsersModel.findOne({
                [this.USERNAME_FIELD] : username
            });
            user.cart_id = -1;
            user.save();
            return true;
        } catch (error) {
            logger.error(error);
            return null;
        }
    }
}