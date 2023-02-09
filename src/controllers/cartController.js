import logger from '../loggers/Log4jsLogger.js';
import connectMongo from '../util/mongo/mongoInit.js';
import nodemailer from '../util/nodemailer/nodemailer.js';
import sendSMS from '../util/twilio/twilio.js';
import { UserService } from '../services/userService.js';
import { CartService } from '../services/cartService.js';

const carritoService = CartService.getInstance();
const userService = UserService.getInstance();

const getCart = async (req, res) => {
    const { carts, users, products } = await connectMongo();
    const user = await users.findUser(req.session.passport.user);

    let data = {};

    if(user.cart_id !== -1 && user.cart_id !== undefined & user.cart_id !== null) {
        const allProds = await products.getAll();
        const cart = await carts.getById(user.cart_id);

        const prods = cart.products.map((p) => {
            const prod = allProds.find(aP => JSON.stringify(aP._id).split('"')[1] === p);
            return prod;
        })
    
        data = {
            prods,
            cartId: JSON.stringify(cart._id).split('"')[1]
        }
    }

    res.render('cart', { data });
}

const addProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = req.body.prod_id;
    
        if(id !== -1 && id !== '-1') {  
            return updateCartById(id, product);
        } else {
            const newCartId = await createCart(req.session.passport.user);
            return updateCartById(newCartId, product)
        }
    }
    catch (e) {
        logger.error(e);
    }
}

const deleteProduct = async (req, res) => {
    try {
        const { cartId, prodId } = req.params;
    
        if(cartId && prodId) {  
            const { carts } = await connectMongo();
            const cart = await carts.getById(cartId);
            cart.products = cart.products.filter(p => p !== prodId);
            await carts.updateById(cart._id, cart);
            logger.info('product deleted');  
        } 
    }
    catch (e) {
        logger.error(e);
    }
}

const checkout = async (req, res) => {
    try {
        const { cartId } = req.params;
    
        if(cartId) {  
            const { carts, products, users } = await connectMongo();
            const cart = await carts.getById(cartId);
            const allProds = await products.getAll();
            let total = 0;

            const productList = cart.products.map((p) => {
                const prod = allProds.find(aP => JSON.stringify(aP._id).split('"')[1] === p);
                return prod;
            });

            let productListHTML = productList.map((p) => {
                total += parseInt(p.price);
                return `
                <li>
                    ${p.title} - $${p.price}
                </li>
                `;
            });

            const message = `<h1>Nuevo pedido de ${req.session.passport.user}</h1> <br>` + '<ul style="list-style-type: circle;">' + productListHTML + '</ul>' + '<br>' + `<p>Total: $${total}</p>`;

            nodemailer.sendNewOrder(message);
            sendSMS(message);

            const user = users.findUser(req.session.passport.user);
            user.cart_id = -1;
            const userId = JSON.stringify(user._id).split('"')[1];
            user.updateById(userId, user);
            cart.products = [];
            await carts.updateById(cart._id, cart);
        } 
    }
    catch (e) {
        logger.error(e);
    }
}


// HELPERS 
async function createCart(username) {
    try{
        const { carts, users } = await connectMongo();
        const response = await carts.createCart();
        const cartId = JSON.stringify(response).split('"')[5];
    
        const user = await users.findUser(username);
        user.cart_id = cartId;
        logger.info(user)
    
        await users.updateById(user._id, user);
        logger.info('cart created');
        return cartId
    }
    catch (e) {
        logger.error(e);
    }
}

async function updateCartById(cartId, product) {
    try {
        const { carts } = await connectMongo();
        const newCart = await carts.getById(cartId);
        newCart.products.push(product);
        await carts.updateById(newCart._id, newCart);

        logger.info('product added');
        return newCart;
    }
    catch (e) {
        logger.error(e);
    }
}

export default {
    getCart,
    addProduct,
    deleteProduct,
    checkout
}