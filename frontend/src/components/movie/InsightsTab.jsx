import { Heart, Users, Star, Film } from 'lucide-react';

export default function InsightsTab({ sentiment, movie, loading }) {
  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', padding: '4rem', background: '#111121', borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)' }}>
      <div style={{ width: 48, height: 48, border: '3px solid rgba(255,255,255,0.1)', borderTop: '3px solid #7c3aed', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: '#9999b8' }}>Generating AI insights...</p>
    </div>
  );

  if (!sentiment) return (
    <div style={{ textAlign: 'center', padding: '4rem', background: '#111121', borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)' }}>
      <p style={{ color: '#9999b8' }}>Insights unavailable. Please wait for AI analysis.</p>
    </div>
  );

  const insightCards = [
    {
      icon: <Heart size={20} color="#E63946" />,
      title: 'WHY AUDIENCES LOVE IT',
      content: sentiment.whyAudiencesLoveIt,
      color: '#E63946',
      bg: 'rgba(230,57,70,0.05)',
      border: 'rgba(230,57,70,0.15)'
    },
    {
      icon: <Users size={20} color="#2ec4b6" />,
      title: 'WHO SHOULD WATCH',
      content: sentiment.whoShouldWatch,
      color: '#2ec4b6',
      bg: 'rgba(46,196,182,0.05)',
      border: 'rgba(46,196,182,0.15)'
    },
    {
      icon: <Star size={20} color="#FFB400" fill="#FFB400" />,
      title: 'IS IT WORTH WATCHING?',
      content: sentiment.isItWorthWatching,
      color: '#FFB400',
      bg: 'rgba(255,180,0,0.05)',
      border: 'rgba(255,180,0,0.15)'
    },
  ];

  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      {insightCards.map(card => (
        <div key={card.title} style={{ background: card.bg, border: `1px solid ${card.border}`, borderRadius: 16, padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
            {card.icon}
            <h3 style={{ fontFamily: 'Bebas Neue', fontSize: '1.2rem', letterSpacing: '1px', color: card.color }}>{card.title}</h3>
          </div>
          <p style={{ color: '#9999b8', lineHeight: 1.8, fontSize: '0.95rem' }}>{card.content}</p>
        </div>
      ))}

      {/* Recommendations */}
      {sentiment.recommendedIfYouLiked?.length > 0 && (
        <div style={{ background: '#111121', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem' }}>
            <Film size={18} color="#7c3aed" />
            <h3 style={{ fontFamily: 'Bebas Neue', fontSize: '1.2rem', letterSpacing: '1px', color: '#7c3aed' }}>
              IF YOU LIKED {movie?.title?.toUpperCase()}, TRY THESE
            </h3>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {sentiment.recommendedIfYouLiked.map((title, i) => (
              <div key={i} style={{
                background: 'rgba(124,58,237,0.1)',
                border: '1px solid rgba(124,58,237,0.25)',
                color: '#c4b5fd',
                padding: '8px 16px', borderRadius: 10,
                fontSize: '0.85rem', fontWeight: 600
              }}>
                {title}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
