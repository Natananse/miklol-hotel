'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { kitchenPhotos, isKitchenPlaceholder } from '@/data/kitchen-team';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import KitchenPhoto from './KitchenPhoto';
import s from './KitchenTeam.module.scss';

export default function KitchenTeam() {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const pending = kitchenPhotos.filter(isKitchenPlaceholder).length;
  const usesStock = kitchenPhotos.some(photo => !isKitchenPlaceholder(photo) && photo.credit);

  useEffect(() => {
    const element = track.current;
    if (!element || reduced || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        (entry.target as HTMLElement).dataset.revealed = 'true';
        observer.unobserve(entry.target);
      });
    }, { threshold: .12 });
    element.dataset.animate = 'true';
    Array.from(element.children).forEach(card => observer.observe(card));
    return () => { observer.disconnect(); delete element.dataset.animate; };
  }, [reduced]);

  useEffect(() => {
    const element = track.current;
    if (!element) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const left = element.getBoundingClientRect().left;
      const distances = Array.from(element.children).map(card => Math.abs(card.getBoundingClientRect().left - left));
      setActive(distances.indexOf(Math.min(...distances)));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    element.addEventListener('scroll', schedule, { passive: true });
    const resize = new ResizeObserver(schedule);
    resize.observe(element);
    return () => { element.removeEventListener('scroll', schedule); resize.disconnect(); cancelAnimationFrame(frame); };
  }, []);

  function show(index: number) {
    const element = track.current;
    const card = element?.children[index] as HTMLElement | undefined;
    if (!element || !card) return;
    const left = card.getBoundingClientRect().left - element.getBoundingClientRect().left + element.scrollLeft;
    element.scrollTo({ left, behavior: reduced ? 'instant' : 'smooth' });
  }

  function keyboard(event: KeyboardEvent<HTMLDivElement>) {
    if (!window.matchMedia('(max-width: 600px)').matches) return;
    const targets: Record<string, number> = { ArrowRight: Math.min(active + 1, kitchenPhotos.length - 1), ArrowLeft: Math.max(active - 1, 0), Home: 0, End: kitchenPhotos.length - 1 };
    const next = targets[event.key];
    if (next !== undefined) { event.preventDefault(); show(next); }
  }

  return <section id="kitchen-team" className={s.section} aria-labelledby="kitchen-team-heading" data-calm-surface>
    <div className="container">
      <div className={s.heading}>
        <div><p className="eyebrow">OUR KITCHEN</p><h2 id="kitchen-team-heading" className="section-heading">Meet our<br />kitchen team.</h2></div>
        <p className={s.intro}>Ethiopian hospitality begins with a warm welcome and a place at the table.<br />Fresh ingredients, prepared with care, make every meal worth sharing.</p>
      </div>
      {pending > 0 && <p className={s.notice}>{pending} photo {pending === 1 ? 'space is' : 'spaces are'} reserved for original MIKLOL kitchen photography.</p>}
      {usesStock && <p className={s.notice}>Stock photographs illustrate kitchen traditions. The people pictured are not MIKLOL employees.</p>}
      <div ref={track} id="kitchen-team-photos" className={s.grid} tabIndex={0} role="region" aria-label="Kitchen photographs. On phones, swipe or use the arrow keys to browse." onKeyDown={keyboard} data-lenis-prevent>
        {kitchenPhotos.map((photo, index) => <figure className={s.card} key={photo.id} aria-label={`${index + 1} of ${kitchenPhotos.length}`}>
          <div className={s.media}><KitchenPhoto photo={photo} sizes="(max-width: 600px) 85vw, (max-width: 900px) 44vw, (max-width: 1440px) 29vw, 380px" /></div>
          <figcaption className={s.caption}><span className={s.number} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><div><p>{photo.caption}</p>{photo.credit && !isKitchenPlaceholder(photo) && <small>Illustrative stock photograph · {photo.credit.photographer}</small>}</div></figcaption>
        </figure>)}
      </div>
      <div className={s.controls}>
        <p className={s.swipeHint}>Swipe to explore <span aria-hidden="true">↔</span></p>
        <div className={s.dots} role="group" aria-label="Choose a kitchen photograph">{kitchenPhotos.map((photo, index) => <button type="button" key={photo.id} aria-label={`Show kitchen photo ${index + 1}: ${photo.shot}`} aria-controls="kitchen-team-photos" aria-pressed={active === index} onClick={() => show(index)}><span /></button>)}</div>
        <p className={s.srOnly} aria-live="polite" aria-atomic="true">Photo {active + 1} of {kitchenPhotos.length}</p>
      </div>
    </div>
  </section>;
}
