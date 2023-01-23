import { fork } from 'child_process';
import connectMongo from '../util/mongo/mongoInit.js';
import uploadProducts from "../util/faker/uploadProducts.js";
import logger from "../loggers/Log4jsLogger.js";
import os from 'node:os';
import getRandoms from '../apiRandoms.js';
import sendMail from '../util/nodemailer/nodemailer.js';
import bcrypt from 'bcrypt';
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getProducts = async (req, res) => {
    if(req.session.passport?.user) {
        const {products} = await connectMongo();
        const prods = await products.getAll();
        res.render('table', { prods, user: req.session.passport.user });
    } else {
        res.redirect('/login');
    }  
};

const getLogin = (_, res) => {
    logger.info();
    res.render('login');
};

const getLoginFail = (_, res) => {
    res.render('login', {error: true});
};

const postLogin = (_, res) => {
    res.redirect('/')
};

const getRegister = (_, res) => {
    res.render('register');
};

const getRegisterFail = (_, res) => {
    res.render('register', {error: true});
}

const postRegister = async (req, res) => {
    const { users } = await connectMongo();
    const passwordHashed = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    const userCreated = { 
        username : req.body.username, 
        password: passwordHashed, 
        name: req.body.name, 
        address : req.body.address, 
        phone: req.body.phone,
        avatar: req.file == undefined ? "empty" : req.file.filename
    };
    await users.save(userCreated);
    await sendMail(userCreated);
    res.redirect('/login');
}

const getLogout = (req, res) => {
    const username = req.session.passport.user;
    if (req.session.passport.user){
      req.logout(function(err) {
        if (err) { return next(err); }
        res.render('logout', { user: username });
      });
    }; 
};

const getApiRandoms = (req, res) => {
    var cant = 1000000;
    if(req.query.cant){
      cant = req.query.cant
    };

    getRandoms(cant);

    // const forked = fork('./apiRandoms.js');
    // forked.send({start: true, cant});
    // forked.on('message', (msg) => {
    //     if(msg){
    //         res.send(msg);
    //     }
    // });
}

const getFakerProducts = async (_, res) => {
    const prods = await uploadProducts();
    res.render('table-test', { prods });
};

const getInfo = (_, res) => {
    const forked = fork('../getInfo.js');
    forked.send({start: true, cant});
    forked.on('message', (msg) => {
        if(msg){
            res.send(msg);
        }
    });
};

const getProfile = async (req, res) => {
    const { users } = await connectMongo();
    let user;
    if(req.session.passport?.user) {
        user = await users.findUser(req.session.passport.user);
        res.render('profile', { user });
    } else {
        res.redirect('/login');
    }
    
}

const getHome = async (req, res) => {
    if(req.session.passport?.user) {
        const user = req.session.passport.user.split('@')[0];
        res.render('home', {user});
    } else {
        res.redirect('/login');
    } 
}

const getChat = async (req, res) => {
    if(req.session.passport?.user) {
        res.render('chat', {user: req.session.passport.user});
    } else {
        res.redirect('/login');
    } 
}

export default {
    getProducts,
    getLogin,
    getLoginFail,
    postLogin,
    getRegister,
    getRegisterFail,
    postRegister,
    getLogout,
    getApiRandoms,
    getFakerProducts,
    getInfo,
    getProfile,
    getHome,
    getChat
}