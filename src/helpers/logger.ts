const { createLogger, format, transports } = require("winston");
const { combine, printf } = format;

const myFormat = printf(
  ({ level = "debug", message = "TEST", label = "", timestamp = "" }) => {
    return `${timestamp} ${level}: ${message}`;
  },
);

const logger = createLogger({
  level: process.env.log,
  format: combine(
    format.timestamp(),
    format.splat(),
    format.simple(),
    myFormat,
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "slowreverber.log" }),
  ],
});

export { logger };
