import * as dotenv from 'dotenv';
dotenv.config()
import express from 'express';
import cluster from 'cluster';
import { engine } from "express-handlebars";
import { Server as HttpServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import connectMongo from './util/mongo/mongoInit.js';
import compression from "compression";
import logger from "./loggers/Log4jsLogger.js";
import loggerMiddleware from "./middlewares/routesLogger.middleware.js";
import path from "path";
import { fileURLToPath } from 'url';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import * as os from 'os';

const numCPUs = os.cpus().length;
const isMaster = cluster.isPrimary;
  
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(compression());
app.use(express.static(path.join(__dirname + '/../public')));
app.use(session({
  store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  cookie: {
    maxAge: 6000000
  },
  saveUninitialized: true,
  rolling: true
}));
app.use(loggerMiddleware);

app.set('views',path.join(__dirname + '/views'));
app.set('view engine','hbs');

app.engine(
  'hbs',
  engine({
      extname: '.hbs',
      defaultLayout: 'index.hbs',
  })
);

app.use('/', userRouter);
app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter)

// ** [WEBSOCKETS] ** //
const httpServer = new HttpServer(app);
const socketServer = new SocketServer(httpServer);

socketServer.on('connection', async (socket) => {
  const {products, messages} = await connectMongo();
  const myMessages = await messages.getById(process.env.COD_DEPLOYMENT);
 
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
      const arrayMessagesId = process.env.COD_DEPLOYMENT;
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

const PORT = process.env.PORT;

if(process.env.MOD === 'CLUSTER' && isMaster) {

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  };

  cluster.on('exit', (worker) => {
    console.log(`Worker with PID ${worker.process.pid} exited`);
  });
} else {
  httpServer.listen(process.env.PORT, () => {
    logger.info(`🚀 Server started at http://localhost:${process.env.PORT}`);
  });

  httpServer.on('error', (err) => logger.error(err));
}

