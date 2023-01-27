import express from "express";
import cartController from "../controllers/cartController.js";

const router = express.Router();

router.get('/', cartController.getCart);

router.post('/:id/products', cartController.addProduct);

router.post('/:cartId/products/:prodId', cartController.deleteProduct);

router.post('/:cartId/checkout', cartController.checkout);

export default router;