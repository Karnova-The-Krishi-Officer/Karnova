const statusStyles = {
  resolved: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  pending: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  open: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
};

const Badge = ({ status = 'pending' }) => (
  <span
    className={`rounded-full border px-2.5 py-1 text-xs capitalize ${
      statusStyles[status] || statusStyles.pending
    }`}
  >
    {status}
  </span>
);

export default Badge;
