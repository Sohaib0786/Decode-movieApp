import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Film, Eye, EyeOff, User, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error('Please fill all fields'); return; }
    if (mode === 'register' && !form.name) { toast.error('Name is required'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }

    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
        toast.success('Welcome back!');
      } else {
        await register(form.name, form.email, form.password);
        toast.success('Account created!');
      }
      navigate('/');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    background: 'rgba(22,22,40,0.8)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 10, padding: '12px 14px 12px 44px',
    color: '#f0f0f8', fontSize: '0.95rem',
    outline: 'none', transition: 'border-color 0.2s',
    boxSizing: 'border-box'
  };

  return (
    <div style={{
      minHeight: '100vh', paddingTop: '64px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem',
      position: 'relative', overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(124,58,237,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ width: 56, height: 56, background: 'linear-gradient(135deg, #FFB400, #E63946)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <Film size={28} color="#fff" />
          </div>
          <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '2.2rem', letterSpacing: '3px', background: 'linear-gradient(90deg, #FFB400, #ffd460)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            CINESCOPE
          </h1>
          <p style={{ color: '#55557a', fontSize: '0.85rem', marginTop: 4 }}>
            {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
          </p>
        </div>

        {/* Card */}
        <div style={{ background: 'rgba(17,17,33,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '2.5rem', backdropFilter: 'blur(20px)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
          {/* Toggle */}
          <div style={{ display: 'flex', background: 'rgba(8,8,16,0.6)', borderRadius: 10, padding: '4px', marginBottom: '2rem' }}>
            {['login', 'register'].map(m => (
              <button key={m} onClick={() => setMode(m)} style={{ flex: 1, padding: '9px', borderRadius: 8, background: mode === m ? 'rgba(255,180,0,0.12)' : 'transparent', border: mode === m ? '1px solid rgba(255,180,0,0.25)' : '1px solid transparent', color: mode === m ? '#FFB400' : '#55557a', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.2s' }}>
                {m === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {mode === 'register' && (
              <div style={{ position: 'relative' }}>
                <User size={15} color="#55557a" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  type="text" placeholder="Full Name" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'rgba(255,180,0,0.4)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
              </div>
            )}
            <div style={{ position: 'relative' }}>
              <Mail size={15} color="#55557a" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input
                type="email" placeholder="Email Address" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'rgba(255,180,0,0.4)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={15} color="#55557a" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input
                type={showPass ? 'text' : 'password'} placeholder="Password (min 6 chars)" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                style={{ ...inputStyle, paddingRight: 44 }}
                onFocus={e => e.target.style.borderColor = 'rgba(255,180,0,0.4)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#55557a', cursor: 'pointer', padding: 0, display: 'flex' }}>
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '13px',
              background: loading ? 'rgba(255,180,0,0.3)' : 'linear-gradient(135deg, #FFB400, #E63946)',
              border: 'none', borderRadius: 10,
              color: '#fff', fontWeight: 700, fontSize: '0.95rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '0.5rem', letterSpacing: '0.5px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
            }}>
              {loading ? (
                <><div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Processing...</>
              ) : (
                mode === 'login' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
