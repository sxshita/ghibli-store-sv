import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        max: 100
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true,
        max: 500
    },
    code: {
        type: String,
        required: true,
        max: 6,
        unique: true
    },
    thumbnail: {
        type: String,
        max: 200
    },
    stock: {
        type: Number,
        required: true,
        max: 5000
    }
})

const conn = mongoose.createConnection("mongodb+srv://sasha:coder.sasha@cluster0.ezluz.mongodb.net/ecommerce?retryWrites=true&w=majority");
export const ProductsModel = conn.model("products", Schema);