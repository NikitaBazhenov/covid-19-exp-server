import express, {
  urlencoded, Request, Response
} from "express";
import { Server } from 'http';
import logger from './logger';
import morgan from 'morgan';
import methodOverride from 'method-override';
import compression from 'compression';
import helmet from 'helmet';
import routes from './routes';

const app = express();

app.use(helmet());
app.use(morgan('[:date[iso]] - :method :url :status - :response-time ms - :remote-addr'));
app.use(urlencoded({limit: '1mb', extended: true }));
app.use(methodOverride());
app.use(compression());
app.use(function (req, res, next) {
  res.set('Cache-control', 'no-cache, no-store')
  next();
})
app.use('/', routes);

app.use(function(req, res){
    res.status(404);
    if (req.accepts('json') || req.xhr) {
      res.send({ error: 'Not found' });
      return;
    }
    res.type('txt').send('Not found');
});

function errorHandler(err: Error, req: Request, res: Response) {
  logger.error('errorHandler', err);
  res.status(500).send({error: `${err.message}`});
}

app.use(errorHandler);

const server = new Server(app);

export async function listen() {
  return new Promise((resolve, reject) => {
    server.listen(process.env.PORT, () => {
      logger.success('server listening on %d, in %s mode', process.env.PORT, process.env.NODE_ENV);
      resolve(true);
    }).on('error', (err) => {
      logger.error(err);      
      reject(err);
    });
  })
}