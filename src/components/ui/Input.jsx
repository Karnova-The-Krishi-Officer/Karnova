const Input = ({ label, className = '', ...props }) => (
  <label className="space-y-2 block">
    {label ? <span className="text-xs sm:text-sm tracking-[0.2em] text-slate-400 uppercase">{label}</span> : null}
    <input
      className={`w-full rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none transition ${className}`}
      {...props}
    />
  </label>
);

export default Input;
