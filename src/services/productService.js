import { ProductsModel } from "../models/productsModel.js";
import {BaseDao} from "./BaseDao.js";

export class ProductService extends BaseDao{

    ID_FIELD = "_id";

    static getInstance() {
        return new ProductService();
    }

    constructor() {
        if(typeof ProductService.instance === 'object') {
            return ProductService.instance;
        }
        super();
        ProductService.instance = this;
        return this;
    }
    
    static async exists(id) {
        try {
            return await ProductsModel.findById(id);
        } catch (error) {
            this.logger.error(error);
        }
    }

    async getAll() {
        try {
            return await ProductsModel.find();
        } catch (error) {
            this.logger.error(error);
            return null;
        }
    }
    
    async getProductById(objectId) {
        try {
            const product = await ProductsModel.findOne({
                [this.ID_FIELD] : objectId
            })
            return product;
        } catch (error) {
            this.logger.error(error);
            return null;
        }
    }
    
    async create(object) {
        try {
            return await ProductsModel.create(object)
        } catch (error) {
            this.logger.error(error);
            return null;
        }
    }
    
    async updateProductById(id, object) {
        try {
            await ProductsModel.findByIdAndUpdate(
                {
                    [this.ID_FIELD] : id
                },
                object, 
                {
                    runValidators: true
                })
            return true;
        } catch (error) {
            this.logger.error(error);
            return false;
        }
    }
    
    async deleteById(id) {
        try {
            return await ProductsModel.findByIdAndDelete({[this.ID_FIELD]: id})
        } catch (error) {
            this.logger.error(error);
            return null;
        }
    }
    
}