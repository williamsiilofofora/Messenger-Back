import express, { Request, Response, ErrorRequestHandler } from 'express';
import morgan from "morgan";
import helmet from "helmet";
import { configuration, IConfig } from "./config";
import { connect } from './database';
import cors from "cors";
import profileRoutes from './routes/profileRoutes';
import loginRoute from "./routes/loginRoute";
import messageRoute from "./routes/messageRoute"
import bodyParser from 'body-parser';
import {
  authenticationInitialize,
  authenticationSession,
} from "./controllers/authentfication";
import session  from 'express-session';
import connectMongo from 'connect-mongo';
import mongoose from "mongoose";
import { initializeSockets } from "./socket";

const MongoStore = connectMongo(session);
const sessionStore = new MongoStore({
  mongooseConnection: mongoose.connection,
});

export function createExpressApp(config: IConfig): express.Express {
  const { express_debug, session_secret,session_cookie_name } = config;

  const app = express();
  app.use(cors({credentials: true, origin: true}));
  app.use(morgan('combined'));
  app.use(helmet());
  app.use(express.json());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
 

  app.use(
    session({
      name: session_cookie_name,
      secret: session_secret,
      resave: false,
      saveUninitialized: false,
      store: sessionStore,
    })
  );

  app.use(authenticationInitialize());
  app.use(authenticationSession());

  

  app.use(((err, _req, res, _next) => {
    console.error(err.stack);
    res.status?.(500).send(!express_debug ? 'Oups' : err);
  }) as ErrorRequestHandler);

  app.use('/profile', profileRoutes);
  app.use('/login', loginRoute);
  app.use('/messages', messageRoute);
  app.get('/', (req: Request, res: Response) => { res.send('This is the boilerplate for Flint Messenger app') });

  
  

  return app;
}

const config = configuration();
const { PORT } = config;
const app = createExpressApp(config);
connect(config).then(() => {
  const server = app.listen(PORT, () =>
    console.log(`Flint messenger listening at ${PORT}`)
  );

  // Initialise les sockets
  initializeSockets(config, server, sessionStore);
});