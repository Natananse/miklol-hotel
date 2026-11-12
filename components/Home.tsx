'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, CakeSlice, CalendarDays, Check, ChefHat, Coffee, Heart, Instagram, Leaf, MapPin, Minus, Plus, Sparkles, Utensils, Users, Wine } from 'lucide-react';
import { Header, ScrollCue, SiteEffects } from './SiteChrome';
import ThreeScene from './ThreeScene';
import MenuExplorer from './MenuExplorer';
import Gallery from './Gallery';
import Reservation from './Reservation';
import { site } from '@/data/site';
import s from './Home.module.scss';

const blur = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHBhdGggZmlsbD0iIzYxNGIzZSIgZD0iTTAgMGgxNnYxNkgweiIvPjwvc3ZnPg==';
const signatureDishes = [
  { id: 'burger', image: '/images/food/burger.jpg', tag: 'THE HOUSE CLASSIC', name: 'The MIKLOL Burger', detail: 'A juicy stack. A little crunch. Our kind of classic.', price: 590 },
  { id: 'pasta', image: '/images/food/pasta.jpg', tag: 'COMFORT, ON A PLATE', name: 'Garden Pesto Pasta', detail: 'Silky sauce, fresh herbs, and one more forkful.', price: 520 },
  { id: 'pancakes', image: '/images/food/pancakes.jpg', tag: 'MORNINGS, MADE BETTER', name: 'Slow Sunday Pancakes', detail: 'Fluffy layers, seasonal fruit, a slow start.', price: 420 },
];
const reviews = [
  { text: 'The kind of place where “just one coffee” turns into the best part of your afternoon.', name: 'For the coffee lover', detail: 'A sample guest impression', title: 'A moment worth slowing down for.' },
  { text: 'A table full of beautiful food, the people you love, and absolutely no reason to rush.', name: 'For the whole table', detail: 'A sample guest impression', title: 'Good company tastes even better.' },
  { text: 'Come for a little escape. Stay for that second bite, the warm light, and the feeling of being here.', name: 'For your next little escape', detail: 'A sample guest impression', title: 'Your new favourite little ritual.' },
];

export default function Home() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoritesReady, setFavoritesReady] = useState(false);
  const [review, setReview] = useState(0);
  const [occasion, setOccasion] = useState<number | null>(0);
  const [contactNotice, setContactNotice] = useState('');
  const reduced = useReducedMotion();
  useEffect(() => {
    try { const value: unknown = JSON.parse(localStorage.getItem('miklol-favorites') || '[]'); if (Array.isArray(value)) setFavorites(value.filter((item): item is string => typeof item === 'string')); } catch { /* Storage is optional. */ }
    setFavoritesReady(true);
  }, []);
  useEffect(() => { if (favoritesReady) { try { localStorage.setItem('miklol-favorites', JSON.stringify(favorites)); } catch { /* Favorites remain usable for this visit. */ } } }, [favorites, favoritesReady]);
  const favorite = (id: string) => setFavorites(current => current.includes(id) ? current.filter(value => value !== id) : [...current, id]);
  const occasions = [
    { title: 'A date to remember', text: 'A cosy corner. Something delicious to share. Just the two of you.', image: '/images/interior/date.jpg', icon: Heart },
    { title: 'The whole family, together', text: 'Bring your favourite people. There is always room for another good story.', image: '/images/interior/family.jpg', icon: Users },
    { title: 'Another year, more joy', text: 'Candles, cake, and a table full of smiles. Make your next birthday a little sweeter.', image: '/images/interior/birthday.jpg', icon: CakeSlice },
    { title: 'Big ideas. Better coffee.', text: 'Take the meeting somewhere inspiring. Let the coffee keep the ideas flowing.', image: '/images/interior/business.jpg', icon: Coffee },
  ];
  return <>
    <SiteEffects /><Header />
    <main id="main">
      <section className={s.hero} aria-labelledby="hero-title">
        <div className={`container ${s.heroInner}`}>
          <div className={s.heroCopy}>
            <div className={s.heroEyebrow}><span /> A GOOD MOMENT STARTS HERE</div>
            <motion.h1 id="hero-title" initial={reduced ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .65 }}>A little escape.<br />A lot of <em>flavour.</em><span className={s.headingStar} aria-hidden="true">✳</span></motion.h1>
            <p>For the first sip. The last bite.<br />And all the good moments in between.</p>
            <div className={s.heroActions}><a className="button" href="#menu">Explore the menu <ArrowUpRight size={15} /></a><a className="button-outline" href="#reservation">Find your table <ArrowUpRight size={15} /></a></div>
            <div className={s.highlights}><span><Coffee /> Coffee with character</span><span><Utensils /> Food with soul</span><span><Leaf /> Fresh, always</span></div>
          </div>
          <div className={s.heroVisual}>
            <div className={s.heroOrbit} aria-hidden="true" /><div className={s.heroOrbitSmall} aria-hidden="true" />
            <div className={s.visualCaption}><span>YOUR DAILY</span><span>little ritual.</span></div>
            <ThreeScene kind="coffee" />
            <div className={s.coffeeNote}><span className={s.noteIcon}><Coffee size={19} /></span><div>Happiness, freshly brewed.<small>One beautiful cup at a time.</small></div><span className={s.noteStar}>✦</span></div>
            <span className={s.heroCoordinate}>CRAFTED TO BE SAVOURED — MIKLOL</span>
          </div>
          <div className={s.heroBottom}><ScrollCue /><span>GOOD FOOD. GREAT COMPANY. <span>ALWAYS.</span></span><a href="#story">Get to know us <ArrowDownRight size={15} /></a></div>
        </div>
      </section>

      <div className={s.marquee} aria-label="Fresh coffee, hot food, good vibes"><div aria-hidden="true">{Array.from({ length: 4 }, (_, i) => <span key={i}>FRESH COFFEE <b>✳</b> HOT FOOD <b>✳</b> GOOD VIBES <b>✳</b> </span>)}</div></div>

      <MenuExplorer />

      <section className={s.foodShowcase} aria-labelledby="food-heading"><div className="container"><div className={s.foodHeading} data-reveal><div><span className="eyebrow">PLAY WITH YOUR FOOD. WE INSIST.</span><h2 id="food-heading" className="section-heading">A feast for<br />the <em>curious.</em></h2></div><p>A little spin. A little temptation.<br />Pick a craving and discover your next favourite.</p><span className={s.tinyStar} aria-hidden="true">✳</span></div><ThreeScene kind="food" /></div></section>

      <section id="signatures" className={s.signatures}><div className="container"><div className={s.sectionTop} data-reveal><div><span className="eyebrow">MADE TO MAKE YOU COME BACK</span><h2 className="section-heading">Some things just<br />hit <em>different.</em></h2></div><a className="text-link" href="#menu">Find your favourite <ArrowUpRight size={15} /></a></div><div className={s.dishGrid}>{signatureDishes.map((dish, index) => <article className={s.dish} key={dish.id} data-reveal><div className={s.dishPhoto}><Image src={dish.image} alt={dish.name} fill sizes="(max-width: 600px) 90vw, (max-width: 900px) 44vw, 30vw" placeholder="blur" blurDataURL={blur} /><span className={s.dishIndex}>0{index + 1}</span><motion.button whileTap={reduced ? undefined : { scale: .85 }} onClick={() => favorite(dish.id)} className={`${s.favorite} ${favorites.includes(dish.id) ? s.favorited : ''}`} aria-label={`${favorites.includes(dish.id) ? 'Remove' : 'Add'} ${dish.name} ${favorites.includes(dish.id) ? 'from' : 'to'} favorites`} aria-pressed={favorites.includes(dish.id)}><Heart size={16} fill={favorites.includes(dish.id) ? 'currentColor' : 'none'} /></motion.button></div><div className={s.dishInfo}><span>{dish.tag}</span><h3>{dish.name}</h3><p>{dish.detail}</p><div><strong>{dish.price} <small>ETB</small></strong><a href="#reservation" aria-label={`Reserve a table to try ${dish.name}`}><ArrowUpRight size={18} /></a></div></div></article>)}</div><p className={s.sampleNote}>A taste of what’s possible. Menu and prices are illustrative.</p></div></section>

      <section className={s.ambience} aria-labelledby="ambience-heading"><Image src="/images/interior/ambience.jpg" alt="A warmly lit restaurant with inviting tables and natural textures" fill sizes="100vw" placeholder="blur" blurDataURL={blur} /><div className={s.ambienceShade} /><div className={`container ${s.ambienceContent}`} data-reveal><span className="eyebrow">YOUR PAUSE BUTTON, FOUND.</span><h2 id="ambience-heading">Dine. Unwind.<br />Create <em>memories.</em></h2><p>Some places feed you.<br />The best ones make you feel something.</p><a href="#reservation" className="button">Make yourself at home <ArrowUpRight size={15} /></a></div><div className={`container ${s.stats}`}><div><strong data-count="12">12</strong><span>DISHES TO DISCOVER</span></div><div><strong data-count="6">06</strong><span>MENU MOODS</span></div><div><strong data-count="5">05</strong><span>PLAYFUL SIGNATURES</span></div><span className={s.statsNote}>A little something<br />for every appetite.</span></div></section>

      <section id="story" className={s.story}><div className={`container ${s.storyGrid}`}><div className={s.storyVisual} data-story-image><Image src="/images/people/chef.jpg" alt="A chef carefully preparing a plate in the kitchen" fill sizes="(max-width: 900px) 90vw, 42vw" placeholder="blur" blurDataURL={blur} /><span className={s.storyPhotoLabel}>A LITTLE CARE IN EVERY PLATE <ChefHat size={17} /></span><div className={s.storyBadge}><Sparkles size={20} /><span>MADE WITH<br /><em>a little soul.</em></span></div></div><div className={s.storyCopy}><span className="eyebrow" data-reveal>THE HEART BEHIND THE PLATE</span><h2 className="section-heading" data-reveal>Good food.<br />No shortcuts.<br /><em>Just heart.</em></h2><p data-reveal>MIKLOL is a feeling. That first deep breath after a busy day. The smell of fresh coffee. A plate you can’t help but share. A table you don’t want to leave.</p><div className={s.storyChapter} data-reveal><span>01 / THE IDEA</span><h3>A place to belong.</h3><p>We imagine a neighbourhood favourite where everyday moments become something worth remembering.</p></div><div className={s.storyChapter} data-reveal><span>02 / THE KITCHEN</span><h3>Let the good things shine.</h3><p>Honest ingredients, thoughtful plates, and a generous pinch of personality. That’s the MIKLOL way.</p></div><a className="text-link" href="#reservation">Come be part of the story <ArrowUpRight size={15} /></a></div></div></section>

      <section className={s.occasions}><div className={`container ${s.occasionGrid}`}><div className={s.occasionCopy}><span className="eyebrow">THERE’S ALWAYS A GOOD REASON</span><h2 className="section-heading" data-reveal>Your people.<br />Your moment.<br /><em>Our place.</em></h2><div className={s.accordion}>{occasions.map((item, index) => <div className={occasion === index ? s.accordionActive : ''} key={item.title}><button onClick={() => setOccasion(occasion === index ? null : index)} aria-expanded={occasion === index} aria-controls={`occasion-${index}`}><item.icon size={16} /><span>{item.title}</span>{occasion === index ? <Minus size={15} /> : <Plus size={15} />}</button><div id={`occasion-${index}`} hidden={occasion !== index}><p>{item.text}</p><a href="#reservation">Let’s make a plan <ArrowUpRight size={13} /></a></div></div>)}</div></div><div className={s.occasionPhoto}><AnimatePresence mode="wait"><motion.div key={occasion ?? 0} className={s.occasionImage} initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .25 }}><Image src={occasions[occasion ?? 0].image} alt={occasions[occasion ?? 0].title} fill sizes="(max-width: 900px) 90vw, 45vw" placeholder="blur" blurDataURL={blur} /></motion.div></AnimatePresence><span><Wine size={18} /> HERE’S TO THE GOOD MOMENTS.</span></div></div></section>

      <Gallery />

      <section className={s.testimonials} aria-roledescription="carousel" aria-label="Sample guest impressions"><div className={`container ${s.reviewGrid}`}><div data-reveal><span className="eyebrow">THE FEELING WE’RE HERE TO CREATE</span><h2 className="section-heading">Good moments.<br /><em>Better stories.</em></h2><p className={s.reviewIntro}>A glimpse of the experience we’re dreaming up.<br />Sample guest notes, ready for your real stories.</p><div className={s.reviewControls}><button aria-label="Previous guest impression" onClick={() => setReview((review + reviews.length - 1) % reviews.length)}><ArrowLeft size={16} /></button><span>0{review + 1} <span>/ 0{reviews.length}</span></span><button aria-label="Next guest impression" onClick={() => setReview((review + 1) % reviews.length)}><ArrowRight size={16} /></button></div></div><div className={s.reviewCard} aria-live="polite" aria-atomic="true"><span className={s.quoteMark} aria-hidden="true">“</span><AnimatePresence mode="wait"><motion.div key={review} initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: .2 }}><h3>{reviews[review].title}</h3><blockquote>{reviews[review].text}</blockquote><div className={s.reviewAuthor}><span><Coffee size={20} /></span><div>{reviews[review].name}<small>{reviews[review].detail}</small></div><Sparkles size={18} /></div></motion.div></AnimatePresence></div></div></section>

      <Reservation />
    </main>
    <footer className={s.footer}><div className="container"><div className={s.footerTop}><div><a className={s.footerLogo} href="#">MIKLOL<span>CAFE & RESTAURANT</span></a><p>A little escape. A lot of flavour.<br />And a table with your name on it.</p><div className={s.socials}>{site.instagramUrl ? <a href={site.instagramUrl} target="_blank" rel="noreferrer" aria-label="MIKLOL on Instagram"><Instagram size={17} /></a> : <button aria-label="Instagram profile information" onClick={() => setContactNotice('Our social profiles are coming soon. Follow the flavour here in the meantime.')}><Instagram size={17} /></button>}<a href="#gallery" aria-label="Explore MIKLOL photos"><Sparkles size={17} /></a><a href="#reservation" aria-label="Reserve a table"><CalendarDays size={17} /></a></div></div><div className={s.footerLinks}><h3>TAKE A LOOK</h3><a href="#menu">Our menu</a><a href="#story">Our story</a><a href="#gallery">The space</a><a href="#reservation">Find your table</a></div><div className={s.footerDetails}><h3>COME ON OVER</h3><p>{site.address}</p><p>Proposed opening hours<br /><span>Every day · {site.openingHours}</span></p>{site.email ? <a href={`mailto:${site.email}`}>{site.email}</a> : <button onClick={() => setContactNotice('MIKLOL’s contact details are being prepared. Use the reservation preview to explore your visit.')} className="text-link">Contact details <ArrowUpRight size={13} /></button>}</div><div className={s.map}><div className={s.mapGrid} aria-hidden="true" /><MapPin size={28} /><span>Your new favourite spot.</span>{site.mapUrl ? <a href={site.mapUrl} target="_blank" rel="noreferrer">Get directions <ArrowUpRight size={12} /></a> : <small>Location to be announced</small>}</div></div><div className={s.footerBottom}><span>© {new Date().getFullYear()} MIKLOL. Made for good moments.</span><span>Design preview · sample menu, imagery & guest notes</span><a href="#">BACK TO TOP ↑</a></div>{contactNotice && <div className={s.contactNotice} role="status"><Check size={17} /><p>{contactNotice}</p><button onClick={() => setContactNotice('')} aria-label="Dismiss contact information">Close</button></div>}</div><span className={s.footerWordmark} aria-hidden="true">GOOD TOGETHER.</span></footer>
  </>;
}
