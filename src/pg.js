'use strict';

import { Pool } from 'pg';

function mountPool() {
    return new Pool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    });
}

export class Client {
    constructor() {
        this.pool = mountPool();
    }
    
    async #openConn() {
        return await this.pool.connect();
    }

    async command(q, params) {
        let res;
        let client;
        try {
            client = await this.#openConn();
            res = await client.query(q, params);
        } finally {
            client.release();
        }

        return res;
    }
}
