export const APP_NAME = process.env.REACT_APP_NAME || process.env.VITE_APP_NAME || 'Karnova : the Krishi Officier';
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || process.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const USER_ROLES = {
  FARMER: 'farmer',
  OFFICER: 'officer',
  ADMIN: 'admin',
};

export const NAV_BY_ROLE = {
  [USER_ROLES.FARMER]: ['dashboard', 'queries', 'schemes', 'marketplace', 'community'],
  [USER_ROLES.OFFICER]: ['dashboard', 'queue', 'escalations', 'responses'],
  [USER_ROLES.ADMIN]: ['dashboard', 'users', 'officers', 'schemes'],
};
