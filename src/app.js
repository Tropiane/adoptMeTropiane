import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import compression from 'express-compression';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mocksRouter from './routes/mocks.router.js';

import __dirname from './utils.js';
import errorHandler from './middlewares/errors/index.js';
import { config } from './config.js';
import { swaggerOptions } from './utils/swagger.js';
import { addLogger } from './middlewares/errors/logger.js';

const app = express();
const PORT = process.env.PORT || config.port;
const specs = swaggerJSDoc(swaggerOptions);

try {
    mongoose.connect(config.MONGODB_URI);
    console.log('Conexión a MongoDB exitosa.');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error.message);
    process.exit(1);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
app.use(cookieParser());
app.use(addLogger);

app.use("/apidocs", swaggerUi.serve, swaggerUi.setup(specs));
app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/api/adoptions', adoptionsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/mocks', mocksRouter);

app.use(errorHandler);
app.use(
  compression({
    brotli: { enabled: true, zlib: {} },
  })
);

app.get("/loggerTest", (req, res) => {
  req.logger.fatal("Mensaje de nivel fatal");
  req.logger.error("Mensaje de nivel error");
  req.logger.warn("Mensaje de nivel warn");
  req.logger.info("Mensaje de nivel info");
  req.logger.http("Mensaje de nivel http");
  req.logger.debug("Mensaje de nivel debug");

  res.send("Prueba de logs completada. Revisa la consola y/o archivo de logs.");
});


app.listen(PORT, () => console.log(`Listening on ${PORT}`));
