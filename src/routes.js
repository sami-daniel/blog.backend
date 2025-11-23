'use strict';

import { auth } from "./middleware.js";

export function routes(router) {
    router.get('/health', (_, res) => {
        res.json({ status: 'OK' });
    });

    router.post('/auth/login', auth, (_, res) => {
        res.status(204).send();
    });

    router.get('/posts', auth, (req, res) => {
        const limit = parseInt(req.query.l) || 10;
        const offset = parseInt(req.query.o) || 0;
        
    });

    return router;
}