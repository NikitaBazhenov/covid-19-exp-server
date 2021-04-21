import cors, { CorsOptions } from 'cors';

const whitelist: string[] = process.env.CORS_WHITELIST?.split(',') || [];

const options: CorsOptions = {
  origin: (origin, callback) => {
    if (origin && whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS :: ${origin}`));
    }
  }
}

export default cors(options);