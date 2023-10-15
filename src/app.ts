import express, { Application, json } from 'express';
import { createMovie, listMovies, getMovieById, updateMovie, deleteMovie } from './logic';
import { verifyMovieExists, verifyMovieNameExists } from './middlewares/moviesMiddlewares';

const app: Application = express();
app.use(json());

app.post('/movies', verifyMovieNameExists, createMovie);
app.get('/movies', listMovies);
app.get('/movies/:id', verifyMovieExists, getMovieById);
app.patch('/movies/:id', verifyMovieExists, verifyMovieNameExists, updateMovie);
app.delete('/movies/:id', verifyMovieExists, deleteMovie);

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
