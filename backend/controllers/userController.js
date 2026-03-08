import User from '../models/User.js';

export const addFavorite = async (req, res) => {
  
  try {
    const { imdbId, title, poster, year, rating } = req.body;
    const user = await User.findById(req.user._id);

    const already = user.favorites.find(f => f.imdbId === imdbId);
    if (already) {
      return res.status(400).json({ message: 'Movie already in favorites' });
    }

    user.favorites.push({ imdbId, title, poster, year, rating });
    await user.save();
    res.json({ message: 'Added to favorites', favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFavorite = async (req, res) => {
  try {
    const { imdbId } = req.params;
    const user = await User.findById(req.user._id);
    user.favorites = user.favorites.filter(f => f.imdbId !== imdbId);
    await user.save();
    res.json({ message: 'Removed from favorites', favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const saveReport = async (req, res) => {
  try {
    const { imdbId, title, poster, sentiment, sentimentScore, summary } = req.body;
    const user = await User.findById(req.user._id);

    const alreadySaved = user.savedReports.find(r => r.imdbId === imdbId);
    if (alreadySaved) {
      // Update existing
      alreadySaved.sentiment = sentiment;
      alreadySaved.sentimentScore = sentimentScore;
      alreadySaved.summary = summary;
      alreadySaved.savedAt = new Date();
    } else {
      user.savedReports.push({ imdbId, title, poster, sentiment, sentimentScore, summary });
    }

    await user.save();
    res.json({ message: 'Report saved', savedReports: user.savedReports });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSavedReports = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.savedReports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteReport = async (req, res) => {
  try {
    const { imdbId } = req.params;
    const user = await User.findById(req.user._id);
    user.savedReports = user.savedReports.filter(r => r.imdbId !== imdbId);
    await user.save();
    res.json({ message: 'Report deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
