const AuthLayout = ({ children }) => (
  <div className="auth-shell min-h-screen px-4 py-10 sm:px-8 sm:py-16">
    <div className="auth-orb auth-orb-left" />
    <div className="auth-orb auth-orb-right" />
    <div className="relative mx-auto w-full max-w-6xl">{children}</div>
  </div>
);

export default AuthLayout;
