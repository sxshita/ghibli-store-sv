import { fork } from 'child_process';
import connectMongo from '../util/mongo/mongoInit.js';
import uploadProducts from "../util/faker/uploadProducts.js";
import logger from "../loggers/Log4jsLogger.js";
import os from 'node:os';
import getRandoms from '../apiRandoms.js';
import sendMail from '../util/nodemailer/nodemailer.js';
import bcrypt from 'bcrypt';

const getIndex = async (req, res) => {
    const {products} = await connectMongo();
    const prods = await products.getAll();
    res.render('table', { prods, user: req.session.passport.user });
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
        avatar: req.file.filename
    };
    await users.save(userCreated);
    await sendMail();
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

export default {
    getIndex,
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
}