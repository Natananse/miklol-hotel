'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Clock3, Menu, X } from 'lucide-react';
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
  return <>
    <div className={styles.announcement}><span>A little pick-me-up, every day.</span><span><Clock3 size={11} /> Coffee, plates & good company <span className={styles.announcementStar}>✳</span></span></div>
    <header className={styles.header}>
      <div className={`container ${styles.nav}`}>
        <a className={styles.logo} href="#" aria-label="MIKLOL home">MIKLOL<span>CAFE & RESTAURANT</span></a>
        <nav className={styles.desktopNav} aria-label="Main navigation">{links.map(link => <a key={link.href} href={link.href}>{link.label}</a>)}</nav>
        <a className={`button ${styles.reserve}`} href="#reservation">Reserve a table <ArrowUpRight size={14} /></a>
        <button ref={menuButton} className={styles.menuButton} onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? 'Close navigation' : 'Open navigation'}>{open ? <X /> : <Menu />}</button>
      </div>
      <AnimatePresence>{open && <motion.div ref={panel} id="mobile-navigation" className={styles.mobileNav} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: reduced ? 0 : .3 }}><nav aria-label="Mobile navigation">{links.map((link, index) => <a key={link.href} href={link.href} onClick={() => setOpen(false)}><span>0{index + 1}</span>{link.label}<ArrowUpRight /></a>)}</nav></motion.div>}</AnimatePresence>
    </header>
  </>;
}

export function SiteEffects() {
  const [loading, setLoading] = useState(true);
  const cursor = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 650);
    return () => clearTimeout(timer);
  }, []);
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

export function ScrollCue() { return <a className={styles.scrollCue} href="#menu"><ArrowDown size={12} /> SCROLL TO SAVOUR</a>; }
