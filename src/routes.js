'use strict';

import { auth } from "./middleware.js";

export function routes(router) {
    router.get('/health', (req, res) => {
        res.json({ status: 'OK' });
    });

    router.post('/auth/login', auth, (req, res) => {
        res.status(204).send();
    });

    return router;
}