import "../configs/db.config.js";
import { UsersModel } from "../models/usersModel.js";
import logger from "../utils/loggers/Log4jsLogger.js";

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
            });
        } catch (error) {
            logger.error(error);
            return null;
        }
    }
}