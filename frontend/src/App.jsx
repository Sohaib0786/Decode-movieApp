import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/ui/Navbar';
import HomePage from './pages/HomePage';
import MoviePage from './pages/MoviePage';
import ProfilePage from './pages/ProfilePage';
import AuthPage from './pages/AuthPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#161628',
              color: '#f0f0f8',
              border: '1px solid rgba(255,255,255,0.07)',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '0.9rem',
            },
            success: { iconTheme: { primary: '#22d3a5', secondary: '#0d0d1a' } },
            error: { iconTheme: { primary: '#e63946', secondary: '#0d0d1a' } },
          }}
        />
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movie/:imdbId" element={<MoviePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/auth" element={<AuthPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
