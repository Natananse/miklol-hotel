'use client';

import Image from 'next/image';
import {useEffect, useRef, useState} from 'react';
import {ArrowLeft, ArrowRight, ArrowUpRight, Heart} from 'lucide-react';
import {signatureMenuItems, formatPrice} from '@/data/menu';
import {useFavorites} from '@/hooks/useFavorites';
import {useReducedMotion} from '@/hooks/useReducedMotion';
import s from './SignatureDishes.module.scss';

const blur = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHBhdGggZmlsbD0iIzYxNGIzZSIgZD0iTTAgMGgxNnYxNkgweiIvPjwvc3ZnPg==';

export default function SignatureDishes() {
  const track = useRef<HTMLDivElement>(null);
  const {isFavorite, toggleFavorite} = useFavorites();
  const reduced = useReducedMotion();
  const [edges, setEdges] = useState({start: true, end: false});
  const dishes = signatureMenuItems;

  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const update = () => setEdges({start: element.scrollLeft < 8, end: element.scrollLeft + element.clientWidth >= element.scrollWidth - 8});
    const resize = new ResizeObserver(update);
    resize.observe(element);
    element.addEventListener('scroll', update, {passive: true});
    update();
    return () => {resize.disconnect(); element.removeEventListener('scroll', update);};
  }, []);

  function move(direction: number) {
    const element = track.current;
    if (!element) return;
    const card = element.querySelector('article');
    element.scrollBy({left: direction * ((card?.getBoundingClientRect().width ?? element.clientWidth) + 24), behavior: reduced ? 'instant' : 'smooth'});
  }

  return <section id="signatures" className={s.section} aria-labelledby="signature-heading">
    <div className="container">
      <div className={s.heading}>
        <div><span className="eyebrow">ETHIOPIAN PLATES & CAFÉ FAVOURITES</span><h2 id="signature-heading" className="section-heading">Pass the injera.</h2><p>Local plates, café favourites,<br/>and a fresh juice to finish.</p></div>
        <a className="text-link" href="#menu">Explore the menu <ArrowUpRight size={17} aria-hidden="true"/></a>
      </div>
      <div ref={track} className={s.track} tabIndex={0} role="region" aria-label="Signature dishes. Swipe to see more." onKeyDown={event => {
        if (event.target !== event.currentTarget) return;
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1);}
      }}>
        {dishes.map((dish, index) => <article className={s.card} key={dish.id}>
          <div className={s.photo}>
            <Image src={dish.image} alt={dish.imageAlt} fill sizes="(max-width: 600px) 88vw, (max-width: 1023px) 44vw, (max-width: 1440px) 29vw, 410px" placeholder="blur" blurDataURL={blur} style={{objectPosition: dish.imagePosition}}/>
            <button type="button" className={`${s.heart} ${isFavorite(dish.id) ? s.saved : ''}`} aria-label={`${isFavorite(dish.id) ? 'Remove' : 'Save'} ${dish.name} ${isFavorite(dish.id) ? 'from' : 'to'} favorites`} aria-pressed={isFavorite(dish.id)} onClick={() => toggleFavorite(dish.id)}><Heart size={21} aria-hidden="true" fill={isFavorite(dish.id) ? 'currentColor' : 'none'}/></button>
          </div>
          <div className={s.copy}><span>{dish.category}</span><h3>{dish.name}</h3><p>{dish.description}</p><div className={s.bottom}><strong>{formatPrice(dish.price)}</strong><a href="#reservation" aria-label={`Reserve a table to try ${dish.name}`}><ArrowUpRight size={22} aria-hidden="true"/></a></div></div>
          <span className={s.srOnly}>{index + 1} of {dishes.length}</span>
        </article>)}
      </div>
      <div className={s.controls}><p>From our menu · prices in ETB · representative photos.</p><div><button type="button" aria-label="Previous signature dishes" onClick={() => move(-1)} disabled={edges.start}><ArrowLeft size={21} aria-hidden="true"/></button><button type="button" aria-label="Next signature dishes" onClick={() => move(1)} disabled={edges.end}><ArrowRight size={21} aria-hidden="true"/></button></div></div>
    </div>
  </section>;
}
