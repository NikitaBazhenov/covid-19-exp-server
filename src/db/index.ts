import axios from 'axios';
import * as fs from 'fs';
import logger from '../logger';

enum Status {
  inProgress = "inProgress",
  idle = "idle"
}

const dataFile = __dirname + '/data.json';
let data: any = null;
let status: Status = Status.idle;


function validateValue(val: any) {
  return val && val > 0 ? val : 0
}

function parse() {
  Object.keys(data).forEach(key => {
    const {location, data: d} = data[key];
    data[key] = {
      location, data: d.map((el: any) => ({
        date: el.date,
        new_cases: validateValue(el.new_cases),
        new_deaths: validateValue(el.new_deaths),
        total_cases: validateValue(el.total_cases),
        total_deaths: validateValue(el.total_deaths),
      }))
    }
    const last = data[key].data[data[key].data.length - 1];
    data[key].total_cases = last.total_cases;
    data[key].total_deaths = last.total_deaths;
  })
}

function createCache() {
  try {
    logger.info('reading data file');
    data = require(dataFile);
    parse();
    logger.success('data is cached successfully!');
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      logger.error('data file not found');
    } else {
      logger.error('data file reading error', err);
    }
    execSync();
  }
}

export async function execSync(): Promise<string> {
  if (status === Status.inProgress) {
    return 'synchronization in progress'
  }

  logger.info('fetching data from remote source');
  status = Status.inProgress;
  try {
    const response = await axios({
      method: 'get',
      url: `${process.env.DATA_URL}`,
      responseType: 'stream'
    });

    const ws = fs.createWriteStream(dataFile);
    response.data.pipe(ws)

    ws.on('close', function () {
      logger.success('synchronization done!');
      createCache();
      status = Status.idle;
    });

    ws.on('error', function (err: Error) {
      logger.error('WriteStream', err);
      status = Status.idle;
    });
  } catch (err) {
    logger.error('Synchronization', err);
    status = Status.idle;
  }
  return 'starting synchronization';
}

export async function fetchData(): Promise<any> {
  return data;
}

createCache();