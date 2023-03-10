import { CartsModel } from '../models/cartModel.js';
import { ProductsModel } from '../models/productModel.js';
import { BaseDao } from "./BaseDao.js";

export class CartService extends BaseDao {

    ID_FIELD = "_id";

    static getInstance() {
        return new CartService();
    }

    constructor() {
        if(typeof CartService.instance === 'object') {
            return CartService.instance;
        }
        super();
        CartService.instance = this;
        return this;
    }

    async create() {
        try {
            return await CartsModel.create({});
        } catch (error) {
            this.logger.error(error);
            return null;
        }
    }

    async getAll() {
        try {
            return await CartsModel.find();
        } catch (error) {
            this.logger.error(error);
            return null;
        }
    }

    async getById(id) {
        try {
            return await CartsModel.findById(id);
        } catch (error) {
            this.logger.error(error);
            return null;
        }
    }
    
    async deleteById(id) {
        try {
            return await CartsModel.findByIdAndDelete({[this.ID_FIELD]: id})
        } catch (error) {
            this.logger.error(error);
            return null;
        }
    }

    async saveProductToCart(id, productId) {
        try {
            const cart = await CartsModel.findById(id);

            const products = cart.products !== null ? cart.products : [];
            products.push(productId);

            cart.products = products;
            cart.save();
            return true;
        } catch (error) {
            this.logger.error(error);
            return false;
        }
    }
    
    async deleteProductFromCart(id, productId) {
        try {
            const cart = await CartsModel.findById(id);
            cart.products.remove(productId);
            cart.save();
            return true;
        } catch (error) {
            this.logger.error(error);
            return false;
        }
    }
    
    async getAllProductsFromCart(id) {
        try {
            return await CartsModel.findById(id).populate({path: 'products', model: ProductsModel}).select({products: 1, _id:0});
        } catch (error) {
            this.logger.error(error);
            return null;
        }
    }
}