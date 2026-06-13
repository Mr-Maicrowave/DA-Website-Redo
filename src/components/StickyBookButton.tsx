import { useNavigate, useLocation } from 'react-router-dom';

const StickyBookButton = () => {
  const navigate  = useNavigate();
  const location  = useLocation();

  // Hide on the booking page itself
  if (location.pathname === '/book-interview') return null;

  return (
    <button
      onClick={() => navigate('/book-interview')}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.transform = 'translateY(-2px) scale(1.04)';
        el.style.boxShadow = '0 12px 40px rgba(201,162,39,.65), 0 2px 8px rgba(0,0,0,.3)';
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.transform = 'translateY(0) scale(1)';
        el.style.boxShadow = '0 8px 32px rgba(201,162,39,.55), 0 2px 8px rgba(0,0,0,.25)';
      }}
      style={{
        position: 'fixed',
        bottom: 100,
        right: 32,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '14px 26px',
        borderRadius: 50,
        border: 'none',
        cursor: 'pointer',
        fontFamily: "'DM Sans', 'Inter', sans-serif",
        fontWeight: 800,
        fontSize: '.82rem',
        letterSpacing: '.06em',
        textTransform: 'uppercase',
        background: 'linear-gradient(135deg, #C9A227, #E8C040)',
        color: '#0A1628',
        boxShadow: '0 8px 32px rgba(201,162,39,.55), 0 2px 8px rgba(0,0,0,.25)',
        transform: 'translateY(0)',
        transition: 'all .3s cubic-bezier(.34,1.56,.64,1)',
      }}
    >
      <span style={{ fontSize: '1rem' }}>✦</span>
      Book Interview
    </button>
  );
};

export default StickyBookButton;