'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { getImageProps } from 'next/image';
import { ArrowUpRight, Heart, Leaf, SlidersHorizontal } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { categories, formatPrice, menuItems, type MenuCategory } from '@/data/menu';
import { useFavorites } from '@/hooks/useFavorites';
import styles from './InteractiveSections.module.scss';

// Static optimized props avoid per-thumbnail image hooks and remain identical when filters change.
const categoryPhotoProps = Object.fromEntries(categories.map(category => {
  const dish = menuItems.find(item => item.category === category)!;
  return [category, getImageProps({
    src: dish.image, alt: dish.imageAlt, fill: true, loading: 'lazy',
    sizes: '(max-width: 600px) 44vw, (max-width: 900px) 28vw, 190px',
  }).props];
})) as Record<MenuCategory, ReturnType<typeof getImageProps>['props']>;
const menuPhotoProps = Object.fromEntries(menuItems.map(item => [item.id, getImageProps({
  src: item.image, alt: item.imageAlt, fill: true, loading: 'lazy', sizes: '80px',
}).props]));

export default function MenuExplorer() {
  const [category, setCategory] = useState<MenuCategory | 'All'>('All');
  const [diet, setDiet] = useState<'all' | 'vegetarian' | 'fasting'>('all');
  const tabs = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { isFavorite, toggleFavorite } = useFavorites();
  const items = useMemo(() => menuItems.filter(item => (category === 'All' || item.category === category) && (diet === 'all' || (diet === 'vegetarian' ? item.vegetarian : item.fasting))), [category, diet]);

  useEffect(() => {
    const row = tabs.current;
    const active = row?.querySelector<HTMLButtonElement>('[aria-pressed="true"]');
    if (!row || !active || row.scrollWidth <= row.clientWidth) return;
    const rowBox = row.getBoundingClientRect();
    const buttonBox = active.getBoundingClientRect();
    const overflow = buttonBox.left < rowBox.left ? buttonBox.left - rowBox.left : buttonBox.right > rowBox.right ? buttonBox.right - rowBox.right : 0;
    if (overflow) row.scrollTo({ left: row.scrollLeft + overflow, behavior: reducedMotion ? 'auto' : 'smooth' });
  }, [category, reducedMotion]);

  return (
    <section className={styles.menu} id="menu" aria-labelledby="menu-heading">
      <div className="container">
        <div className={styles.sectionTop}>
          <div><p className="eyebrow">ETHIOPIAN FOOD, BREAKFAST & BUNA</p><h2 className="section-heading" id="menu-heading">What are you<br />hungry for?</h2></div>
          <p className={styles.sectionIntro}>Tibs, shiro, and injera to share.<br />Pasta, pizza, and buna from the jebena.</p>
        </div>
        <div className={styles.categories} aria-label="Choose a menu category">
          {categories.map((item, index) => (
            <button type="button" key={item} className={`${styles.category} ${category === item ? styles.categoryActive : ''}`} onClick={() => setCategory(category === item ? 'All' : item)} aria-pressed={category === item}>
              <div className={styles.categoryImage}><img {...categoryPhotoProps[item]} /><span className={styles.categoryNumber}>0{index + 1}</span></div>
              <span className={styles.categoryLabel}>{item}<ArrowUpRight size={17} aria-hidden="true" /></span>
            </button>
          ))}
        </div>
        <div className={styles.menuToolbar}>
          <div ref={tabs} className={styles.menuTabs} aria-label="Filter dishes by category">
            {(['All', ...categories] as const).map((item) => <button key={item} type="button" onClick={() => setCategory(item)} aria-pressed={category === item} className={category === item ? styles.activeTab : ''}>{item === 'All' ? 'Full menu' : item}</button>)}
          </div>
          <label className={styles.dietFilter}><SlidersHorizontal size={15} aria-hidden="true" /><span className={styles.srOnly}>Filter by diet</span><select value={diet} onChange={event => setDiet(event.target.value as typeof diet)}><option value="all">All dishes</option><option value="vegetarian">Vegetarian</option><option value="fasting">Fasting (plant-based)</option></select></label>
        </div>
        <p className={styles.srOnly} role="status" aria-atomic="true">{items.length} {items.length === 1 ? 'dish' : 'dishes'} shown{diet === 'all' ? '' : `, ${diet} only`}.</p>
        <div className={styles.menuList}>
            {items.map((item) => <article key={item.id} className={styles.menuItem}>
              <div className={styles.menuItemImage}><img {...menuPhotoProps[item.id]} /></div>
              <div className={styles.menuItemCopy}><div className={styles.menuItemHeading}><h3>{item.name}</h3>{item.vegetarian && <Leaf size={13} aria-label="Vegetarian" />}</div><p>{item.description}</p>{item.note && <span className={styles.itemNote}>{item.note}</span>}</div>
              <div className={styles.menuItemMeta}><span className={styles.price}>{formatPrice(item.price)}</span><button type="button" className={`${styles.menuFavorite} ${isFavorite(item.id) ? styles.menuFavorited : ''}`} aria-label={`${isFavorite(item.id) ? 'Remove' : 'Save'} ${item.name} ${isFavorite(item.id) ? 'from' : 'to'} favorites`} aria-pressed={isFavorite(item.id)} onClick={() => toggleFavorite(item.id)}><Heart size={20} aria-hidden="true" fill={isFavorite(item.id) ? 'currentColor' : 'none'} /></button></div>
            </article>)}
          {items.length === 0 && <p className={styles.emptyState}>No dishes match. Choose another category.</p>}
        </div>
        <div className={styles.menuFootnote}><span><a className="text-link" href="#reservation">Choose a table <ArrowUpRight size={13} aria-hidden="true" /></a></span><p>Sample menu · prices in ETB · ask your server about allergens.</p></div>
      </div>
    </section>
  );
}
