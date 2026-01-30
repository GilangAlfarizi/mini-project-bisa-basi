import { envsConfig } from '@infrastructure/envs';
import { format, transports } from 'winston';

const transportConsole = new transports.Console({
  format: format.combine(
    format.cli(),
    format.splat(),
    format.timestamp(),
    format.printf((info) => {
      return `${info.timestamp} ${info.level}: ${info.message}`;
    }),
  ),
});

export const winstonConfig = () => {
  if (envsConfig().nodeEnv === 'test') {
    return {
      transports: [
        new transports.File({
          filename: 'logs/test.log',
          level: 'test',
        }),
      ],
    };
  }

  return { transports: [transportConsole] };
};
