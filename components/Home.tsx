'use client';

import Image from 'next/image';
import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { AnimatePresence, m as motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ArrowLeft, ArrowRight, ArrowUpRight, CakeSlice, CalendarDays, Check, Coffee, Heart, Instagram, MapPin, Minus, Plus, Sparkles, Users, Wine } from 'lucide-react';
import { Header, SiteEffects } from './SiteChrome';
import MobileActions from './MobileActions';
import SignatureDishes from './SignatureDishes';
import KitchenStory from './KitchenStory';
import {categories, menuItems} from '@/data/menu';
import MenuExplorer from './MenuExplorer';
import Gallery from './Gallery';
import Reservation from './Reservation';
import { site } from '@/data/site';
import s from './Home.module.scss';

const blur = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHBhdGggZmlsbD0iIzYxNGIzZSIgZD0iTTAgMGgxNnYxNkgweiIvPjwvc3ZnPg==';
const reviews = [
  { text: 'Special Omelet, with meat, cheese, and vegetables.', name: 'From the MIKLOL team', detail: 'Menu suggestion', title: 'START WITH BREAKFAST' },
  { text: 'Lamb Tibs, with onion, green pepper, and rosemary.', name: 'From the MIKLOL team', detail: 'Menu suggestion', title: 'TIBS FOR LUNCH' },
  { text: 'Fresh Mango Juice. A bright finish to your meal.', name: 'From the MIKLOL team', detail: 'Menu suggestion', title: 'SOMETHING REFRESHING' },
];

export default function Home({ hero }: { hero: React.ReactNode }) {
  const reviewGesture = useRef<{ x: number; y: number } | null>(null);
  const [review, setReview] = useState(0);
  const [occasion, setOccasion] = useState<number | null>(0);
  const [contactNotice, setContactNotice] = useState('');
  const reduced = useReducedMotion();
  function startReviewSwipe(event: ReactPointerEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest('button, a')) { reviewGesture.current = null; return; }
    if (event.pointerType !== 'mouse') {
      event.currentTarget.setPointerCapture(event.pointerId);
      reviewGesture.current = { x: event.clientX, y: event.clientY };
    }
  }
  function endReviewSwipe(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    const start = reviewGesture.current;
    reviewGesture.current = null;
    if (!start) return;
    const x = event.clientX - start.x;
    const y = event.clientY - start.y;
    if (Math.abs(x) > 45 && Math.abs(x) > Math.abs(y) * 1.4) setReview(current => (current + (x < 0 ? 1 : -1) + reviews.length) % reviews.length);
  }
  const occasions = [
    { title: 'Date night', text: 'Share a pizza. Leave room for chocolate cake.', alt: 'Dinner plates and wine glasses on a candlelit restaurant table', image: '/images/interior/date.jpg', icon: Heart },
    { title: 'Family lunch', text: 'Share beyaynetu, order a pizza, and finish with buna.', alt: 'Wooden tables and woven chairs in a spacious cafe dining room', image: '/images/interior/family.jpg', icon: Users },
    { title: 'Birthday table', text: 'Gather up to eight. Add chocolate cake to the plan.', alt: 'Colourful helium balloons ready for a birthday celebration', image: '/images/interior/birthday.jpg', icon: CakeSlice },
    { title: 'Coffee with colleagues', text: 'Meet over buna or a latte. Stay for lunch if you have time.', alt: 'Restaurant tables and dark chairs beside tall sunlit windows', image: '/images/interior/business.jpg', icon: Coffee },
  ];
  return <>
    <SiteEffects showIntro={false} /><Header />
    <main id="main">
      {hero}

      <div className={s.marquee} role="region" aria-label="Injera and tibs, buna and breakfast, pasta and pizza"><div aria-hidden="true">{Array.from({ length: 4 }, (_, i) => <span key={i}>INJERA & TIBS <b>✳</b> BUNA & BREAKFAST <b>✳</b> PASTA & PIZZA <b>✳</b> </span>)}</div></div>

      <MenuExplorer />

      <SignatureDishes />

      <section className={s.ambience} aria-labelledby="ambience-heading"><Image src="/images/interior/ambience.jpg" alt="Restaurant tables, upholstered chairs, and pendant lights around a central bar" fill sizes="100vw" placeholder="blur" blurDataURL={blur} /><div className={s.ambienceShade} /><div className={`container ${s.ambienceContent}`} data-reveal><span className="eyebrow">LUNCH AT MIKLOL</span><h2 id="ambience-heading">Stay for<br />lunch.</h2><p>Coffee by the window.<br />Pizza and conversation at the table.</p><a href="#reservation" className="button">Plan your lunch <ArrowUpRight size={15} /></a></div><div className={`container ${s.stats}`}><div><strong data-count={menuItems.length}>{menuItems.length}</strong><span>MENU ITEMS</span></div><div><strong data-count={categories.length}>{String(categories.length).padStart(2, '0')}</strong><span>CATEGORIES</span></div><div><strong data-count={menuItems.filter(item => item.category === 'Non-fasting' || item.category === 'Fasting Dishes').length}>{String(menuItems.filter(item => item.category === 'Non-fasting' || item.category === 'Fasting Dishes').length).padStart(2, '0')}</strong><span>ETHIOPIAN PLATES</span></div><span className={s.statsNote}>Coffee, lunch,<br />or dinner.</span></div></section>

      <KitchenStory />

      <section className={s.occasions}><div className={`container ${s.occasionGrid}`}><div className={s.occasionCopy}><span className="eyebrow">MAKE PLANS AROUND THE TABLE</span><h2 className="section-heading" data-reveal>Dates, birthdays,<br />and family lunch.</h2><div className={s.accordion}>{occasions.map((item, index) => <div className={occasion === index ? s.accordionActive : ''} key={item.title}><button onClick={() => setOccasion(occasion === index ? null : index)} aria-expanded={occasion === index} aria-controls={`occasion-${index}`}><item.icon size={16} /><span>{item.title}</span>{occasion === index ? <Minus size={15} /> : <Plus size={15} />}</button><div id={`occasion-${index}`} hidden={occasion !== index}><p>{item.text}</p><a href="#reservation">Plan this visit <ArrowUpRight size={13} /></a></div></div>)}</div></div><div className={s.occasionPhoto}><AnimatePresence mode="wait"><motion.div key={occasion ?? 0} className={s.occasionImage} initial={false} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .25 }}><Image src={occasions[occasion ?? 0].image} alt={occasions[occasion ?? 0].alt} fill sizes="(max-width: 900px) 90vw, 45vw" placeholder="blur" blurDataURL={blur} /></motion.div></AnimatePresence><span><Wine size={18} /> A SHARED TABLE. BUNA TO FOLLOW.</span></div></div></section>

      <Gallery />

      <section className={s.testimonials} aria-roledescription="carousel" aria-label="Menu suggestions while guest reviews are pending"><div className={`container ${s.reviewGrid}`}><div data-reveal><span className="eyebrow">FROM THE MIKLOL TEAM</span><h2 className="section-heading">Guest<br />reviews.</h2><p className={s.reviewIntro}>No reviews are published yet.<br /><a className="text-link" href="#menu">Browse the menu <ArrowUpRight size={13} /></a></p><div className={s.reviewControls}><button aria-label="Previous menu suggestion" onClick={() => setReview((review + reviews.length - 1) % reviews.length)}><ArrowLeft size={16} /></button><span>0{review + 1} <span>/ 0{reviews.length}</span></span><button aria-label="Next menu suggestion" onClick={() => setReview((review + 1) % reviews.length)}><ArrowRight size={16} /></button></div></div><div className={s.reviewCard} aria-live="polite" aria-atomic="true" onPointerDown={startReviewSwipe} onPointerUp={endReviewSwipe} onPointerCancel={() => { reviewGesture.current = null; }} tabIndex={0} onKeyDown={event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); setReview(current => (current + (event.key === 'ArrowRight' ? 1 : -1) + reviews.length) % reviews.length); } }}><span className={s.quoteMark} aria-hidden="true">“</span><div key={review} className={s.reviewSlide}><h3>{reviews[review].title}</h3><blockquote>{reviews[review].text}</blockquote><div className={s.reviewAuthor}><span><Coffee size={20} /></span><div>{reviews[review].name}<small>{reviews[review].detail}</small></div><Sparkles size={18} /></div></div><div className={s.reviewDots} aria-label="Choose a menu suggestion">{reviews.map((item, index) => <button key={item.title} type="button" aria-label={`Show menu suggestion ${index + 1}`} aria-pressed={review === index} onPointerUp={event => { event.stopPropagation(); setReview(index); }} onClick={() => setReview(index)}><span /></button>)}</div></div></div></section>

      <Reservation />
    </main>
    <footer id="visit" className={s.footer}>
      <div className="container">
        <div className={s.footerTop}>
          <div>
            <a className={s.footerLogo} href="#top">MIKLOL<span>CAFE & RESTAURANT</span></a>
            <p>Injera, tibs, buna, and café favourites.<br />Come hungry.</p>
            <div className={s.socials}>
              {site.instagramUrl ? <a href={site.instagramUrl} target="_blank" rel="noreferrer" aria-label="MIKLOL on Instagram"><Instagram size={18} /></a> : <button aria-label="Check Instagram availability" onClick={() => setContactNotice('Our Instagram profile is not available yet.')}><Instagram size={18} /></button>}
              <a href="#gallery" aria-label="View food and dining-room photos"><Sparkles size={18} /></a>
              <a href="#reservation" aria-label="Reserve a table"><CalendarDays size={18} /></a>
            </div>
          </div>
          <div className={s.footerLinks}>
            <h3>EXPLORE MIKLOL</h3><a href="#menu">Menu</a><a href="#story">Our kitchen</a><a href="#gallery">Photos</a><a href="#reservation">Plan a table</a>
          </div>
          <div className={s.footerDetails}>
            <h3>FIND US. COME HUNGRY.</h3>
            <a href={site.mapUrl} target="_blank" rel="noreferrer" className={s.contactLink}>{site.address}<ArrowUpRight size={16} /></a>
            <a href={site.phoneHref} className={s.contactLink}>{site.phone}</a>
            {site.email && <a href={`mailto:${site.email}`} className={s.contactLink}>{site.email}</a>}
            <a className={s.hoursLink} href={site.phoneHref} aria-label={`Call to confirm opening hours. Proposed hours every day ${site.openingHours}`}><span>Hours (proposed)</span><strong>Every day · {site.openingHours}</strong></a>
          </div>
          <div className={s.map}>
            <div className={s.mapGrid} aria-hidden="true" /><MapPin size={28} /><span>Find MIKLOL</span>
            <a href={site.mapUrl} target="_blank" rel="noreferrer">Get directions <ArrowUpRight size={16} /></a>
          </div>
        </div>
        <div className={s.footerBottom}><span>© {new Date().getFullYear()} MIKLOL. Cafe & Restaurant.</span><span>Menu highlights · representative stock photography</span><a href="#top">TOP ↑</a></div>
        {contactNotice && <div className={s.contactNotice} role="status"><Check size={17} /><p>{contactNotice}</p><button onClick={() => setContactNotice('')} aria-label="Close contact notice">Close</button></div>}
      </div>
      <span className={s.footerWordmark} aria-hidden="true">COME HUNGRY.</span>
    </footer>
    <MobileActions />
  </>;
}
