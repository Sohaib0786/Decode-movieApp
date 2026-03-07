import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, BookmarkCheck, Film, Trash2, ExternalLink, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const tabs = ['Favorites', 'Saved Reports'];

export default function ProfilePage() {
  const { user, refreshUser, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Favorites');
  const [favorites, setFavorites] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/auth'); return; }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [favRes, repRes] = await Promise.all([
        api.get('/user/favorites'),
        api.get('/user/reports')
      ]);
      setFavorites(favRes.data);
      setReports(repRes.data);
    } catch (err) { toast.error('Failed to load data'); }
    finally { setLoading(false); }
  };

  const removeFav = async (imdbId) => {
    try {
      await api.delete(`/user/favorites/${imdbId}`);
      setFavorites(f => f.filter(x => x.imdbId !== imdbId));
      refreshUser();
      toast.success('Removed from favorites');
    } catch (err) { toast.error(err.message); }
  };

  const deleteReport = async (imdbId) => {
    try {
      await api.delete(`/user/reports/${imdbId}`);
      setReports(r => r.filter(x => x.imdbId !== imdbId));
      refreshUser();
      toast.success('Report deleted');
    } catch (err) { toast.error(err.message); }
  };

  const sentimentColors = { positive: '#22d3a5', negative: '#e63946', mixed: '#FFB400' };
  const SentimentIcon = (s) => s === 'positive' ? <TrendingUp size={12} /> : s === 'negative' ? <TrendingDown size={12} /> : <Minus size={12} />;

  if (!user) return null;

  return (
    <div style={{ minHeight: '100vh', paddingTop: '64px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem' }}>
        {/* Profile header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          <div style={{ width: 72, height: 72, background: 'linear-gradient(135deg, #7c3aed, #E63946)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
            {user.name[0].toUpperCase()}
          </div>
          <div>
            <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '2rem', letterSpacing: '2px', marginBottom: 4 }}>{user.name}</h1>
            <p style={{ color: '#55557a', fontSize: '0.85rem' }}>{user.email}</p>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ background: '#111121', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '12px 20px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'Bebas Neue', fontSize: '1.5rem', color: '#E63946' }}>{favorites.length}</div>
              <div style={{ color: '#55557a', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Favorites</div>
            </div>
            <div style={{ background: '#111121', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '12px 20px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'Bebas Neue', fontSize: '1.5rem', color: '#7c3aed' }}>{reports.length}</div>
              <div style={{ color: '#55557a', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Reports</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.25rem', background: 'rgba(13,13,26,0.8)', borderRadius: 12, padding: '4px', marginBottom: '2rem', border: '1px solid rgba(255,255,255,0.06)', width: 'fit-content' }}>
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '9px 20px', borderRadius: 9, background: activeTab === tab ? 'rgba(255,180,0,0.12)' : 'transparent', border: activeTab === tab ? '1px solid rgba(255,180,0,0.25)' : '1px solid transparent', color: activeTab === tab ? '#FFB400' : '#55557a', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>{tab}</button>
          ))}
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
            <div style={{ width: 40, height: 40, border: '3px solid rgba(255,255,255,0.1)', borderTop: '3px solid #FFB400', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          </div>
        ) : activeTab === 'Favorites' ? (
          favorites.length === 0 ? (
            <EmptyState icon={<Heart size={32} color="#55557a" />} title="No Favorites Yet" desc="Search for a movie and hit the heart button to save it here." />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
              {favorites.map(fav => (
                <div key={fav.imdbId} style={{ background: '#111121', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden', position: 'relative', transition: 'transform 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  {fav.poster
                    ? <img src={fav.poster} alt={fav.title} style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover' }} />
                    : <div style={{ width: '100%', aspectRatio: '2/3', background: '#1c1c32', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Film size={32} color="#55557a" /></div>
                  }
                  <div style={{ padding: '0.75rem' }}>
                    <p style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{fav.title}</p>
                    <p style={{ color: '#55557a', fontSize: '0.75rem', marginBottom: '0.75rem' }}>{fav.year} · ⭐ {fav.rating}</p>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => navigate(`/movie/${fav.imdbId}`)} style={{ flex: 1, background: 'rgba(255,180,0,0.1)', border: '1px solid rgba(255,180,0,0.2)', color: '#FFB400', borderRadius: 7, padding: '6px', fontSize: '0.7rem', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                        <ExternalLink size={10} /> View
                      </button>
                      <button onClick={() => removeFav(fav.imdbId)} style={{ background: 'rgba(230,57,70,0.1)', border: '1px solid rgba(230,57,70,0.2)', color: '#E63946', borderRadius: 7, padding: '6px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          reports.length === 0 ? (
            <EmptyState icon={<BookmarkCheck size={32} color="#55557a" />} title="No Saved Reports" desc="Analyze a movie and save the sentiment report to see it here." />
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {reports.map(report => {
                const color = sentimentColors[report.sentiment] || '#FFB400';
                return (
                  <div key={report.imdbId} style={{ background: '#111121', border: `1px solid ${color}22`, borderRadius: 14, padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    {report.poster
                      ? <img src={report.poster} alt={report.title} style={{ width: 52, height: 74, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                      : <div style={{ width: 52, height: 74, background: '#1c1c32', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Film size={16} color="#55557a" /></div>
                    }
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ fontWeight: 600, marginBottom: 4, fontSize: '0.95rem' }}>{report.title}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, background: `${color}15`, color, padding: '3px 8px', borderRadius: 6, fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase' }}>
                          {SentimentIcon(report.sentiment)} {report.sentiment}
                        </span>
                        {report.sentimentScore && (
                          <span style={{ color: '#55557a', fontSize: '0.78rem' }}>Score: <span style={{ color, fontWeight: 600 }}>{report.sentimentScore}/100</span></span>
                        )}
                      </div>
                      {report.summary && <p style={{ color: '#9999b8', fontSize: '0.8rem', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{report.summary}</p>}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                      <button onClick={() => navigate(`/movie/${report.imdbId}`)} style={{ background: 'rgba(255,180,0,0.1)', border: '1px solid rgba(255,180,0,0.2)', color: '#FFB400', borderRadius: 8, padding: '7px 12px', cursor: 'pointer', fontWeight: 600, fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <ExternalLink size={11} /> View
                      </button>
                      <button onClick={() => deleteReport(report.imdbId)} style={{ background: 'rgba(230,57,70,0.1)', border: '1px solid rgba(230,57,70,0.2)', color: '#E63946', borderRadius: 8, padding: '7px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, fontSize: '0.78rem', fontWeight: 600 }}>
                        <Trash2 size={11} /> Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
}

function EmptyState({ icon, title, desc }) {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#111121', borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)' }}>
      <div style={{ marginBottom: '1rem' }}>{icon}</div>
      <h3 style={{ color: '#f0f0f8', marginBottom: 8, fontWeight: 600 }}>{title}</h3>
      <p style={{ color: '#55557a', fontSize: '0.9rem' }}>{desc}</p>
    </div>
  );
}
