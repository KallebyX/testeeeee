import { Request, Response, NextFunction } from 'express';
import { QueryConfig } from 'pg';
import pool from '../database';
import { NewMovie } from '../interfaces';


export const verifyMovieNameExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body as NewMovie;
    const query: QueryConfig = {
      text: 'SELECT * FROM movies WHERE name = $1',
      values: [name],
    };
    const { rowCount } = await pool.query(query);

    if (rowCount > 0) {
      return res.status(409).json({ message: 'Movie name already exists!' });
    }

    next();
  } catch (error) {
    console.error('Error checking movie name:', error);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
};

export const verifyMovieExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID.' });
    }

    const query: QueryConfig = {
      text: 'SELECT * FROM movies WHERE id = $1',
      values: [id],
    };
    const { rowCount } = await pool.query(query);

    if (rowCount === 0) {
      return res.status(404).json({ message: 'Movie not found!' });
    }

    next();
  } catch (error) {
    console.error('Error checking movie existence:', error);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
};
