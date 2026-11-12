import styles from './BrandWordmark.module.scss';

/** Original lettering: the O is a coffee cup, with a handle and a small saucer. */
export default function BrandWordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`${styles.brand} ${className}`}>
      <svg viewBox="0 0 388 78" fill="currentColor" aria-hidden="true" focusable="false">
        <path d="M0 67V7Q0 0 7 0h11l16 27L50 0h11q7 0 7 7v60H50V31L34 54 18 31v36H0Z" />
        <path d="M84 0h10q4 0 4 4v63H80V4q0-4 4-4Z" />
        <path d="M111 0h18v25l23-25h23l-31 32 32 35h-24l-23-28v28h-18V0Z" />
        <path d="M188 0h18v49h31v18h-40q-9 0-9-9V0Z" />
        <path fillRule="evenodd" d="M249 0h62v29c0 24-11 38-31 38s-31-14-31-38V0Zm18 17v12c0 13 4 20 13 20s13-7 13-20V17h-26Z" />
        <path className={styles.cupDetail} d="M309 12h2c11 0 18 7 18 17s-7 18-20 18V36c6 0 10-2 10-7s-3-7-10-7V12Z" />
        <path d="M338 0h18v49h32v18h-41q-9 0-9-9V0Z" />
        <rect className={styles.cupDetail} x="253" y="72" width="54" height="4" rx="2" />
      </svg>
      <span className={styles.tagline}>Cafe & Restaurant</span>
    </span>
  );
}
