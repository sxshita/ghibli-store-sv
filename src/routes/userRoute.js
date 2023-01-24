import express from "express";
import userController from "../controllers/userController.js";
import passport from '../util/passport/passport.js';
import upload from '../util/multer/multer.js';
import checkAuth from "../middlewares/auth.middleware.js"; 

const router = express.Router();

router.use(passport.initialize());
router.use(passport.session());

router.get('/', checkAuth, userController.getHome);

// ** [LOGIN] ** //
router.get('/login', userController.getLogin);
router.get('/login/failure', userController.getLoginFail);
router.post('/login', passport.authenticate('auth', {failureRedirect: '/login/failure'}), userController.postLogin);

// ** [REGISTER] ** //
router.get('/register', userController.getRegister);
router.get('/register/failure', userController.getRegisterFail)
router.post('/register', upload.single('file'), passport.authenticate('register', {failureRedirect: '/register/failure', failureMessage: true} ), userController.postRegister);

// ** [LOGOUT] ** //
router.get('/logout', userController.getLogout);

// ** [PROFILE] ** //
router.get('/profile', userController.getProfile);

// ** [CHAT] ** //
router.get('/chat', userController.getChat);

export default router;

