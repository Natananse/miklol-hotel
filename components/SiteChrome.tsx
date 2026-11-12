'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import styles from './SiteChrome.module.scss';

const links = [{ href: '#menu', label: 'Our menu' }, { href: '#story', label: 'Our story' }, { href: '#gallery', label: 'The space' }, { href: '#reservation', label: 'Visit us' }];

export function Header() {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const menuButton = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panel.current?.querySelector<HTMLAnchorElement>('a')?.focus();
    const close = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); menuButton.current?.focus(); }
      if (e.key === 'Tab') {
        const items = [menuButton.current, ...Array.from(panel.current?.querySelectorAll<HTMLAnchorElement>('a') ?? [])].filter(Boolean) as HTMLElement[];
        const index = items.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey && index === 0) { e.preventDefault(); items.at(-1)?.focus(); }
        if (!e.shiftKey && index === items.length - 1) { e.preventDefault(); items[0]?.focus(); }
      }
    };
    document.addEventListener('keydown', close);
    return () => { document.body.style.overflow = previous; document.removeEventListener('keydown', close); };
  }, [open]);
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 901px)');
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
  }, []);
  return <>
    <div className={styles.announcement} data-calm-surface><p>Coffee, lunch & dinner. <a href="#reservation">Find your table at MIKLOL.</a></p></div>
    <header className={styles.header} data-calm-surface>
      <div className={`container ${styles.nav}`}>
        <a className={styles.logo} href="#" aria-label="MIKLOL home">MIKLOL<span>Cafe & Restaurant</span></a>
        <nav className={styles.desktopNav} aria-label="Main navigation">{links.map(link => <a key={link.href} href={link.href}>{link.label}</a>)}</nav>
        <a className={styles.reserve} href="#reservation" onClick={() => setOpen(false)}>Reserve a table</a>
        <button ref={menuButton} className={styles.menuButton} onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? 'Close navigation' : 'Open navigation'}>{open ? <X /> : <Menu />}</button>
      </div>
      <AnimatePresence>{open && <motion.div ref={panel} id="mobile-navigation" className={styles.mobileNav} data-lenis-prevent initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: reduced ? 0 : .25 }}><nav aria-label="Mobile navigation">{links.map(link => <a key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}</a>)}</nav></motion.div>}</AnimatePresence>
    </header>
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
    Promise.all([import('lenis'), import('gsap'), import('gsap/ScrollTrigger')]).then(([{ default: Lenis }, { gsap }, { ScrollTrigger }]) => {
      if (!active) return;
      gsap.registerPlugin(ScrollTrigger);
      const lenis = new Lenis({ duration: 1.05, smoothWheel: true, anchors: { offset: -90 } });
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
        const mm = gsap.matchMedia();
        mm.add('(min-width: 901px)', () => {
          gsap.to('[data-story-image]', { y: 24, ease: 'none', scrollTrigger: { trigger: '#story', start: 'top 15%', end: 'bottom 80%', pin: '[data-story-image]', pinSpacing: false, scrub: 1 } });
        });
      });
      cleanup = () => { cancelAnimationFrame(frame); lenis.destroy(); context.revert(); };
    }).catch(() => { /* Native scroll remains available if optional animation loading fails. */ });
    return () => { active = false; cleanup(); };
  }, [reduced]);
  useEffect(() => {
    if (reduced || !window.matchMedia('(pointer: fine)').matches) return;
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
    <AnimatePresence>{loading && <motion.div className={styles.preloader} aria-hidden="true" initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: reduced ? 0 : .4 } }}><span>MIKLOL<span className={styles.loaderDot}>.</span></span><small>A GOOD MOMENT IS BREWING</small></motion.div>}</AnimatePresence>
    <div ref={cursor} className={styles.cursor} aria-hidden="true" />
  </>;
}
