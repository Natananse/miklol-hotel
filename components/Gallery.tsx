'use client';

import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, ArrowUpRight, Plus, X } from 'lucide-react';
import styles from './InteractiveSections.module.scss';
import mobile from './GalleryMobile.module.scss';

const photos = [
  { src: '/images/gallery/gallery-01.jpg', alt: 'Coffee being poured into a dripper beside a cafe window', label: 'The coffee pour' },
  { src: '/images/gallery/gallery-02.jpg', alt: 'Hands bringing two lattes and a black coffee together', label: 'Coffee for the table' },
  { src: '/images/gallery/gallery-03.jpg', alt: 'A cheeseburger served with golden fries', label: 'Burger and fries' },
  { src: '/images/gallery/gallery-04.jpg', alt: 'Grain salad with tomatoes and asparagus, with fruit on the side', label: 'Grains, greens, and tomatoes' },
  { src: '/images/gallery/gallery-05.jpg', alt: 'Three fruit-topped cocktails on a bar counter', label: 'Drinks at the bar' },
  { src: '/images/gallery/gallery-06.jpg', alt: 'Large CAFE lettering above an indoor bar', label: 'At the cafe counter' },
  { src: '/images/gallery/gallery-07.jpg', alt: 'An overhead breakfast spread with eggs, waffles, fruit, and coffee', label: 'Breakfast to share' },
  { src: '/images/gallery/gallery-08.jpg', alt: 'Rice topped with an egg and seaweed, with small side dishes', label: 'Lunch, served with sides' },
];

const blur = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjODU2YTUwIi8+PC9zdmc+';

export default function Gallery() {
  const [selected, setSelected] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const swipeStart = useRef<{ x: number; y: number; id: number } | null>(null);
  const pinchStart = useRef(0);
  const pinched = useRef(false);
  const isOpen = selected !== null;
  const move = useCallback((direction: number) => setSelected((current) => current === null ? null : (current + direction + photos.length) % photos.length), []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !isOpen) return;
    if (!dialog.open) dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    const previousGallery = document.documentElement.dataset.galleryOpen;
    document.body.style.overflow = 'hidden';
    document.documentElement.dataset.galleryOpen = 'true';
    return () => {
      document.body.style.overflow = previousOverflow;
      if (previousGallery === undefined) delete document.documentElement.dataset.galleryOpen;
      else document.documentElement.dataset.galleryOpen = previousGallery;
      pointers.current.clear();
      swipeStart.current = null;
      pinchStart.current = 0;
      pinched.current = false;
      if (dialog.open) dialog.close();
      if (openerRef.current?.isConnected) openerRef.current.focus({ preventScroll: true });
    };
  }, [isOpen]);

  const close = useCallback(() => { dialogRef.current?.close(); setSelected(null); }, []);

  function pointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === 'mouse') return;
    event.currentTarget.setPointerCapture(event.pointerId);
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.current.size === 1) swipeStart.current = { x: event.clientX, y: event.clientY, id: event.pointerId };
    if (pointers.current.size === 2) {
      const [first, second] = [...pointers.current.values()];
      pinchStart.current = Math.hypot(first.x - second.x, first.y - second.y);
      pinched.current = true;
    }
  }

  function pointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!pointers.current.has(event.pointerId)) return;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.current.size === 2 && pinchStart.current > 30) {
      const [first, second] = [...pointers.current.values()];
      const distance = Math.hypot(first.x - second.x, first.y - second.y);
      if (distance / pinchStart.current < .72) close();
    }
  }

  function pointerUp(event: PointerEvent<HTMLDivElement>) {
    const start = swipeStart.current;
    if (!pinched.current && start?.id === event.pointerId) {
      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      if (Math.abs(dx) >= 48 && Math.abs(dx) > Math.abs(dy) * 1.3) move(dx < 0 ? 1 : -1);
    }
    pointers.current.delete(event.pointerId);
    if (pointers.current.size === 0) {
      swipeStart.current = null;
      pinchStart.current = 0;
      pinched.current = false;
    }
  }

  function cancelPointers() {
    pointers.current.clear();
    swipeStart.current = null;
    pinchStart.current = 0;
    pinched.current = false;
  }

  return (
    <section className={`${styles.gallery} ${mobile.gallery}`} id="gallery" aria-labelledby="gallery-heading">
      <div className="container">
        <div className={styles.sectionTop}>
          <div><p className="eyebrow">COFFEE, PLATES & TABLES</p><h2 className="section-heading" id="gallery-heading">Take a look around.</h2></div>
          <span className={`${styles.galleryHint} ${mobile.hint}`}>Select a photo to enlarge <ArrowUpRight size={19} aria-hidden="true" /></span>
        </div>
        <div className={`${styles.galleryGrid} ${mobile.grid}`}>
          {photos.map((photo, index) => <button className={`${styles.galleryTile} ${mobile.tile}`} key={photo.src} type="button" onClick={(event) => { openerRef.current = event.currentTarget; setSelected(index); }} aria-label={`${photo.label}. Enlarge photo: ${photo.alt}`}><Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 600px) calc(50vw - 24px), (max-width: 900px) 32vw, 25vw" placeholder="blur" blurDataURL={blur} /><span className={`${styles.galleryTileOverlay} ${mobile.tileOverlay}`}><span>{photo.label}</span><Plus size={23} aria-hidden="true" /></span></button>)}
        </div>
      </div>
      <dialog className={`${styles.lightbox} ${mobile.mobileLightbox}`} ref={dialogRef} aria-label="Enlarged restaurant photos" aria-describedby="gallery-gesture-help" data-lenis-prevent onClose={() => setSelected(null)} onCancel={(event) => { event.preventDefault(); close(); }} onClick={(event) => { if (event.target === event.currentTarget) close(); }} onKeyDown={(event) => { if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); } if (event.key === 'ArrowRight') { event.preventDefault(); move(1); } }}>
        {selected !== null && <div className={`${styles.lightboxContent} ${mobile.mobileContent}`}>
          <div className={`${styles.lightboxTop} ${mobile.mobileTop}`}><span>MIKLOL / FOOD & TABLES</span><button type="button" onClick={close} aria-label="Close enlarged photo" autoFocus><X size={23} aria-hidden="true" /></button></div>
          <div className={`${styles.lightboxImage} ${mobile.gestureSurface}`} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={cancelPointers}><Image src={photos[selected].src} alt={photos[selected].alt} fill sizes="(max-width: 600px) calc(100vw - 32px), (max-width: 800px) 90vw, 1000px" className={styles.contain} loading="eager" /></div>
          <p className={mobile.gestureHelp} id="gallery-gesture-help">Swipe for photos. Pinch inward to close.</p>
          <div className={`${styles.lightboxBottom} ${mobile.mobileBottom}`}><p aria-live="polite">{photos[selected].label} <span>{String(selected + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}</span></p><div><button type="button" aria-label="Previous photo" onClick={() => move(-1)}><ArrowLeft size={21} aria-hidden="true" /></button><button type="button" aria-label="Next photo" onClick={() => move(1)}><ArrowRight size={21} aria-hidden="true" /></button></div></div>
        </div>}
      </dialog>
    </section>
  );
}
