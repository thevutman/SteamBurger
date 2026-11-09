/** Small inline icons that replace the Font Awesome kit the 2023 page loaded. */
type P = { className?: string };

export const CartIcon = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
    <path d="M7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM1 2h3.3l.9 2H22l-3.6 8.4A2 2 0 0 1 16.6 14H8.1l-1 2H19v2H4l2.4-4.3L3 4H1z" />
  </svg>
);

export const BarsIcon = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
    <path d="M3 5h18v2.5H3zm0 5.75h18v2.5H3zM3 16.5h18V19H3z" />
  </svg>
);

export const CloseIcon = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true">
    <path d="M5 5l14 14M19 5L5 19" />
  </svg>
);

export const BurgerIcon = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
    <path d="M12 3c5 0 9 2.7 9 6H3c0-3.3 4-6 9-6zM2 12.5c0-.8.7-1.5 1.5-1.5h17c.8 0 1.5.7 1.5 1.5S21.3 14 20.5 14h-17C2.7 14 2 13.3 2 12.5zM3 16h18v1c0 2.2-1.8 4-4 4H7c-2.2 0-4-1.8-4-4v-1z" />
  </svg>
);

export const PlayIcon = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
    <path d="M6 4v16l14-8z" />
  </svg>
);

export const PauseIcon = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
    <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
  </svg>
);

export const TikTokIcon = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
    <path d="M16.6 2h-3.3v13.2a2.9 2.9 0 1 1-2.9-2.9c.3 0 .6 0 .9.1V9a6.3 6.3 0 1 0 5.3 6.2V8.6a8 8 0 0 0 4.4 1.4V6.7a4.4 4.4 0 0 1-4.4-4.7z" />
  </svg>
);

export const FacebookIcon = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
    <path d="M14 8V6.2c0-.8.2-1.2 1.4-1.2H17V2h-2.6C11.6 2 10.6 3.4 10.6 5.8V8H8.5v3h2.1v11H14V11h2.6l.4-3z" />
  </svg>
);

export const InstagramIcon = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);
