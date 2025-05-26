CREATE DATABASE ATPZone

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE aus_open_mens_singles (
    id SERIAL PRIMARY KEY,
    year INT NOT NULL,
    champion_country VARCHAR(3) NOT NULL,
    champion_name VARCHAR(100) NOT NULL,
    runner_up_country VARCHAR(3) NOT NULL,
    runner_up VARCHAR(100) NOT NULL,
    score VARCHAR(50) NOT NULL,
);

CREATE TABLE aus_open_womens_singles (
    id SERIAL PRIMARY KEY,
    year INT NOT NULL,
    champion_country VARCHAR(3) NOT NULL,
    champion_name VARCHAR(100) NOT NULL,
    runner_up_country VARCHAR(3) NOT NULL,
    runner_up VARCHAR(100) NOT NULL,
    score VARCHAR(50) NOT NULL,
);