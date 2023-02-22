import bcrypt from 'bcrypt';
import logger from "../loggers/Log4jsLogger.js";
import nodemailer from '../util/nodemailer/nodemailer.js';
import { UserService } from '../services/userService.js';

const userService = UserService.getInstance();

const getLogin = (_, res) => {
    res.render('login');
};

const getLoginFail = (_, res) => {
    res.render('login', {error: true});
};

const postLogin = async (_, res) => {
    res.redirect('/')
};

const getRegister = (_, res) => {
    res.render('register');
};

const getRegisterFail = (_, res) => {
    res.render('register', {error: true});
}

const postRegister = async (req, res) => {
    const passwordHashed = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));

    const userCreated = { 
        username : req.body.username, 
        password: passwordHashed, 
        name: req.body.name, 
        address : req.body.address, 
        phone: req.body.phone,
        avatar: req.file == undefined ? "empty" : req.file.filename
    };

    await userService.createUser(userCreated);

    await nodemailer.sendNewUserMail(userCreated);

    res.redirect('/login');
};

const getLogout = (req, res) => {
    const username = req.session.passport.user;

    if (req.session.passport.user){
       req.logout(function(err) {
            if (err) { 
                return next(err); 
            }
            res.render('logout', { user: username });
        });
    }; 
};

const getProfile = async (req, res) => {
    const username = req.session.passport?.user;
    let user;

    if(username) {
        user = await userService.findUserByUsername(username);

        res.render('profile', { user });
    } else {
        res.redirect('/login');
    }
    
}

const getHome = async (req, res) => {
    const username = req.session.passport?.user;

    if(username) {
        const user = userService.findUserByUsername(username);

        user.nickname = username.split('@')[0];

        res.render('home', { user });
    } else {
        res.redirect('/login');
    } 
}

const getChat = async (req, res) => {
    const user = req.session.passport?.user;

    if(user) {
        res.render('chat', { user });
    } else {
        res.redirect('/login');
    } 
}

export default {
    getLogin,
    getLoginFail,
    postLogin,
    getRegister,
    getRegisterFail,
    postRegister,
    getLogout,
    getProfile, 
    getHome,
    getChat
}