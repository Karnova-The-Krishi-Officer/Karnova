const GlassCard = ({ className = '', children }) => (
  <div
    className={`rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg shadow-[0_20px_60px_rgba(0,0,0,0.35)] ${className}`}
  >
    {children}
  </div>
);

export default GlassCard;
