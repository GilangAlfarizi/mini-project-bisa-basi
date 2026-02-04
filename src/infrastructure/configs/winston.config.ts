import { envsConfig } from '@infrastructure/envs';
import { format, transports } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

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

  if (envsConfig().isProduction) {
    return {
      transports: [
        transportConsole,
        new DailyRotateFile({
          filename: 'logs/error-%DATE%.log',
          level: 'error',
          datePattern: 'YYYY-MM', // Membuat file baru setiap bulan
          zippedArchive: true, // Mengarsipkan file lama dalam format .gz
          maxSize: '20m', // Maksimum ukuran file sebelum split
          maxFiles: '12', // Menyimpan log hingga 12 bulan terakhir
          format: format.combine(format.timestamp(), format.json()),
        }),
        new DailyRotateFile({
          filename: 'logs/combined-%DATE%.log',
          datePattern: 'YYYY-MM',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '12',
          format: format.combine(format.timestamp(), format.json()),
        }),
      ],
    };
  }

  return { transports: [transportConsole] };
};
