-- CREATE DATABASE blog_db; If running out of docker compose context

CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL, -- markdown content
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
