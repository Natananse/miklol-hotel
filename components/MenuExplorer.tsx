'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight, Leaf, SlidersHorizontal } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { categories, formatPrice, menuItems, type MenuCategory } from '@/data/menu';
import styles from './InteractiveSections.module.scss';

const blur = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjODU2YTUwIi8+PC9zdmc+';
const categoryImages: Record<MenuCategory, string> = {
  Coffee: '/images/coffee/espresso.jpg', Breakfast: '/images/food/breakfast.jpg',
  Pasta: '/images/food/pasta.jpg', Pizza: '/images/food/pizza.jpg',
  Burgers: '/images/food/burger.jpg', Desserts: '/images/food/dessert.jpg',
};

export default function MenuExplorer() {
  const [category, setCategory] = useState<MenuCategory | 'All'>('All');
  const [vegetarian, setVegetarian] = useState(false);
  const reducedMotion = useReducedMotion();
  const items = useMemo(() => menuItems.filter((item) => (category === 'All' || item.category === category) && (!vegetarian || item.vegetarian)), [category, vegetarian]);

  return (
    <section className={styles.menu} id="menu" aria-labelledby="menu-heading">
      <div className="container">
        <div className={styles.sectionTop}>
          <div><p className="eyebrow">MADE TO MAKE YOUR DAY</p><h2 className="section-heading" id="menu-heading">A little craving.<br /><em>A lot of possibilities.</em></h2></div>
          <p className={styles.sectionIntro}>From your first sip to that one last bite.<br />Find something you love, any time of day.</p>
        </div>
        <div className={styles.categories} aria-label="Explore menu categories">
          {categories.map((item, index) => (
            <motion.button type="button" key={item} className={`${styles.category} ${category === item ? styles.categoryActive : ''}`} onClick={() => setCategory(category === item ? 'All' : item)} aria-pressed={category === item} whileHover={reducedMotion ? {} : { y: -6 }} whileTap={reducedMotion ? {} : { scale: .98 }}>
              <div className={styles.categoryImage}><Image src={categoryImages[item]} alt={`${item} at MIKLOL`} fill sizes="(max-width: 600px) 44vw, (max-width: 900px) 28vw, 190px" placeholder="blur" blurDataURL={blur} /><span className={styles.categoryNumber}>0{index + 1}</span></div>
              <span className={styles.categoryLabel}>{item}<ArrowUpRight size={17} aria-hidden="true" /></span>
            </motion.button>
          ))}
        </div>
        <div className={styles.menuToolbar}>
          <div className={styles.menuTabs} aria-label="Filter menu by category">
            {(['All', ...categories] as const).map((item) => <button key={item} type="button" onClick={() => setCategory(item)} aria-pressed={category === item} className={category === item ? styles.activeTab : ''}>{item === 'All' ? 'All the good stuff' : item}</button>)}
          </div>
          <label className={styles.dietFilter}><SlidersHorizontal size={15} aria-hidden="true" /><span className={styles.srOnly}>Dietary filter</span><select value={vegetarian ? 'vegetarian' : 'all'} onChange={(event) => setVegetarian(event.target.value === 'vegetarian')}><option value="all">All preferences</option><option value="vegetarian">Vegetarian</option></select></label>
        </div>
        <div className={styles.menuList} aria-live="polite" aria-atomic="true">
          <AnimatePresence mode="popLayout" initial={false}>
            {items.map((item) => <motion.article key={item.id} className={styles.menuItem} initial={reducedMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: .18 }}>
              <div className={styles.menuItemImage}><Image src={item.image} alt={item.name} fill sizes="80px" placeholder="blur" blurDataURL={blur} /></div>
              <div className={styles.menuItemCopy}><div className={styles.menuItemHeading}><h3>{item.name}</h3>{item.vegetarian && <Leaf size={13} aria-label="Vegetarian" />}</div><p>{item.description}</p>{item.note && <span className={styles.itemNote}>{item.note}</span>}</div>
              <span className={styles.price}>{formatPrice(item.price)}</span>
            </motion.article>)}
          </AnimatePresence>
          {items.length === 0 && <p className={styles.emptyState}>Nothing in this combination yet. Try another category.</p>}
        </div>
        <div className={styles.menuFootnote}><span>GOOD FOOD. NO COMPLICATED CHOICES.</span><p>Illustrative menu · prices in Ethiopian birr · please confirm allergens with your server.</p></div>
      </div>
    </section>
  );
}
