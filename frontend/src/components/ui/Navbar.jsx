import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Film, User, LogOut, Menu, X, Bookmark } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/');
    setMobileOpen(false);
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(8,8,16,0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      padding: '0 2rem',
      height: '64px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between'
    }}>
      {/* Logo */}
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: 36, height: 36,
          background: 'linear-gradient(135deg, #FFB400, #E63946)',
          borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Film size={20} color="#fff" />
        </div>
        <span style={{
          fontFamily: 'Bebas Neue, sans-serif',
          fontSize: '1.6rem',
          letterSpacing: '2px',
          background: 'linear-gradient(90deg, #FFB400, #ffd460)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>CINESCOPE</span>
      </Link>

      {/* Desktop nav */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} className="desktop-nav">
        {user ? (
          <>
            <Link to="/profile" style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              color: location.pathname === '/profile' ? '#FFB400' : '#9999b8',
              textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500,
              transition: 'color 0.2s'
            }}>
              <Bookmark size={16} />
              My Library
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: 34, height: 34,
                background: 'linear-gradient(135deg, #7c3aed, #E63946)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.85rem', fontWeight: 600, color: '#fff'
              }}>
                {user.name[0].toUpperCase()}
              </div>
              <span style={{ color: '#9999b8', fontSize: '0.9rem' }}>{user.name.split(' ')[0]}</span>
            </div>
            <button onClick={handleLogout} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'rgba(230,57,70,0.1)', border: '1px solid rgba(230,57,70,0.3)',
              color: '#E63946', borderRadius: 8, padding: '7px 14px',
              fontSize: '0.85rem', fontWeight: 500, transition: 'all 0.2s'
            }}>
              <LogOut size={14} /> Logout
            </button>
          </>
        ) : (
          <Link to="/auth" style={{
            background: 'linear-gradient(135deg, #FFB400, #E63946)',
            color: '#fff', textDecoration: 'none',
            padding: '8px 20px', borderRadius: 8,
            fontSize: '0.9rem', fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: '6px'
          }}>
            <User size={15} /> Sign In
          </Link>
        )}
      </div>

      {/* Mobile menu button */}
      <button onClick={() => setMobileOpen(!mobileOpen)} style={{
        background: 'none', border: 'none', color: '#f0f0f8',
        display: 'none'
      }} className="mobile-btn">
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <style>{`
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
          .mobile-btn { display: flex !important; }
        }
      `}</style>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', top: 64, left: 0, right: 0,
          background: 'rgba(8,8,16,0.97)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: '1.5rem 2rem',
          display: 'flex', flexDirection: 'column', gap: '1rem'
        }}>
          {user ? (
            <>
              <Link to="/profile" onClick={() => setMobileOpen(false)}
                style={{ color: '#9999b8', textDecoration: 'none', fontWeight: 500 }}>
                My Library
              </Link>
              <button onClick={handleLogout}
                style={{ background: 'none', border: 'none', color: '#E63946', textAlign: 'left', fontWeight: 500, fontSize: '1rem' }}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/auth" onClick={() => setMobileOpen(false)}
              style={{ color: '#FFB400', textDecoration: 'none', fontWeight: 600 }}>
              Sign In / Register
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
