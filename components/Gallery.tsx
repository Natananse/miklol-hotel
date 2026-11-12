'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, ArrowUpRight, Plus, X } from 'lucide-react';
import styles from './InteractiveSections.module.scss';

const photos = [
  { src: '/images/gallery/gallery-01.jpg', alt: 'Pour-over coffee equipment on a cafe counter beside a window', label: 'A little morning magic' },
  { src: '/images/gallery/gallery-02.jpg', alt: 'Three friends clinking their cups of latte together', label: 'Coffee tastes better together' },
  { src: '/images/gallery/gallery-03.jpg', alt: 'A cheeseburger with crisp golden fries', label: 'Worth getting your hands on' },
  { src: '/images/gallery/gallery-04.jpg', alt: 'Colorful bowls of fresh salad and vegetables', label: 'A little color on the table' },
  { src: '/images/gallery/gallery-05.jpg', alt: 'Three vibrant yellow, orange, and red cocktails at a bar', label: 'A toast to good evenings' },
  { src: '/images/gallery/gallery-06.jpg', alt: 'A cafe entrance with a cafe sign and people visible through the window', label: 'Come on in' },
  { src: '/images/gallery/gallery-07.jpg', alt: 'An overhead breakfast spread with eggs, croissants, fruit, and coffee', label: 'Mornings made for more' },
  { src: '/images/gallery/gallery-08.jpg', alt: 'Brunch plates with avocado, eggs, and coffee on a wooden table', label: 'Meet you for brunch' },
];

const blur = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjODU2YTUwIi8+PC9zdmc+';

export default function Gallery() {
  const [selected, setSelected] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const isOpen = selected !== null;
  const move = useCallback((direction: number) => setSelected((current) => current === null ? null : (current + direction + photos.length) % photos.length), []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !isOpen) return;
    if (!dialog.open) dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
      if (dialog.open) dialog.close();
      if (openerRef.current?.isConnected) openerRef.current.focus({ preventScroll: true });
    };
  }, [isOpen]);

  const close = useCallback(() => { dialogRef.current?.close(); setSelected(null); }, []);

  return (
    <section className={styles.gallery} id="gallery" aria-labelledby="gallery-heading">
      <div className="container">
        <div className={styles.sectionTop}>
          <div><p className="eyebrow">THROUGH THE MIKLOL LENS</p><h2 className="section-heading" id="gallery-heading">Looks like <em>a good time.</em></h2></div>
          <span className={styles.galleryHint}>A taste of the atmosphere <ArrowUpRight size={19} aria-hidden="true" /></span>
        </div>
        <div className={styles.galleryGrid}>
          {photos.map((photo, index) => <button className={styles.galleryTile} key={photo.src} type="button" onClick={(event) => { openerRef.current = event.currentTarget; setSelected(index); }} aria-label={`Open photo: ${photo.alt}`}><Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 600px) 48vw, (max-width: 900px) 32vw, 25vw" placeholder="blur" blurDataURL={blur} /><span className={styles.galleryTileOverlay}><span>{photo.label}</span><Plus size={23} aria-hidden="true" /></span></button>)}
        </div>
      </div>
      <dialog className={styles.lightbox} ref={dialogRef} aria-label="Photo gallery" data-lenis-prevent onClose={() => setSelected(null)} onCancel={(event) => { event.preventDefault(); close(); }} onClick={(event) => { if (event.target === event.currentTarget) close(); }} onKeyDown={(event) => { if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); } if (event.key === 'ArrowRight') { event.preventDefault(); move(1); } }}>
        {selected !== null && <div className={styles.lightboxContent}>
          <div className={styles.lightboxTop}><span>MIKLOL / LITTLE MOMENTS</span><button type="button" onClick={close} aria-label="Close photo gallery" autoFocus><X size={23} /></button></div>
          <div className={styles.lightboxImage}><Image src={photos[selected].src} alt={photos[selected].alt} fill sizes="(max-width: 800px) 90vw, 1000px" className={styles.contain} /></div>
          <div className={styles.lightboxBottom}><p aria-live="polite">{photos[selected].label} <span>{String(selected + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}</span></p><div><button type="button" aria-label="Previous photo" onClick={() => move(-1)}><ArrowLeft size={21} /></button><button type="button" aria-label="Next photo" onClick={() => move(1)}><ArrowRight size={21} /></button></div></div>
        </div>}
      </dialog>
    </section>
  );
}
