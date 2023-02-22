import passport from 'passport';
import LocalStrategy from 'passport-local';
import bcrypt from 'bcrypt';
import { UserService } from '../../services/userService.js';

const userService = UserService.getInstance();

passport.use('register', new LocalStrategy (
    async (username, password, done) => {
        //buscar si el usuario ya existe
        const user = await userService.findUserByUsername(username);
        if (user) return done(null, false, {message: 'Ya existe un usuario con ese nombre'});
        // si no existe todavia, hashear password y pushear
        done(null, { username });
    }
));

passport.use('auth', new LocalStrategy (
    async (username, password, done) => {
        //validar usuario y contraseña
        const user = await userService.findUserByUsername(username);
        if (!user || !bcrypt.compareSync(password, user.password)) return done(null, false, {message: 'Usuario o contraseña incorrectos'});
        done(null, user);
    }
));

passport.serializeUser((usuario, callback) => {
    callback(null, usuario.username)
});

passport.deserializeUser(async (username, callback) => {
    const user = await userService.findUserByUsername(username);
    callback(null, user);
});

export default passport;