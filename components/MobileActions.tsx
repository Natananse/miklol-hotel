'use client';

import { useEffect, useState } from 'react';
import { CalendarDays, MapPin, Phone, Utensils } from 'lucide-react';
import { site } from '@/data/site';
import styles from './MobileActions.module.scss';

/** One-tap phone navigation, hidden when a form or modal needs the screen. */
export default function MobileActions() {
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [reservationVisible, setReservationVisible] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);

  useEffect(() => {
    const viewport = window.visualViewport;
    let baseline = viewport?.height || window.innerHeight;
    let frame = 0;
    const update = () => {
      frame = 0;
      const focused = document.activeElement as HTMLElement | null;
      const editing = Boolean(focused?.matches('input, textarea, select, [contenteditable="true"]'));
      const height = viewport?.height || window.innerHeight;
      if (!editing) baseline = Math.max(baseline, height);
      const reducedViewport = baseline - height > Math.max(120, baseline * .2);
      // Focus is a fallback for browsers that do not expose virtual-keyboard geometry.
      setKeyboardOpen(editing && (reducedViewport || !viewport));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    viewport?.addEventListener('resize', schedule);
    window.addEventListener('resize', schedule);
    document.addEventListener('focusin', schedule);
    document.addEventListener('focusout', schedule);
    update();
    return () => {
      cancelAnimationFrame(frame);
      viewport?.removeEventListener('resize', schedule);
      window.removeEventListener('resize', schedule);
      document.removeEventListener('focusin', schedule);
      document.removeEventListener('focusout', schedule);
    };
  }, []);

  useEffect(() => {
    let observed: Element | null = null;
    const observer = new IntersectionObserver(([entry]) => {
      setReservationVisible(entry.isIntersecting && entry.intersectionRatio >= .05);
    }, { threshold: [0, .05, .1, .5, 1] });
    const update = () => {
      setOverlayOpen(document.documentElement.dataset.mobileMenuOpen === 'true' || Boolean(document.querySelector('dialog[open], [role="dialog"][aria-modal="true"]')));
      const target = document.querySelector('[data-reservation-form]') || document.querySelector('#reservation form') || document.querySelector('#reservation');
      if (target !== observed) {
        if (observed) observer.unobserve(observed);
        observed = target;
        if (observed) observer.observe(observed);
        else setReservationVisible(false);
      }
    };
    const mutations = new MutationObserver(update);
    mutations.observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['open', 'data-mobile-menu-open'] });
    update();
    return () => { observer.disconnect(); mutations.disconnect(); };
  }, []);

  return (
    <nav className={styles.bar} aria-label="Quick actions" data-mobile-actions data-calm-surface hidden={keyboardOpen || reservationVisible || overlayOpen}>
      <a className={styles.reserve} href="#reservation"><CalendarDays size={20} aria-hidden="true" /><span>Reserve</span></a>
      <a href="#menu"><Utensils size={20} aria-hidden="true" /><span>Menu</span></a>
      <a href={site.phoneHref} aria-label={`Call MIKLOL on ${site.phone}`}><Phone size={20} aria-hidden="true" /><span>Call</span></a>
      <a href={site.mapUrl} target="_blank" rel="noreferrer" aria-label="Open MIKLOL directions in Google Maps"><MapPin size={20} aria-hidden="true" /><span>Directions</span></a>
    </nav>
  );
}
