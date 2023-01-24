import connectMongo from '../util/mongo/mongoInit.js';

const getProducts = async (req, res) => {
    if(req.session.passport?.user) {
        const {products} = await connectMongo();
        const prods = await products.getAll();

        res.render('products', {prods});
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