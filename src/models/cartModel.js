import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(),
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products'
        }
    ]
});

const conn = mongoose.createConnection("mongodb+srv://sasha:coder.sasha@cluster0.ezluz.mongodb.net/ecommerce?retryWrites=true&w=majority");

export const CartsModel = conn.model("cart", Schema);