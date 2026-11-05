/**
 * HB+ Fit Authentication Constants
 */

// Official Allowed Domain (Requirement 2)
export const ALLOWED_DOMAIN = '@hbplus.fit';

// Exact Error Message required by Requirement 3
export const DOMAIN_RESTRICTION_ERROR = 'Access restricted. Please login using your official domain email.';

// Application Branding
export const APP_NAME = 'HB+ Fit';
export const APP_TAGLINE = 'Official Corporate & Athlete Access Portal';

// Responsive Breakpoints (px)
export const BREAKPOINTS = {
  TABLET: 768,
  DESKTOP: 1024,
  WIDE_DESKTOP: 1280,
};

// Storage Keys
export const STORAGE_KEYS = {
  USER_SESSION: '@hbplus_auth_session_v1',
  LAST_LOGIN_DOMAIN: '@hbplus_last_domain',
};

// Default Admins (if not set in Firestore role)
export const DEFAULT_ADMIN_EMAILS = [
  'admin@hbplus.fit',
  'lead@hbplus.fit',
  'ceo@hbplus.fit',
  'security@hbplus.fit',
];
