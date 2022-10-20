import winston, { createLogger, format, transports } from "winston";

const { combine, timestamp, printf } = format;

export const logger = createLogger({
  transports: [
    new transports.Console({
      format: combine(
        format.errors({ stack: true }),
        timestamp(),
        printf(({ message }) => {
          return `${message}`;
        })
      ),
    }),
    new winston.transports.File({
      filename: "system.log",
      format: combine(
        format.errors({ stack: true }),
        timestamp(),
        printf(({ level, message, timestamp }) => {
          return `${timestamp} ${level}: ${message}`;
        })
      ),
    }),
  ],
});
