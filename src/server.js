import * as dotenv from 'dotenv';
dotenv.config()
import express from 'express';
import { engine } from "express-handlebars";
import { Server as HttpServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import session from 'express-session';
import passport from './util/passport/passport.js';
import MongoStore from 'connect-mongo';
import connectMongo from './util/mongo/mongoInit.js';
import routes from "./routes/routes.js";
import checkAuth from "./middlewares/auth.middleware.js"; 
import compression from "compression";
import logger from "./loggers/Log4jsLogger.js";
import loggerMiddleware from "./middlewares/routesLogger.middleware.js";
import path from "path";
import { fileURLToPath } from 'url';
import upload from './util/multer/multer.js';
  
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(express.static(path.join(__dirname + '/public')));
app.use(session({
  store: MongoStore.create({ mongoUrl: "mongodb+srv://sasha:coder.sasha@cluster0.ezluz.mongodb.net/?retryWrites=true&w=majority" }),
  secret: 'sushi',
  resave: true,
  cookie: {
    maxAge: 60000
  },
  saveUninitialized: true,
  rolling: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(loggerMiddleware);

app.set('views',path.join(__dirname + '/public/views'));
app.set('view engine','hbs');

app.engine(
  'hbs',
  engine({
      extname: '.hbs',
      defaultLayout: 'index.hbs',
  })
);

// ** [INDEX] ** //

app.get('/', checkAuth, routes.getHome);

// ** [LOGIN] ** //
app.get('/login', routes.getLogin);
app.get('/login/failure', routes.getLoginFail);
app.post('/login', passport.authenticate('auth', {failureRedirect: '/login/failure'}), routes.postLogin);

// ** [REGISTER] ** //
app.get('/register', routes.getRegister);
app.get('/register/failure', routes.getRegisterFail)
app.post('/register', upload.single('file'), passport.authenticate('register', {failureRedirect: '/register/failure', failureMessage: true} ), routes.postRegister);

// ** [LOGOUT] ** //
app.get('/logout', routes.getLogout)

// ** [FAKER PRODUCTS] ** //
app.get('/api/productos-test', routes.getFakerProducts);

// ** [INFO ARGUMENTOS] ** //
app.get('/info', routes.getInfo);

// ** [API RANDOMS] ** //
app.get('/api/randoms', routes.getApiRandoms);

// ** [PROFILE] ** //
app.get('/profile', routes.getProfile);

// ** [PRODUCTS] ** //
app.get('/products', routes.getProducts);

// ** [CHAT] ** //
app.get('/chat', routes.getChat);

// ** [WEBSOCKETS] ** //
const httpServer = new HttpServer(app);
const socketServer = new SocketServer(httpServer);

socketServer.on('connection', async (socket) => {
  const {products, messages} = await connectMongo();
  const myMessages = await messages.getById(333);
 
  socket.emit('products', await products.getAll());
  if(myMessages) socket.emit('messages', myMessages.messages);

  socket.on('new_product', async (product) => {
    try {
      await products.save(product);
      let prods = await products.getAll();
      socketServer.sockets.emit('products', prods);
    }
    catch(err) {
      console.log(err);
    }
    
  });

  socket.on('new_message', async (message) => {
    try {
      const arrayMessagesId = 333;
      await messages.saveMessage(arrayMessagesId, message);
      let arrayMessages = await messages.getById(arrayMessagesId);
      socketServer.sockets.emit('messages', arrayMessages.messages);
    }
    catch(err){
      console.log(`error: ${err}`);
     }
  });

});

app.use((error, req, res, next) => {
  logger.error('Something broke!');
  res.status(500).send(error.message);
})

app.get('*', (req, res, next) => {
  logger.warn('Route not found.')
  res.status(404).send("Sorry can't find that!")
})

const PORT = 8080;

httpServer.listen(PORT, () => {
  logger.info(`🚀 Server started at http://localhost:${PORT}`);
});


httpServer.on('error', (err) => logger.error(err));
