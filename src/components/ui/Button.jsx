const styles = {
  primary:
    'bg-emerald-500 text-white hover:bg-emerald-400 focus-visible:ring-2 focus-visible:ring-emerald-300 disabled:opacity-50',
  ghost: 'bg-white/5 text-slate-200 hover:bg-white/10 disabled:opacity-50',
};

const Button = ({ variant = 'primary', className = '', ...props }) => (
  <button
    className={`w-full rounded-2xl px-4 py-3 font-medium transition-all duration-300 ${styles[variant]} ${className}`}
    {...props}
  />
);

export default Button;
