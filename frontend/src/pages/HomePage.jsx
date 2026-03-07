import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Film, Sparkles, TrendingUp, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

const FEATURED_IDS = [
  { id: 'tt0133093', title: 'The Matrix' },
  { id: 'tt0068646', title: 'The Godfather' },
  { id: 'tt0111161', title: 'Shawshank' },
  { id: 'tt0816692', title: 'Interstellar' },
  { id: 'tt1375666', title: 'Inception' },
  { id: 'tt0109830', title: 'Forrest Gump' },
];

export default function HomePage() {
  const [input, setInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const val = input.trim();
    if (!val) { toast.error('Enter an IMDb ID or movie title'); return; }
    if (val.match(/^tt\d{7,8}$/)) {
      navigate(`/movie/${val}`);
    } else {
      toast.error('Use IMDb format: tt0133093');
    }
  };

  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.match(/^tt\d/)) {
      setSearchResults([]);
      return;
    }
    const t = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await api.get(`/movie/search?query=${encodeURIComponent(searchQuery)}`);
        setSearchResults(res.data.results?.slice(0, 6) || []);
      } catch { /* silent */ }
      finally { setSearching(false); }
    }, 400);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    setSearchQuery(e.target.value);
  };

  return (
    <div style={{ minHeight: '100vh', paddingTop: '64px' }}>
      {/* Hero */}
      <div style={{
        position: 'relative',
        minHeight: '85vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
        padding: '4rem 2rem'
      }}>
        {/* Background effects */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,180,0,0.08) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', top: '10%', left: '5%', width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', top: '30%', right: '5%', width: 300, height: 300,
          background: 'radial-gradient(circle, rgba(230,57,70,0.06) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: 700, width: '100%', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,180,0,0.1)', border: '1px solid rgba(255,180,0,0.25)',
            borderRadius: 100, padding: '6px 16px', marginBottom: '2rem',
            fontSize: '0.8rem', fontWeight: 600, color: '#FFB400',
            letterSpacing: '1px', textTransform: 'uppercase'
          }}>
            <Sparkles size={12} /> AI-Powered Movie Intelligence
          </div>

          <h1 style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: 'clamp(3.5rem, 10vw, 7rem)',
            lineHeight: 0.9,
            letterSpacing: '4px',
            marginBottom: '1.5rem'
          }}>
            <span style={{
              background: 'linear-gradient(180deg, #f0f0f8 0%, rgba(240,240,248,0.5) 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>DECODE</span>{' '}
            <span style={{
              background: 'linear-gradient(135deg, #FFB400, #E63946)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>EVERY</span>
            <br />
            <span style={{
              background: 'linear-gradient(180deg, #f0f0f8 0%, rgba(240,240,248,0.5) 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>FILM</span>
          </h1>

          <p style={{
            color: '#9999b8', fontSize: '1.1rem', marginBottom: '3rem',
            maxWidth: 480, margin: '0 auto 3rem',
            fontStyle: 'italic', fontFamily: 'Playfair Display, serif'
          }}>
            AI sentiment analysis, audience insights, rating comparisons and more — all from one IMDb ID.
          </p>

          {/* Search box */}
          <div style={{ position: 'relative', maxWidth: 560, margin: '0 auto' }}>
            <form onSubmit={handleSubmit}>
              <div style={{
                display: 'flex',
                background: 'rgba(22,22,40,0.9)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 16,
                overflow: 'hidden',
                boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
                transition: 'border-color 0.2s',
              }}
                onFocus={() => { }}
              >
                <div style={{
                  display: 'flex', alignItems: 'center',
                  paddingLeft: '1.2rem', color: '#55557a'
                }}>
                  <Film size={20} />
                </div>
                <input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Enter IMDb ID (tt0133093) or search..."
                  style={{
                    flex: 1, padding: '1.1rem 1rem',
                    background: 'transparent', border: 'none',
                    color: '#f0f0f8', fontSize: '1rem',
                    outline: 'none'
                  }}
                />
                <button type="submit" style={{
                  background: 'linear-gradient(135deg, #FFB400, #E63946)',
                  border: 'none', padding: '0 1.5rem',
                  color: '#fff', fontWeight: 700,
                  fontSize: '0.9rem', letterSpacing: '0.5px',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 8,
                  transition: 'opacity 0.2s',
                  minWidth: 100
                }}>
                  <Search size={16} /> ANALYZE
                </button>
              </div>
            </form>

            {/* Search suggestions */}
            {(searchResults.length > 0 || searching) && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0,
                background: '#111121',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12, overflow: 'hidden',
                zIndex: 50, boxShadow: '0 20px 60px rgba(0,0,0,0.6)'
              }}>
                {searching ? (
                  <div style={{ padding: '1rem', textAlign: 'center', color: '#55557a', fontSize: '0.9rem' }}>
                    Searching...
                  </div>
                ) : searchResults.map(movie => (
                  <button key={movie.imdbID} onClick={() => navigate(`/movie/${movie.imdbID}`)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '10px 14px', background: 'transparent',
                      border: 'none', borderBottom: '1px solid rgba(255,255,255,0.04)',
                      cursor: 'pointer', textAlign: 'left',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {movie.Poster && movie.Poster !== 'N/A'
                      ? <img src={movie.Poster} alt="" style={{ width: 36, height: 48, objectFit: 'cover', borderRadius: 4 }} />
                      : <div style={{ width: 36, height: 48, background: '#1c1c32', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Film size={16} color="#55557a" /></div>
                    }
                    <div>
                      <div style={{ color: '#f0f0f8', fontSize: '0.9rem', fontWeight: 500 }}>{movie.Title}</div>
                      <div style={{ color: '#55557a', fontSize: '0.8rem' }}>{movie.Year} · {movie.imdbID}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <p style={{ color: '#55557a', fontSize: '0.8rem', marginTop: '1rem' }}>
            Format: tt + 7 digits &nbsp;·&nbsp; Example: tt0133093 (The Matrix)
          </p>
        </div>
      </div>

      {/* Quick access */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 2rem 6rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem' }}>
          <TrendingUp size={18} color="#FFB400" />
          <span style={{ color: '#9999b8', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px' }}>
            Try These
          </span>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '0.75rem'
        }}>
          {FEATURED_IDS.map(m => (
            <button key={m.id} onClick={() => navigate(`/movie/${m.id}`)} style={{
              background: 'rgba(22,22,40,0.6)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 10, padding: '0.75rem 1rem',
              color: '#9999b8', fontSize: '0.85rem',
              cursor: 'pointer', textAlign: 'left',
              transition: 'all 0.2s',
              display: 'flex', flexDirection: 'column', gap: 4
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,180,0,0.3)'; e.currentTarget.style.color = '#f0f0f8'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#9999b8'; }}
            >
              <Zap size={13} color="#FFB400" />
              <span style={{ fontWeight: 500 }}>{m.title}</span>
              <span style={{ fontSize: '0.75rem', color: '#55557a' }}>{m.id}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
