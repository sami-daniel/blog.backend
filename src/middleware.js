'use strict';

import bcrypt from 'bcrypt';

async function auth(req, res, next) {
    const token = req.headers['authorization'];
    if (!token || !token.startsWith('Basic ')) {
        res.set('WWW-Authenticate', 'Basic realm="Restricted Area"');
        return res.status(401).json({ 
            success: false,
            error: 'Unauthorized'
         });
    }

    const [user, pass] = Buffer.from(token.substring(6), 'base64').toString().split(':');
    
    if (!user || !pass) {
        res.set('WWW-Authenticate', 'Basic realm="Restricted Area"');
        return res.status(401).json({ 
            success: false,
            error: 'Unauthorized'
        });
    }

    const match = await bcrypt.compare(pass, process.env.ADMIN_PASS_HASH);

    if (user !== process.env.ADMIN_USER || !match) {
        res.status(403).json({ 
            success: false,
            error: 'Forbidden'
        });
        return;
    }

    next();
}

export { auth };