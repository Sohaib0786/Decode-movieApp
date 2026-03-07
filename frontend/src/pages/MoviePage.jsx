import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, BookmarkPlus, Star, Calendar, Clock, Globe, Award, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import SentimentPanel from '../components/movie/SentimentPanel';
import RatingComparison from '../components/movie/RatingComparison';
import InsightsTab from '../components/movie/InsightsTab';

const tabs = ['Overview', 'Sentiment', 'Ratings', 'Insights'];

export default function MoviePage() {
  const { imdbId } = useParams();
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [movie, setMovie] = useState(null);
  const [sentiment, setSentiment] = useState(null);
  const [loadingMovie, setLoadingMovie] = useState(true);
  const [loadingSentiment, setLoadingSentiment] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');
  const [error, setError] = useState(null);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => { fetchMovie(); }, [imdbId]);
  useEffect(() => {
    if (user && movie) setIsFav(user.favorites?.some(f => f.imdbId === imdbId));
  }, [user, movie]);

  const fetchMovie = async () => {
    setLoadingMovie(true); setError(null);
    try {
      const res = await api.get(`/movie/${imdbId}`);
      setMovie(res.data);
      fetchSentiment(res.data);
    } catch (err) { setError(err.message); }
    finally { setLoadingMovie(false); }
  };

  const fetchSentiment = async (movieData) => {
    setLoadingSentiment(true);
    try {
      const res = await api.post('/movie/sentiment', {
        title: movieData.title, plot: movieData.plot, genre: movieData.genre,
        year: movieData.year, actors: movieData.actors, imdbRating: movieData.imdbRating,
        awards: movieData.awards
      });
      setSentiment(res.data);
    } catch (err) { console.error('Sentiment error:', err.message); }
    finally { setLoadingSentiment(false); }
  };

  const handleFavorite = async () => {
    if (!user) { toast.error('Sign in to save favorites'); navigate('/auth'); return; }
    try {
      if (isFav) {
        await api.delete(`/user/favorites/${imdbId}`);
        setIsFav(false); toast.success('Removed from favorites');
      } else {
        await api.post('/user/favorites', { imdbId, title: movie.title, poster: movie.poster, year: movie.year, rating: movie.imdbRating });
        setIsFav(true); toast.success('Added to favorites!');
      }
      refreshUser();
    } catch (err) { toast.error(err.message); }
  };

  const handleSaveReport = async () => {
    if (!user) { toast.error('Sign in to save reports'); navigate('/auth'); return; }
    if (!sentiment) { toast.error('Wait for AI analysis to complete'); return; }
    try {
      await api.post('/user/reports', {
        imdbId, title: movie.title, poster: movie.poster,
        sentiment: sentiment.sentimentClassification,
        sentimentScore: sentiment.sentimentScore,
        summary: sentiment.audienceSentimentSummary
      });
      toast.success('Report saved!'); refreshUser();
    } catch (err) { toast.error(err.message); }
  };

  const sentimentColors = { positive: '#22d3a5', negative: '#e63946', mixed: '#FFB400' };

  if (loadingMovie) return (
    <div style={{ minHeight:'100vh', paddingTop:'64px', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:'1.5rem' }}>
      <div style={{ width:64, height:64, border:'3px solid rgba(255,255,255,0.1)', borderTop:'3px solid #FFB400', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
      <div style={{ textAlign:'center' }}>
        <p style={{ color:'#f0f0f8', fontWeight:600, marginBottom:4 }}>Fetching Movie Data</p>
        <p style={{ color:'#55557a', fontSize:'0.85rem' }}>Connecting to OMDb and AI engine...</p>
      </div>
    </div>
  );

  if (error) return (
    <div style={{ minHeight:'100vh', paddingTop:'64px', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:'1.5rem', padding:'2rem' }}>
      <div style={{ fontSize:'4rem' }}>🎬</div>
      <h2 style={{ fontFamily:'Bebas Neue', fontSize:'2rem', letterSpacing:'2px' }}>Movie Not Found</h2>
      <p style={{ color:'#9999b8', textAlign:'center', maxWidth:400 }}>{error}</p>
      <div style={{ display:'flex', gap:'1rem' }}>
        <button onClick={() => navigate('/')} style={{ background:'rgba(22,22,40,0.8)', border:'1px solid rgba(255,255,255,0.1)', color:'#9999b8', borderRadius:10, padding:'10px 20px', cursor:'pointer', fontWeight:600, fontSize:'0.9rem' }}>Back</button>
        <button onClick={fetchMovie} style={{ background:'linear-gradient(135deg,#FFB400,#E63946)', border:'none', color:'#fff', borderRadius:10, padding:'10px 20px', cursor:'pointer', fontWeight:600, fontSize:'0.9rem', display:'flex', alignItems:'center', gap:6 }}><RefreshCw size={14} /> Retry</button>
      </div>
    </div>
  );

  if (!movie) return null;

  return (
    <div style={{ minHeight:'100vh', paddingTop:'64px' }}>
      {movie.poster && <div style={{ position:'fixed', inset:0, zIndex:0, backgroundImage:`url(${movie.poster})`, backgroundSize:'cover', backgroundPosition:'center', filter:'blur(60px) saturate(0.4)', opacity:0.06, transform:'scale(1.1)' }} />}
      <div style={{ position:'relative', zIndex:1, maxWidth:1100, margin:'0 auto', padding:'2rem' }}>
        <button onClick={() => navigate('/')} style={{ display:'flex', alignItems:'center', gap:8, background:'rgba(22,22,40,0.6)', border:'1px solid rgba(255,255,255,0.07)', color:'#9999b8', borderRadius:8, padding:'8px 14px', fontSize:'0.85rem', cursor:'pointer', marginBottom:'2rem' }}>
          <ArrowLeft size={15} /> Back
        </button>

        <div style={{ display:'grid', gridTemplateColumns:'auto 1fr', gap:'2.5rem', marginBottom:'2.5rem', alignItems:'start' }} className="movie-hero">
          <div style={{ position:'relative' }}>
            {movie.poster
              ? <img src={movie.poster} alt={movie.title} style={{ width:200, height:296, objectFit:'cover', borderRadius:16, boxShadow:'0 20px 60px rgba(0,0,0,0.6)', display:'block' }} />
              : <div style={{ width:200, height:296, borderRadius:16, background:'#1c1c32', display:'flex', alignItems:'center', justifyContent:'center' }}><span style={{ fontSize:'3rem' }}>🎬</span></div>
            }
            {sentiment && (
              <div style={{ position:'absolute', bottom:-12, left:'50%', transform:'translateX(-50%)', background:sentimentColors[sentiment.sentimentClassification] || '#FFB400', color:'#000', fontSize:'0.7rem', fontWeight:800, padding:'4px 12px', borderRadius:100, whiteSpace:'nowrap', textTransform:'uppercase', letterSpacing:'1px' }}>
                {sentiment.sentimentClassification}
              </div>
            )}
          </div>

          <div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:'0.75rem' }}>
              {movie.genre?.split(',').map(g => (
                <span key={g} style={{ background:'rgba(255,180,0,0.1)', border:'1px solid rgba(255,180,0,0.2)', color:'#FFB400', padding:'3px 10px', borderRadius:6, fontSize:'0.75rem', fontWeight:600 }}>{g.trim()}</span>
              ))}
            </div>
            <h1 style={{ fontFamily:'Bebas Neue, sans-serif', fontSize:'clamp(2rem,5vw,3.5rem)', letterSpacing:'2px', lineHeight:1, marginBottom:'0.5rem' }}>{movie.title}</h1>
            <p style={{ color:'#9999b8', fontSize:'0.9rem', marginBottom:'1.5rem' }}>Directed by <span style={{ color:'#f0f0f8', fontWeight:500 }}>{movie.director}</span></p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'1.5rem', marginBottom:'1.5rem' }}>
              {[
                { icon: <Star size={14} color="#FFB400" fill="#FFB400" />, label: `${movie.imdbRating}/10`, sub:'IMDb Rating' },
                { icon: <Calendar size={14} color="#9999b8" />, label: movie.year, sub:'Released' },
                { icon: <Clock size={14} color="#9999b8" />, label: movie.runtime, sub:'Runtime' },
                { icon: <Globe size={14} color="#9999b8" />, label: movie.rated, sub:'Rated' },
              ].map(stat => (
                <div key={stat.sub} style={{ display:'flex', flexDirection:'column', gap:2 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:5 }}>{stat.icon}<span style={{ fontSize:'1rem', fontWeight:600, color:'#f0f0f8' }}>{stat.label}</span></div>
                  <span style={{ fontSize:'0.72rem', color:'#55557a', textTransform:'uppercase', letterSpacing:'0.5px' }}>{stat.sub}</span>
                </div>
              ))}
            </div>
            <p style={{ color:'#9999b8', fontSize:'0.85rem', marginBottom:'1.5rem' }}><span style={{ color:'#55557a' }}>Cast: </span>{movie.actors}</p>
            {movie.awards && movie.awards !== 'N/A' && (
              <div style={{ display:'flex', alignItems:'flex-start', gap:8, background:'rgba(255,180,0,0.05)', border:'1px solid rgba(255,180,0,0.15)', borderRadius:10, padding:'10px 14px', marginBottom:'1.5rem', maxWidth:500 }}>
                <Award size={15} color="#FFB400" style={{ marginTop:2, flexShrink:0 }} />
                <span style={{ color:'#9999b8', fontSize:'0.82rem' }}>{movie.awards}</span>
              </div>
            )}
            <div style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap' }}>
              <button onClick={handleFavorite} style={{ display:'flex', alignItems:'center', gap:7, background: isFav ? 'rgba(230,57,70,0.15)' : 'rgba(22,22,40,0.8)', border:`1px solid ${isFav ? 'rgba(230,57,70,0.4)' : 'rgba(255,255,255,0.1)'}`, color: isFav ? '#E63946' : '#9999b8', borderRadius:10, padding:'9px 16px', fontSize:'0.85rem', fontWeight:600, cursor:'pointer' }}>
                <Heart size={15} fill={isFav ? '#E63946' : 'none'} /> {isFav ? 'Saved' : 'Favorite'}
              </button>
              <button onClick={handleSaveReport} style={{ display:'flex', alignItems:'center', gap:7, background:'rgba(22,22,40,0.8)', border:'1px solid rgba(255,255,255,0.1)', color:'#9999b8', borderRadius:10, padding:'9px 16px', fontSize:'0.85rem', fontWeight:600, cursor:'pointer' }}>
                <BookmarkPlus size={15} /> Save Report
              </button>
            </div>
          </div>
        </div>

        <div style={{ display:'flex', gap:'0.25rem', background:'rgba(13,13,26,0.8)', borderRadius:12, padding:'4px', marginBottom:'2rem', border:'1px solid rgba(255,255,255,0.06)', overflowX:'auto' }}>
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ flex:1, minWidth:100, padding:'9px 16px', borderRadius:9, background: activeTab===tab ? 'rgba(255,180,0,0.12)' : 'transparent', border: activeTab===tab ? '1px solid rgba(255,180,0,0.25)' : '1px solid transparent', color: activeTab===tab ? '#FFB400' : '#55557a', fontSize:'0.85rem', fontWeight:600, cursor:'pointer', whiteSpace:'nowrap' }}>{tab}</button>
          ))}
        </div>

        <div style={{ animation:'fadeIn 0.3s ease' }}>
          {activeTab === 'Overview' && (
            <div style={{ display:'grid', gap:'1.5rem' }}>
              <div style={{ background:'#111121', border:'1px solid rgba(255,255,255,0.07)', borderRadius:16, padding:'2rem' }}>
                <h3 style={{ fontFamily:'Bebas Neue', fontSize:'1.3rem', letterSpacing:'1px', color:'#FFB400', marginBottom:'1rem' }}>PLOT SUMMARY</h3>
                <p style={{ color:'#9999b8', lineHeight:1.8, fontSize:'0.95rem' }}>{movie.plot}</p>
              </div>
              {sentiment && (
                <div style={{ background:'#111121', border:'1px solid rgba(255,255,255,0.07)', borderRadius:16, padding:'2rem' }}>
                  <h3 style={{ fontFamily:'Bebas Neue', fontSize:'1.3rem', letterSpacing:'1px', color:'#FFB400', marginBottom:'1rem' }}>AI AUDIENCE SENTIMENT</h3>
                  <p style={{ color:'#9999b8', lineHeight:1.8, fontSize:'0.95rem', marginBottom:'1rem' }}>{sentiment.audienceSentimentSummary}</p>
                  <p style={{ fontStyle:'italic', fontFamily:'Playfair Display, serif', color:'#f0f0f8', fontSize:'1.05rem', borderLeft:'3px solid #FFB400', paddingLeft:'1rem' }}>
                    "{sentiment.criticalConsensus}"
                  </p>
                </div>
              )}
            </div>
          )}
          {activeTab === 'Sentiment' && <SentimentPanel sentiment={sentiment} loading={loadingSentiment} onRetry={() => fetchSentiment(movie)} />}
          {activeTab === 'Ratings' && <RatingComparison movie={movie} sentiment={sentiment} />}
          {activeTab === 'Insights' && <InsightsTab sentiment={sentiment} movie={movie} loading={loadingSentiment} />}
        </div>
      </div>
      <style>{`@media(max-width:640px){.movie-hero{grid-template-columns:1fr !important;}}`}</style>
    </div>
  );
}
