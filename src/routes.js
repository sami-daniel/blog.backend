'use strict';

import { auth } from "./middleware.js";
import { Client } from './pg.js';
import slug from "slug";

export function routes(router) {
    router.get('/health', (_, res) => {
        res.json({ status: 'OK' });
    });

    router.post('/auth/login', auth, (_, res) => {
        res.status(204).send();
    });

    router.get('/posts', async (req, res) => {
        const limit = parseInt(req.query.l) || 10;
        const offset = parseInt(req.query.o) || 0;

        const client = new Client();
        const result = await client.command(
            'SELECT id, title, content, created_at FROM posts ORDER BY created_at DESC LIMIT $1 OFFSET $2',
            [limit, offset]
        );

        res.json({ posts: result.rows });
    });

    router.post('/posts', auth, async (req, res) => {
        const { title, content } = req.body;
        
        if (!title || !content) {
            return res.status(400).json({
                success: false,
                error: 'Title and content are required'
            });
        }

        const slugifiedTitle = slug(title, { lower: true });
        const client = new Client();
        const exists = await client.command(
            'SELECT id FROM posts WHERE slug = $1',
            [slugifiedTitle]
        );

        if (exists.rows.length > 0) {
            return res.status(409).json({
                success: false,
                error: 'A post with this title already exists'
            });
        }

        const result = await client.command(
            'INSERT INTO posts (title, slug, content) VALUES ($1, $2, $3) RETURNING id, title, slug, content, created_at',
            [title, slugifiedTitle, content]
        );

        res.set('Location', `/api/posts/${result.rows[0].id}`);
        res.status(201).json({ 
            success: true,
            post: result.rows[0] 
        });
    });

    router.get('/posts/:id', async (req, res) => {
        // id is identifier, not necessarily numeric
        let identifier = parseInt(req.params.id);
        let isSlug = false;
        if (isNaN(identifier)) {
            isSlug = true;
            identifier = req.params.id;
        }

        const client = new Client();
        const result = await client.command(
            `SELECT id, title, content, created_at FROM posts WHERE ${isSlug ? 'slug' : 'id'} = $1`,
            [identifier]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Post not found'
            });
        }

        res.json({
            success: true,
            post: result.rows[0] 
        });
    });

    router.get('/search', async (req, res) => {
        const query = req.query.q;
        if (!query || query.trim() === '') {
            return res.status(400).json({
                success: false,
                error: 'Search query is required'
            });
        }

        const client = new Client();
        const result = await client.command(
            `SELECT id, title, content, created_at FROM posts WHERE title ILIKE $1 OR content ILIKE $1 ORDER BY created_at DESC`,
            [`%${query}%`]
        );

        res.json({ 
            success: true, 
            posts: result.rows
        });
    });

    return router;
}