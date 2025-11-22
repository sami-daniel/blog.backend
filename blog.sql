create database if not exists blog_db;
use blog_db;

create table if not exists posts (
    id int auto_increment primary key,
    title varchar(255) not null,
    content text not null, -- markdown content
    created_at timestamp default current_timestamp
);