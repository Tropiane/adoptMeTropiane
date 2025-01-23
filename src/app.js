import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import compression from 'express-compression';

import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mocksRouter from './routes/mocks.router.js';

import errorHandler from './middlewares/errors/index.js';
import { config } from './config.js';

const app = express();
const PORT = process.env.PORT|| config.port;

mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use(cookieParser());

app.use('/api/users',usersRouter);
app.use('/api/pets',petsRouter);
app.use('/api/adoptions',adoptionsRouter);
app.use('/api/sessions',sessionsRouter);
app.use("/api/mocks",mocksRouter);

app.use(errorHandler);
app.use(compression({
    brotli:{enabled:true,zlib:{}}
}));
app.get('/pruebacompression',(req,res)=>{
    let string = "soy un string demasiado largo para ser comprimido";
    for (let i = 0; i < 50000; i++) {
        string += "soy un string demasiado largo para ser comprimido";
        
    }
    res.send(string)
})

app.listen(PORT,()=>console.log(`Listening on ${PORT}`))
