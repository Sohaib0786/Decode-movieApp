import axios from 'axios';

// Fetch movie details from OMDb
export const getMovieDetails = async (req, res) => {
  
  try {
    
    const { imdbId } = req.params;

    if (!imdbId || !imdbId.match(/^tt\d{7,8}$/)) {
      return res.status(400).json({ 
        message: 'Invalid IMDb ID format. Use format: tt0133093' });
    }

    const omdbKey = process.env.OMDB_API_KEY;
    if (!omdbKey) {
      return res.status(500).json({ message: 'OMDb API key not configured' });
    }

    const response = await axios.get(`https://www.omdbapi.com/?i=${imdbId}&plot=full&apikey=${omdbKey}`);
    const data = response.data;

    if (data.Response === 'False') {
      return res.status(404).json({ message: data.Error || 'Movie not found' });
    }

    // Parse Rotten Tomatoes rating if available
    const rtRating = data.Ratings?.find(r => r.Source === 'Rotten Tomatoes');
    const metaScore = data.Ratings?.find(r => r.Source === 'Metacritic');

    const movie = {
      imdbId: data.imdbID,
      title: data.Title,
      year: data.Year,
      rated: data.Rated,
      released: data.Released,
      runtime: data.Runtime,
      genre: data.Genre,
      director: data.Director,
      writer: data.Writer,
      actors: data.Actors,
      plot: data.Plot,
      language: data.Language,
      country: data.Country,
      awards: data.Awards,
      poster: data.Poster !== 'N/A' ? data.Poster : null,
      imdbRating: data.imdbRating,
      imdbVotes: data.imdbVotes,
      rottenTomatoes: rtRating ? rtRating.Value : null,
      metaScore: metaScore ? metaScore.Value : null,
      boxOffice: data.BoxOffice,
      type: data.Type,
    };

    res.json(movie);

  } catch (error) {
    if (error.response?.status === 401) {
      return res.status(401).json({ message: 'Invalid OMDb API key' });
    }
    res.status(500).json({ message: 'Failed to fetch movie details', error: error.message });
  }
};

// Generate AI sentiment analysis using Google Gemini API
export const getAISentiment = async (req, res) => {
  
  try {
    const { title, plot, genre, year, actors, imdbRating, awards } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Movie title is required' });
    }

    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) {
      return res.status(500).json({ message: 'Gemini API key not configured' });
    }

  const prompt = `You are a film critic and audience sentiment analyst. Analyze the following movie and provide detailed insights.

Movie: "${title}" (${year})
Genre: ${genre}
Cast: ${actors}
Plot: ${plot}
IMDb Rating: ${imdbRating}/10
Awards: ${awards}

Provide a comprehensive JSON response with EXACTLY this structure (no markdown, pure JSON):
{
  "sentimentClassification": "positive" or "mixed" or "negative",
  "sentimentScore": <number 0-100>,
  "confidenceScore": <number 0-100>,
  "audienceSentimentSummary": "<2-3 sentence summary of how audiences feel about this movie>",
  "whyAudiencesLoveIt": "<2-3 sentences explaining what audiences appreciate most>",
  "whoShouldWatch": "<2-3 sentences about the ideal audience for this movie>",
  "isItWorthWatching": "<2-3 sentences with a clear recommendation>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>"],
  "sentimentBreakdown": {
    "storytelling": <number 0-100>,
    "acting": <number 0-100>,
    "visuals": <number 0-100>,
    "soundtrack": <number 0-100>,
    "replayValue": <number 0-100>
  },
  "recommendedIfYouLiked": ["<movie 1>", "<movie 2>", "<movie 3>"],
  "moodTags": ["<tag1>", "<tag2>", "<tag3>", "<tag4>"],
  "criticalConsensus": "<One punchy sentence summarizing the overall verdict>"
}`;

    // Call Gemini 2.0 Flash API
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1500,
        }
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const rawText = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) throw new Error('Empty response from Gemini');

    // Strip markdown code fences if present, then parse JSON
    const cleaned = rawText.replace(/```json\s*|```\s*/g, '').trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Could not extract JSON from Gemini response');

    const sentiment = JSON.parse(jsonMatch[0]);
    res.json(sentiment);

  } catch (error) {
    if (error.response?.status === 400) {
      return res.status(400).json({ message: 'Invalid request to Gemini API', error: error.response.data });
    }
    if (error.response?.status === 403) {
      return res.status(403).json({ message: 'Invalid or unauthorized Gemini API key' });
    }
    console.error('Gemini Sentiment Error:', error.message);
    res.status(500).json({ message: 'Failed to generate AI insights', error: error.message });
  }
};

// Search movies
export const searchMovies = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: 'Search query required' });

    const omdbKey = process.env.OMDB_API_KEY;
    const response = await axios.get(`https://www.omdbapi.com/?s=${encodeURIComponent(query)}&type=movie&apikey=${omdbKey}`);
    const data = response.data;

    if (data.Response === 'False') {
      return res.json({ results: [] });
    }

    res.json({ results: data.Search || [] });
  } catch (error) {
    res.status(500).json({ message: 'Search failed', error: error.message });
  }
};
