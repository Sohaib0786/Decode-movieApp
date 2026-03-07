import express from 'express';
import {
  addFavorite, removeFavorite, getFavorites,
  saveReport, getSavedReports, deleteReport
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All user routes are protected

router.get('/favorites', getFavorites);
router.post('/favorites', addFavorite);
router.delete('/favorites/:imdbId', removeFavorite);

router.get('/reports', getSavedReports);
router.post('/reports', saveReport);
router.delete('/reports/:imdbId', deleteReport);

export default router;
