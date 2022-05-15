create database songs;
use songs;

CREATE TABLE songs (
    title VARCHAR(50),
    artist VARCHAR(30),
    year INTEGER,
    lyrics TEXT,
    genre VARCHAR(30),
    popularity INTEGER,
    bpm INTEGER,
    energy INTEGER,
    danceability INTEGER,
    song_length INTEGER
);
