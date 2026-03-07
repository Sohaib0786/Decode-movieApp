import { RefreshCw, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from 'recharts';

export default function SentimentPanel({ sentiment, loading, onRetry }) {
  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', padding: '4rem', background: '#111121', borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)' }}>
      <div style={{ width: 48, height: 48, border: '3px solid rgba(255,255,255,0.1)', borderTop: '3px solid #FFB400', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#f0f0f8', fontWeight: 600 }}>Analyzing Audience Sentiment</p>
        <p style={{ color: '#55557a', fontSize: '0.85rem', marginTop: 4 }}>AI is processing movie data...</p>
      </div>
    </div>
  );

  if (!sentiment) return (
    <div style={{ textAlign: 'center', padding: '4rem', background: '#111121', borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)' }}>
      <p style={{ color: '#9999b8', marginBottom: '1rem' }}>Sentiment analysis unavailable</p>
      <button onClick={onRetry} style={{ background: 'linear-gradient(135deg, #FFB400, #E63946)', border: 'none', color: '#fff', borderRadius: 10, padding: '10px 20px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, margin: '0 auto' }}>
        <RefreshCw size={14} /> Retry Analysis
      </button>
    </div>
  );

  const sentimentColors = { positive: '#22d3a5', negative: '#e63946', mixed: '#FFB400' };
  const color = sentimentColors[sentiment.sentimentClassification] || '#FFB400';
  const SentimentIcon = sentiment.sentimentClassification === 'positive' ? TrendingUp : sentiment.sentimentClassification === 'negative' ? TrendingDown : Minus;

  const breakdownData = sentiment.sentimentBreakdown ? [
    { name: 'Storytelling', value: sentiment.sentimentBreakdown.storytelling, fill: '#FFB400' },
    { name: 'Acting', value: sentiment.sentimentBreakdown.acting, fill: '#7c3aed' },
    { name: 'Visuals', value: sentiment.sentimentBreakdown.visuals, fill: '#2ec4b6' },
    { name: 'Soundtrack', value: sentiment.sentimentBreakdown.soundtrack, fill: '#E63946' },
    { name: 'Replay Value', value: sentiment.sentimentBreakdown.replayValue, fill: '#22d3a5' },
  ] : [];

  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      {/* Main score cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {/* Sentiment score */}
        <div style={{ background: '#111121', border: `1px solid ${color}33`, borderRadius: 16, padding: '2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at center, ${color}08 0%, transparent 70%)` }} />
          <div style={{ position: 'relative' }}>
            <div style={{ width: 100, height: 100, margin: '0 auto 1rem', position: 'relative' }}>
              <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                <circle cx="50" cy="50" r="45" fill="none" stroke={color} strokeWidth="8"
                  strokeDasharray={`${(sentiment.sentimentScore / 100) * 283} 283`}
                  strokeLinecap="round" style={{ transition: 'stroke-dasharray 1s ease' }}
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <span style={{ fontFamily: 'Bebas Neue', fontSize: '1.8rem', color, lineHeight: 1 }}>{sentiment.sentimentScore}</span>
                <span style={{ fontSize: '0.65rem', color: '#55557a' }}>/ 100</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 4 }}>
              <SentimentIcon size={14} color={color} />
              <span style={{ color, fontWeight: 700, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>
                {sentiment.sentimentClassification}
              </span>
            </div>
            <p style={{ color: '#55557a', fontSize: '0.75rem' }}>Audience Sentiment Score</p>
          </div>
        </div>

        {/* Confidence score */}
        <div style={{ background: '#111121', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontFamily: 'Bebas Neue', fontSize: '3rem', color: '#7c3aed', lineHeight: 1, marginBottom: 8 }}>
            {sentiment.confidenceScore}%
          </div>
          <p style={{ color: '#f0f0f8', fontWeight: 600, marginBottom: 4 }}>Confidence</p>
          <p style={{ color: '#55557a', fontSize: '0.8rem' }}>AI analysis reliability</p>
          <div style={{ marginTop: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: 100, height: 6, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${sentiment.confidenceScore}%`, background: 'linear-gradient(90deg, #7c3aed, #2ec4b6)', borderRadius: 100, transition: 'width 1s ease' }} />
          </div>
        </div>

        {/* Mood tags */}
        <div style={{ background: '#111121', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '2rem' }}>
          <p style={{ color: '#55557a', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem', fontWeight: 600 }}>Mood Tags</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {sentiment.moodTags?.map((tag, i) => (
              <span key={i} style={{
                background: `hsl(${i * 60}, 60%, 20%)`,
                border: `1px solid hsl(${i * 60}, 60%, 35%)`,
                color: `hsl(${i * 60}, 80%, 75%)`,
                padding: '4px 10px', borderRadius: 6, fontSize: '0.78rem', fontWeight: 600
              }}>{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Breakdown bars */}
      {breakdownData.length > 0 && (
        <div style={{ background: '#111121', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '2rem' }}>
          <h3 style={{ fontFamily: 'Bebas Neue', fontSize: '1.3rem', letterSpacing: '1px', color: '#FFB400', marginBottom: '1.5rem' }}>
            SENTIMENT BREAKDOWN
          </h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {breakdownData.map(item => (
              <div key={item.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: '#9999b8', fontSize: '0.85rem' }}>{item.name}</span>
                  <span style={{ color: item.fill, fontWeight: 700, fontSize: '0.85rem' }}>{item.value}</span>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 100, height: 8, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${item.value}%`, background: item.fill, borderRadius: 100, transition: 'width 1s ease', opacity: 0.85 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strengths & Weaknesses */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="sw-grid">
        <div style={{ background: '#111121', border: '1px solid rgba(34,211,165,0.15)', borderRadius: 16, padding: '1.5rem' }}>
          <h3 style={{ color: '#22d3a5', fontFamily: 'Bebas Neue', fontSize: '1.1rem', letterSpacing: '1px', marginBottom: '1rem' }}>
            STRENGTHS
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {sentiment.strengths?.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <span style={{ color: '#22d3a5', fontSize: '1rem', lineHeight: 1.4 }}>+</span>
                <span style={{ color: '#9999b8', fontSize: '0.85rem', lineHeight: 1.5 }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: '#111121', border: '1px solid rgba(230,57,70,0.15)', borderRadius: 16, padding: '1.5rem' }}>
          <h3 style={{ color: '#E63946', fontFamily: 'Bebas Neue', fontSize: '1.1rem', letterSpacing: '1px', marginBottom: '1rem' }}>
            WEAKNESSES
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {sentiment.weaknesses?.map((w, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <span style={{ color: '#E63946', fontSize: '1rem', lineHeight: 1.4 }}>-</span>
                <span style={{ color: '#9999b8', fontSize: '0.85rem', lineHeight: 1.5 }}>{w}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`@media(max-width:640px){.sw-grid{grid-template-columns:1fr !important;}}`}</style>
    </div>
  );
}
