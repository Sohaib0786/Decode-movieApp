import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#161628', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 14px' }}>
        <p style={{ color: '#f0f0f8', fontWeight: 600, fontSize: '0.85rem' }}>{label}</p>
        <p style={{ color: payload[0].color, fontSize: '1.1rem', fontWeight: 700 }}>{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

export default function RatingComparison({ movie, sentiment }) {
  const parseRating = (r) => {
    if (!r) return null;
    if (r.includes('/10')) return Math.round((parseFloat(r) / 10) * 100);
    if (r.includes('%')) return parseInt(r);
    if (r.includes('/100')) return parseInt(r);
    return null;
  };

  const imdbPct = movie.imdbRating ? Math.round((parseFloat(movie.imdbRating) / 10) * 100) : null;
  const rtPct = parseRating(movie.rottenTomatoes);
  const metaPct = parseRating(movie.metaScore);
  const aiScore = sentiment?.sentimentScore || null;

  const data = [
    imdbPct !== null && { name: 'IMDb', value: imdbPct, color: '#FFB400', desc: `${movie.imdbRating}/10` },
    rtPct !== null && { name: 'Rotten Tomatoes', value: rtPct, color: '#E63946', desc: movie.rottenTomatoes },
    metaPct !== null && { name: 'Metacritic', value: metaPct, color: '#2ec4b6', desc: movie.metaScore },
    aiScore !== null && { name: 'AI Audience Score', value: aiScore, color: '#7c3aed', desc: `${aiScore}/100` },
  ].filter(Boolean);

  const avg = data.length > 0 ? Math.round(data.reduce((s, d) => s + d.value, 0) / data.length) : null;

  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      {/* Score cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        {data.map(d => (
          <div key={d.name} style={{ background: '#111121', border: `1px solid ${d.color}22`, borderRadius: 14, padding: '1.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at top, ${d.color}08 0%, transparent 70%)` }} />
            <div style={{ position: 'relative' }}>
              <div style={{ fontFamily: 'Bebas Neue', fontSize: '2.8rem', color: d.color, lineHeight: 1, marginBottom: 4 }}>{d.value}%</div>
              <p style={{ color: '#f0f0f8', fontWeight: 600, fontSize: '0.8rem', marginBottom: 2 }}>{d.name}</p>
              <p style={{ color: '#55557a', fontSize: '0.75rem' }}>{d.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      {data.length > 0 && (
        <div style={{ background: '#111121', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '2rem' }}>
          <h3 style={{ fontFamily: 'Bebas Neue', fontSize: '1.3rem', letterSpacing: '1px', color: '#FFB400', marginBottom: '1.5rem' }}>
            RATING COMPARISON CHART
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#9999b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: '#55557a', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={80}>
                {data.map((entry, i) => <Cell key={i} fill={entry.color} fillOpacity={0.85} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Consensus */}
      {avg !== null && (
        <div style={{ background: '#111121', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: '#55557a', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Overall Consensus Score</p>
          <div style={{ fontFamily: 'Bebas Neue', fontSize: '4rem', background: 'linear-gradient(135deg, #FFB400, #E63946)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>
            {avg}%
          </div>
          <p style={{ color: '#9999b8', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Average across {data.length} rating source{data.length > 1 ? 's' : ''}
          </p>
          {movie.imdbVotes && (
            <p style={{ color: '#55557a', fontSize: '0.8rem', marginTop: 4 }}>
              Based on {parseInt(movie.imdbVotes.replace(/,/g, '')).toLocaleString()} IMDb votes
            </p>
          )}
        </div>
      )}
    </div>
  );
}
