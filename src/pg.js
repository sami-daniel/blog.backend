function mountClient() {
    return new Client({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    });
}

export class Client {
    constructor() {
        // TODO: Use pool for better performance
        this.client = mountClient();
    }
    
    async #openConnection() {
        await this.client.connect();
    }

    async #closeConnection() {
        await this.client.end();
    }

    async query(q, params) {
        await this.#openConnection();
        const res = await this.client.query(q, params);
        await this.#closeConnection();
        return res;
    }
}
