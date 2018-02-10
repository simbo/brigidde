import { join } from 'path';
import * as moment from 'moment';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import Chalk from 'chalk';

import { logSettings } from './log-settings';

const timestampFormat = 'YYYY-MM-DD hh:mm:ss.SSS';

const timestamp = () => moment(new Date()).format(timestampFormat);

export const getTransport = (logType, transportType) => {

  const options = logSettings.transports[logType];

  return {

    console: new winston.transports.Console({
      level: options.console.level,
      prettyPrint: true,
      colorize: true,
      silent: options.console.silent,
      timestamp: () => Chalk.dim(timestamp())
    }),

    file: new DailyRotateFile({
      level: options.file.level,
      prettyPrint: true,
      colorize: false,
      silent: options.file.silent,
      timestamp,
      json: false,
      maxFiles: 30,
      datePattern: '.yyyy-MM-dd.log',
      filename: join(logSettings.path, logType)
    })

  }[transportType];

};
