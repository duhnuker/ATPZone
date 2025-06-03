CREATE DATABASE AOFever

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE aus_open_mens_singles (
    id SERIAL PRIMARY KEY,
    year INT NOT NULL,
    champion_country VARCHAR(3) NOT NULL,
    champion_name VARCHAR(100) NOT NULL,
    runners_up_country VARCHAR(3) NOT NULL,
    runners_up VARCHAR(100) NOT NULL,
    score VARCHAR(50) NOT NULL
);

CREATE TABLE aus_open_womens_singles (
    id SERIAL PRIMARY KEY,
    year INT NOT NULL,
    champion_country VARCHAR(3) NOT NULL,
    champion_name VARCHAR(100) NOT NULL,
    runners_up_country VARCHAR(3) NOT NULL,
    runners_up VARCHAR(100) NOT NULL,
    score VARCHAR(50) NOT NULL
);

CREATE TABLE aus_open_mens_doubles (
    id SERIAL PRIMARY KEY,
    year INT NOT NULL,
    champions_countries VARCHAR(10) NOT NULL,
    champions_names VARCHAR(100) NOT NULL,
    runners_up_countries VARCHAR(10) NOT NULL,
    runners_up_names VARCHAR(100) NOT NULL,
    score VARCHAR(50) NOT NULL
);

CREATE TABLE aus_open_womens_doubles (
    id SERIAL PRIMARY KEY,
    year INT NOT NULL,
    champions_countries VARCHAR(10) NOT NULL,
    champions_names VARCHAR(100) NOT NULL,
    runners_up_countries VARCHAR(10) NOT NULL,
    runners_up_names VARCHAR(100) NOT NULL,
    score VARCHAR(50) NOT NULL
);