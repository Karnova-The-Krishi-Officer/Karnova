import React from 'react';
import { useTheme } from '../hooks/useTheme';

const ThemeToggle = React.memo(() => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
      <span>{theme === 'light' ? '🌞' : '🌙'}</span>
      <span>{theme === 'light' ? 'Light' : 'Dark'}</span>
    </button>
  );
});

export default ThemeToggle;
