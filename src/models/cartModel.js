import mongoose from "mongoose";

const Schema = new mongoose.Schema({
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

export const CartsModel = mongoose.model("carts", Schema);