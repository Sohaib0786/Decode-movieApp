# 🎬 CineScope — AI Movie Intelligence Platform

A full-stack MERN application that analyzes movies using AI, providing sentiment analysis, rating comparisons, audience insights, and more.

---

## ✨ Features

### Core
- 🔍 **Movie Search** — Search by IMDb ID (`tt0133093`) or title
- 🎭 **Movie Details** — Poster, cast, plot, ratings, awards via OMDb API
- 🤖 **AI Sentiment Analysis** — Powered by Claude (Anthropic API)
- 📊 **Rating Comparison** — IMDb vs Rotten Tomatoes vs Metacritic vs AI Score
- 📈 **Sentiment Breakdown** — Visual bar charts for storytelling, acting, visuals, etc.

### AI Insights
- 💬 **Why audiences love it**
- 👥 **Who should watch**
- ⭐ **Is it worth watching?**
- 🎯 **"If you liked X, try..."** recommendations
- 🏷️ **Mood tags** (e.g., Thrilling, Mind-bending)

### User Accounts
- 🔐 **Authentication** — JWT-based login/register
- ❤️ **Favorites** — Save and manage favorite movies
- 📑 **Saved Reports** — Persist AI sentiment reports

### UI/UX
- 🌙 Dark cinematic theme with gold & crimson accents
- 📱 Fully responsive (mobile + desktop)
- ✨ Smooth animations and transitions
- 🔄 Real-time movie title search suggestions

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- OMDb API Key — free at [omdbapi.com](https://www.omdbapi.com/apikey.aspx)
- Anthropic API Key — at [console.anthropic.com](https://console.anthropic.com)

### 1. Clone & Install

```bash
git clone <your-repo>
cd cinescope
npm install          # installs concurrently for root
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure Environment

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cinescope
JWT_SECRET=your_super_secret_key_here
OMDB_API_KEY=your_omdb_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
CLIENT_URL=http://localhost:5173
```

### 3. Run the App

**Option A — Run both together (from root):**
```bash
npm run dev
```

**Option B — Run separately:**
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

### 4. Open
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api/health

---

## 📁 Folder Structure

```
cinescope/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js  # Login/Register/Me
│   │   ├── movieController.js # OMDb + AI sentiment
│   │   └── userController.js  # Favorites & reports
│   ├── middleware/
│   │   └── auth.js            # JWT protection middleware
│   ├── models/
│   │   └── User.js            # Mongoose user schema
│   ├── routes/
│   │   ├── auth.js
│   │   ├── movie.js
│   │   └── user.js
│   ├── .env.example
│   ├── package.json
│   └── server.js              # Express entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── movie/
│   │   │   │   ├── SentimentPanel.jsx   # AI sentiment + breakdown
│   │   │   │   ├── RatingComparison.jsx # Multi-source rating chart
│   │   │   │   └── InsightsTab.jsx      # AI narrative insights
│   │   │   └── ui/
│   │   │       └── Navbar.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Global auth state
│   │   ├── pages/
│   │   │   ├── HomePage.jsx      # Search + hero
│   │   │   ├── MoviePage.jsx     # Full movie analysis
│   │   │   ├── AuthPage.jsx      # Login / Register
│   │   │   └── ProfilePage.jsx   # Library & reports
│   │   ├── utils/
│   │   │   └── api.js            # Axios instance
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── package.json    # Root: concurrently scripts
└── README.md
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |

### Movies
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/movie/:imdbId` | Fetch movie details |
| POST | `/api/movie/sentiment` | Generate AI sentiment |
| GET | `/api/movie/search?query=` | Search movies |

### User (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/favorites` | Get favorites |
| POST | `/api/user/favorites` | Add favorite |
| DELETE | `/api/user/favorites/:imdbId` | Remove favorite |
| GET | `/api/user/reports` | Get saved reports |
| POST | `/api/user/reports` | Save report |
| DELETE | `/api/user/reports/:imdbId` | Delete report |

---

## 🎨 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Routing | React Router v6 |
| Charts | Recharts |
| Icons | Lucide React |
| Animations | CSS + Framer Motion |
| Notifications | React Hot Toast |
| Backend | Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Movie Data | OMDb API |
| AI Engine | Anthropic Claude API |

---

## 🧪 Example IMDb IDs to Try

| Movie | ID |
|-------|----|
| The Matrix | tt0133093 |
| The Godfather | tt0068646 |
| Interstellar | tt0816692 |
| Inception | tt1375666 |
| The Dark Knight | tt0468569 |
| Parasite | tt6751668 |

---

## 📝 Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Backend port (default: 5000) |
| `MONGODB_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret for JWT signing |
| `OMDB_API_KEY` | Yes | From omdbapi.com (free tier: 1000 req/day) |
| `ANTHROPIC_API_KEY` | Yes | From console.anthropic.com |
| `CLIENT_URL` | No | Frontend URL for CORS (default: localhost:5173) |
