import dotenv from 'dotenv';

dotenv.config();
export const config = {
    port: 8080,
    MONGODB_URI: process.env.MONGODB_URI,
    NODE_ENV: process.env.NODE_ENV
}