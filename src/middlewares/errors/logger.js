import winston from "winston";

const customLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
  },
  colors: {
    fatal: "red",
    error: "yellow",
    warn: "blue",
    info: "green",
    http: "magenta",
    debug: "magenta",
  },
};

winston.addColors(customLevels.colors);

const devLogger = winston.createLogger({
  levels: customLevels.levels,
  transports: [
    new winston.transports.Console({
      level: "debug",
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

const prodLogger = winston.createLogger({
  levels: customLevels.levels,
  transports: [
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
    new winston.transports.File({
      filename: "./errors.log",
      level: "warn",
      format: winston.format.json(),
    }),
  ],
});

export const addLogger = (req, res, next) => {
  req.logger = logger;
  req.logger.info(`${req.method} ${req.url} - ${req.ip}`);
  next();
};

const logger =
  process.env.NODE_ENV === "production" ? prodLogger : devLogger;


export default logger;
