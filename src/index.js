'use strict';

import express from 'express';
import os from 'os';
import dotenv from 'dotenv';
import { routes } from './routes.js';
import morgan from 'morgan';

function bootstrap() {
    const app = express();
    app.use(express.json());
    app.use(loadMorgan());
    app.use('/api', routes(express.Router()));

    const port = process.env.PORT || 3000;

    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}

function loadMorgan() {
    const debug = process.env.NODE_ENV !== 'production';
    if (debug) {
        return morgan('dev');
    }

    return morgan('combined');
}

function loadEnv() {
    const nodeEnv = process.env.NODE_ENV || (() => {
        console.warn('NODE_ENV not set, defaulting to development');
        return 'development';
    })();
    const debug = nodeEnv !== 'production';
    
    if (debug) {
        dotenv.config({
            debug: true,
            quiet: false, 
            path: '.env.development'
        });
        console.log('Running in debug mode...');
        return;
    }

    dotenv.config(
        {
            debug: false,
            quiet: true,
            path: '.env.production'
        }
    );
    console.log('Running in production mode...');
}

function checkEnv() { 
    const required = [
        'ADMIN_USER', 'ADMIN_PASS_HASH', 'DB_HOST',
        'DB_USER', 'DB_PASS', 'DB_NAME', 'DB_PORT'];
    required.forEach((envVar) => {
        if (!process.env[envVar] || process.env[envVar] === '') {
            console.error(`Error: Missing required environment variable ${envVar}`);
            process.exit(1);
        }
    });

    const logical = os.cpus();
    if (process.env.UV_THREADPOOL_SIZE && Number(process.env.UV_THREADPOOL_SIZE) < logical.length) {
        console.warn(
`Warning: UV_THREADPOOL_SIZE (${process.env.UV_THREADPOOL_SIZE}) is less
than the number of CPU cores (${logical.length}). Consider increasing
it for better performance.`);
    }
}

loadEnv();
checkEnv();
bootstrap();
