import logger from '../loggers/Log4jsLogger.js';
import connectMongo from '../util/mongo/mongoInit.js';

const getProducts = async (req, res) => {
    if(req.session.passport?.user) {
        const { products, users } = await connectMongo();
        const prods = await products.getAll();
        const user = await users.findUser(req.session.passport?.user);
       
        if(user.cart_id === undefined || user.cart_id === null) {
            user.cart_id = '-1';
            logger.info(user.cart_id);
        }

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
    if(req.session.passport?.user) {
        const {users} = await connectMongo();
        const user = users.findUser(req.session.passport?.user);

        if(user.admin){
            const {products} = await connectMongo();
            const prods = await products.getAll();

            res.render('table', { prods, user: req.session.passport.user });
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