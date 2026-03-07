import express from 'express';
import { getMovieDetails, getAISentiment, searchMovies } from '../controllers/movieController.js';

const router = express.Router();

router.get('/search', searchMovies);
router.get('/:imdbId', getMovieDetails);
router.post('/sentiment', getAISentiment);

export default router;
