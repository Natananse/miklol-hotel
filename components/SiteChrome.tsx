'use client';

import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, m as motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { CalendarDays, Facebook, Instagram, MapPin, Menu, Phone, X } from 'lucide-react';
import { site } from '@/data/site';
import BrandWordmark from './BrandWordmark';
import styles from './SiteChrome.module.scss';

const links = [
  { href: '#menu', label: 'Menu' },
  { href: '#story', label: 'Our kitchen' },
  { href: '#gallery', label: 'Photos' },
  { href: '#reservation', label: 'Tables' },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [compact, setCompact] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState('');
  const reduced = useReducedMotion();
  const menuButton = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const header = useRef<HTMLElement>(null);
  const focused = useRef(false);
  const hours = `${site.preview ? 'Proposed hours' : 'Opening hours'} · ${site.openingHours}`;
  const status = site.phone || hours;

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    document.documentElement.dataset.mobileMenuOpen = String(open);
    return () => { delete document.documentElement.dataset.mobileMenuOpen; };
  }, [open]);

  useEffect(() => {
    let previous = window.scrollY;
    let directionStart = previous;
    let direction = 0;
    let frame = 0;
    const update = () => {
      frame = 0;
      const current = Math.max(0, window.scrollY);
      setCompact((wasCompact) => current > 90 || (wasCompact && current > 20));
      if (open || focused.current || current < 180 || window.matchMedia('(max-width: 600px)').matches) {
        setHidden(false);
      } else {
        const difference = current - previous;
        if (Math.abs(difference) > 2) {
          const nextDirection = Math.sign(difference);
          if (nextDirection !== direction) { direction = nextDirection; directionStart = previous; }
          if (direction > 0 && current - directionStart > 22 && current > 220) setHidden(true);
          if (direction < 0 && directionStart - current > 8) setHidden(false);
        }
      }
      previous = current;
    };
    const scroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', scroll, { passive: true });
    return () => { window.removeEventListener('scroll', scroll); cancelAnimationFrame(frame); };
  }, [open]);

  useEffect(() => {
    const sections = links.map((link) => document.querySelector<HTMLElement>(link.href)).filter((section): section is HTMLElement => Boolean(section));
    let frame = 0;
    const update = () => {
      frame = 0;
      const boundary = Math.min(window.innerHeight * .38, 260);
      const reached = sections.filter((section) => section.getBoundingClientRect().top <= boundary);
      setActive(reached.at(-1)?.id || '');
    };
    const scheduleUpdate = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new IntersectionObserver(scheduleUpdate, { rootMargin: '-15% 0px -55% 0px', threshold: [0, .1, .5, 1] });
    sections.forEach((section) => observer.observe(section));
    update();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    window.addEventListener('hashchange', scheduleUpdate);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      window.removeEventListener('hashchange', scheduleUpdate);
    };
  }, []);

  useEffect(() => {
    if (!open || !mounted) return;
    setHidden(false);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const background = Array.from(document.querySelectorAll<HTMLElement>('main, footer, header, [data-announcement], [data-mobile-actions]'));
    const previousInert = background.map((element) => element.inert);
    background.forEach((element) => { element.inert = true; });
    panel.current?.querySelector<HTMLAnchorElement>('nav a')?.focus();
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); setOpen(false); }
      if (event.key === 'Tab') {
        const items = Array.from(panel.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? []);
        const first = items[0];
        const last = items.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener('keydown', keydown);
    return () => {
      document.body.style.overflow = previousOverflow;
      background.forEach((element, index) => { element.inert = previousInert[index]; });
      document.removeEventListener('keydown', keydown);
      menuButton.current?.focus({ preventScroll: true });
    };
  }, [open, mounted]);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1051px)');
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
  }, []);

  function goToTop(event: ReactMouseEvent<HTMLAnchorElement>) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    event.stopPropagation();
    setOpen(false);
    setHidden(false);
    window.history.replaceState(window.history.state, '', '#top');
    window.scrollTo({ top: 0, behavior: reduced || window.matchMedia('(pointer: coarse), (max-width: 600px)').matches ? 'auto' : 'smooth' });
  }

  const reservationButton = (closeMenu = false) => <a className={styles.reserve} href="#reservation" onClick={() => { setHidden(false); if (closeMenu) setOpen(false); }}><CalendarDays size={18} aria-hidden="true" /><span>Reserve a table</span></a>;

  return <>
    <div className={styles.announcement} data-announcement data-calm-surface><p>Buna, injera, and café favourites. <a href="#menu">See the menu.</a></p></div>
    <div className={styles.headerBackdrop}>
      <header ref={header} className={`${styles.header} ${compact ? styles.compact : ''} ${hidden && !open ? styles.hidden : ''}`} data-calm-surface onFocusCapture={() => { focused.current = true; setHidden(false); }} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) focused.current = false; }}>
        <div className={`container ${styles.nav}`}>
          <a className={styles.logo} href="#top" onClick={goToTop} aria-label="MIKLOL Cafe & Restaurant — back to top"><BrandWordmark /></a>
          <nav className={styles.desktopNav} aria-label="Main navigation">{links.map((link) => <a key={link.href} href={link.href} className={active === link.href.slice(1) ? styles.activeLink : ''} aria-current={active === link.href.slice(1) ? 'location' : undefined} onClick={() => setActive(link.href.slice(1))}>{link.label}</a>)}</nav>
          <div className={styles.headerActions}>{site.phone ? <a className={styles.openingStatus} href={site.phoneHref}>{status}</a> : <span className={styles.openingStatus}>{status}</span>}{reservationButton()}</div>
          <button ref={menuButton} className={styles.menuButton} onClick={() => setOpen(true)} aria-expanded={open} aria-controls="mobile-navigation" aria-label="Open menu"><Menu size={24} /></button>
        </div>
      </header>
    </div>
    {mounted && createPortal(<AnimatePresence>{open && <motion.div ref={panel} id="mobile-navigation" role="dialog" aria-modal="true" aria-label="MIKLOL navigation" className={styles.mobileNav} data-lenis-prevent data-calm-surface initial={reduced ? false : { opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduced ? 0 : -10 }} transition={{ duration: reduced ? 0 : .28 }}>
      <div className={`container ${styles.mobileMasthead}`}><a className={styles.logo} href="#top" onClick={goToTop} aria-label="MIKLOL Cafe & Restaurant — back to top"><BrandWordmark /></a><button type="button" className={styles.closeMenu} onClick={() => setOpen(false)} aria-label="Close menu"><X size={25} /></button></div>
      <div className={`container ${styles.mobileContents}`}>
        <p className={styles.mobileEyebrow}>COFFEE, BREAKFAST, LUNCH & DINNER</p>
        <nav aria-label="Mobile navigation">{links.map((link) => <a key={link.href} href={link.href} className={active === link.href.slice(1) ? styles.activeLink : ''} aria-current={active === link.href.slice(1) ? 'location' : undefined} onClick={() => { setActive(link.href.slice(1)); setOpen(false); }}>{link.label}</a>)}</nav>
        <div className={styles.mobileReserve}>{reservationButton(true)}</div>
        <div className={styles.mobileContact}>
          <a href={site.phoneHref}><Phone size={20} aria-hidden="true" /><span>{site.phone}</span></a>
          <p>{hours}</p>
          <a href={site.mapUrl} target="_blank" rel="noreferrer"><MapPin size={20} aria-hidden="true" /><span>{site.address}</span></a>
        </div>
        <div className={styles.mobileSocials} aria-label="Social profiles">
          {site.instagramUrl ? <a href={site.instagramUrl} target="_blank" rel="noreferrer" aria-label="MIKLOL on Instagram"><Instagram size={22} /></a> : <button type="button" disabled aria-label="Instagram profile not available"><Instagram size={22} /></button>}
          {site.facebookUrl ? <a href={site.facebookUrl} target="_blank" rel="noreferrer" aria-label="MIKLOL on Facebook"><Facebook size={22} /></a> : <button type="button" disabled aria-label="Facebook profile not available"><Facebook size={22} /></button>}
        </div>
      </div>
    </motion.div>}</AnimatePresence>, document.body)}
  </>;
}

export function SiteEffects({ showIntro = true }: { showIntro?: boolean }) {
  const [loading, setLoading] = useState(showIntro);
  const cursor = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!showIntro) return;
    const timer = window.setTimeout(() => setLoading(false), 650);
    return () => clearTimeout(timer);
  }, [showIntro]);
  useEffect(() => {
    if (reduced) return;
    let cleanup = () => {};
    let active = true;
    let revision = 0;
    const nativeScroll = window.matchMedia('(pointer: coarse), (max-width: 600px)');
    const prepare = () => {
      cleanup();
      cleanup = () => {};
      const request = ++revision;
      if (nativeScroll.matches) {
        document.querySelectorAll<HTMLElement>('[data-count]').forEach(element => { element.textContent = String(element.dataset.count).padStart(2, '0'); });
        return;
      }
      Promise.all([import('lenis'), import('gsap'), import('gsap/ScrollTrigger')]).then(([{ default: Lenis }, { gsap }, { ScrollTrigger }]) => {
        if (!active || request !== revision || nativeScroll.matches) return;
        gsap.registerPlugin(ScrollTrigger);
        const lenis = new Lenis({ duration: 1.05, smoothWheel: true, anchors: true });
        lenis.on('scroll', ScrollTrigger.update);
        let frame = 0;
        const raf = (time: number) => { lenis.raf(time); frame = requestAnimationFrame(raf); };
        frame = requestAnimationFrame(raf);
        const context = gsap.context(() => {
          gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach(element => {
            gsap.from(element, { y: 32, opacity: 0, duration: .8, ease: 'power2.out', scrollTrigger: { trigger: element, start: 'top 92%', once: true } });
          });
          gsap.utils.toArray<HTMLElement>('[data-count]').forEach(element => {
            const target = Number(element.dataset.count);
            const value = { number: 0 };
            gsap.to(value, { number: target, duration: 1.6, ease: 'power2.out', scrollTrigger: { trigger: element, start: 'top 95%', once: true }, onUpdate: () => { element.textContent = String(Math.round(value.number)).padStart(2, '0'); } });
          });

        });
        cleanup = () => { cancelAnimationFrame(frame); lenis.destroy(); context.revert(); };
      }).catch(() => { /* Native scroll remains available if optional animation loading fails. */ });
    };
    nativeScroll.addEventListener('change', prepare);
    prepare();
    return () => { active = false; revision++; nativeScroll.removeEventListener('change', prepare); cleanup(); };
  }, [reduced]);
  useEffect(() => {
    if (reduced || !window.matchMedia('(pointer: fine) and (min-width: 601px)').matches) return;
    const move = (event: MouseEvent) => {
      if (!cursor.current) return;
      if ((event.target as HTMLElement).closest('[data-calm-surface]')) {
        cursor.current.style.opacity = '0';
        return;
      }
      cursor.current.style.setProperty('--cursor-x', `${event.clientX}px`);
      cursor.current.style.setProperty('--cursor-y', `${event.clientY}px`);
      cursor.current.dataset.active = String(Boolean((event.target as HTMLElement).closest('a,button')));
      cursor.current.style.opacity = '1';
    };
    const hide = () => { if (cursor.current) cursor.current.style.opacity = '0'; };
    window.addEventListener('mousemove', move, { passive: true });
    document.addEventListener('mouseleave', hide);
    return () => { window.removeEventListener('mousemove', move); document.removeEventListener('mouseleave', hide); };
  }, [reduced]);
  return <>
    <AnimatePresence>{loading && <motion.div className={styles.preloader} aria-hidden="true" initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: reduced ? 0 : .4 } }}><span>MIKLOL<span className={styles.loaderDot}>.</span></span><small>COFFEE. BREAKFAST. LUNCH. DINNER.</small></motion.div>}</AnimatePresence>
    <div ref={cursor} className={styles.cursor} aria-hidden="true" />
  </>;
}
