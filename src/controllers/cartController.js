import logger from '../loggers/Log4jsLogger.js';
import nodemailer from '../util/nodemailer/nodemailer.js';
import sendSMS from '../util/twilio/twilio.js';
import { UserService } from '../services/userService.js';
import { CartService } from '../services/cartService.js';
import { ProductService } from '../services/productService.js';

const cartService = CartService.getInstance();
const userService = UserService.getInstance();
const productService = ProductService.getInstance();

const getCart = async (req, res) => {
    const username = req.session.passport.user;
    const user = await userService.findUserByUsername(username);

    let data = {};

    if(user.cart_id !== -1 && user.cart_id !== undefined && user.cart_id !== null) {
        const cart = await cartService.getById(user.cart_id);

        if(cart !== null) {
            var prods = await Promise.all(cart?.products?.map(async (p) => {
                const prod = await productService.getProductById(p);
                return prod;
            }));
        }
        
        data = {
            prods,
            cartId: cart?._id
        }
    }

    res.render('cart', { data });
}

const addProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = req.body.prod_id;
    
        if(id !== -1 && id !== '-1') {  
            return cartService.saveProductToCart(id, product);
        } else {
            const newCartId = await createCart(req.session.passport.user);
            return cartService.saveProductToCart(newCartId, product);
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
            await cartService.deleteProductFromCart(cartId, prodId);
            logger.info('product deleted');  
        } 
    }
    catch (e) {
        logger.error(e);
    }
}

const checkout = async (req, _) => {
    try {
        const { cartId } = req.params;
    
        if(cartId) {  
            const username = req.session.passport.user;
            const cart = await cartService.getById(cartId);

            const message = await generateOrderHTML(cartId, username);
            await sendMessages(message);

            await userService.deleteCart(username);
            await cartService.deleteById(cart._id);
        } 
    }
    catch (e) {
        logger.error(e);
    }
}


// HELPERS 
async function createCart(username) {
    try{
        const response = await cartService.create();
        const cartId = JSON.stringify(response).split('"')[5];
    
        const user = await userService.findUserByUsername(username);
        user.cart_id = cartId;
        logger.info(user)
    
        await userService.updateById(user._id, user);
        logger.info('cart created');
        return cartId;
    }
    catch (e) {
        logger.error(e);
    }
}

async function generateOrderHTML(cartId, username) {
    const productList = await cartService.getAllProductsFromCart(cartId);
    
    let total = 0;

    let productListHTML = productList.products.map((p) => {
        total += parseInt(p.price);
        return `
        <li>
            ${p.title} - $${p.price}
        </li>
        `;
    });

    return `<h1>Nuevo pedido de ${username}</h1> <br>` + '<ul style="list-style-type: circle;">' + productListHTML + '</ul>' + '<br>' + `<p>Total: $${total}</p>`;
};

async function sendMessages(message) {
    nodemailer.sendNewOrder(message);
    sendSMS(message);
}

export default {
    getCart,
    addProduct,
    deleteProduct,
    checkout
}