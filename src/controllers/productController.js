import logger from '../loggers/Log4jsLogger.js';
import { UserService } from '../services/userService.js';
import { ProductService } from '../services/productService.js';

const userService = UserService.getInstance();
const productService = ProductService.getInstance();

const getProducts = async (req, res) => {
    if(req.session.passport?.user) {
        const prods = await productService.getAll();
        const user = await userService.findUserByUsername(req.session.passport?.user);

        const data = {
            prods,
            cartId: user.cart_id
        }

        res.render('products', { data });
    } else {
        res.redirect('/login');
    }  
}

const getProductsAdmin = async (req, res) => {
    const username = req.session.passport?.user;

    if(username) {
        const user = userService.findUserByUsername(username);

        if(user.admin){
            const prods = await productService.getAll();

            res.render('table', { prods, user: username });
        } else {
            res.redirect('/');
        }

    } else {
        res.redirect('/login');
    }  
};

export default {
    getProducts,
    getProductsAdmin
}