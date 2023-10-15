import { Request, Response } from 'express';
import { QueryConfig } from 'pg';
import pool from './database';
import { Movie, NewMovie } from './interfaces';

const INTERNAL_SERVER_ERROR = 'Internal Server Error.';
const MOVIE_NOT_FOUND = 'Movie not found!';
const MOVIE_NAME_EXISTS = 'Movie name already exists!';

export const createMovie = async (req: Request, res: Response) => {
  try {
    const movieData = req.body as NewMovie;

    const nameCheckQuery: QueryConfig = {
      text: 'SELECT * FROM movies WHERE name = $1',
      values: [movieData.name],
    };
    const nameCheck = await pool.query<Movie>(nameCheckQuery);
    if (nameCheck.rows.length > 0) {
      return res.status(409).json({ message: MOVIE_NAME_EXISTS });
    }

    const query: QueryConfig = {
      text: 'INSERT INTO movies (name, category, duration, price) VALUES ($1, $2, $3, $4) RETURNING *',
      values: [movieData.name, movieData.category, movieData.duration, movieData.price],
    };
    const result = await pool.query<Movie>(query);
    const createdMovie = result.rows[0];

    res.status(201).json(createdMovie);
  } catch (error) {
    console.error('Error creating movie:', error);
    res.status(500).json({ message: INTERNAL_SERVER_ERROR });
  }
};

export const listMovies = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    let queryText = 'SELECT * FROM movies';
    const queryValues: any[] = [];

    if (category) {
      queryText += ' WHERE category = $1';
      queryValues.push(category);
    }

    const query: QueryConfig = {
      text: queryText,
      values: queryValues,
    };

    const result = await pool.query<Movie>(query);
    const movies: Movie[] = result.rows;

    res.status(200).json(movies);
  } catch (error) {
    console.error('Error listing movies:', error);
    res.status(500).json({ message: INTERNAL_SERVER_ERROR });
  }
};

export const getMovieById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const query: QueryConfig = {
      text: 'SELECT * FROM movies WHERE id = $1',
      values: [id],
    };
    const result = await pool.query<Movie>(query);
    const movie = result.rows[0];

    if (!movie) {
      res.status(404).json({ message: MOVIE_NOT_FOUND });
    } else {
      res.status(200).json(movie);
    }
  } catch (error) {
    console.error('Error getting movie by ID:', error);
    res.status(500).json({ message: INTERNAL_SERVER_ERROR });
  }
};

export const updateMovie = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const movieData = req.body as NewMovie;

    const nameCheckQuery: QueryConfig = {
      text: 'SELECT * FROM movies WHERE name = $1 AND id != $2',
      values: [movieData.name, id],
    };
    const nameCheck = await pool.query<Movie>(nameCheckQuery);
    if (nameCheck.rows.length > 0) {
      return res.status(409).json({ message: MOVIE_NAME_EXISTS });
    }

    const query: QueryConfig = {
      text: 'UPDATE movies SET name = $1, category = $2, duration = $3, price = $4 WHERE id = $5 RETURNING *',
      values: [movieData.name, movieData.category, movieData.duration, movieData.price, id],
    };
    const result = await pool.query<Movie>(query);
    const updatedMovie = result.rows[0];

    if (!updatedMovie) {
      res.status(404).json({ message: MOVIE_NOT_FOUND });
    } else {
      res.status(200).json(updatedMovie);
    }
  } catch (error) {
    console.error('Error updating movie:', error);
    res.status(500).json({ message: INTERNAL_SERVER_ERROR });
  }
};


export const deleteMovie = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID.' });
    }

    const query: QueryConfig = {
      text: 'DELETE FROM movies WHERE id = $1',
      values: [id],
    };
    const result = await pool.query(query);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: MOVIE_NOT_FOUND });
    }

    res.status(204).json();
  } catch (error) {
    console.error('Error deleting movie:', error);
    res.status(500).json({ message: INTERNAL_SERVER_ERROR });
  }
};
