import { getImageProps } from 'next/image';
import { heroImages } from '@/data/hero-images';
import { mobilePastaSrc } from '@/data/hero-mobile';
import { categories } from '@/data/menu';
import styles from './Hero.module.scss';

const tablePhotos = [
  { image: heroImages.burger, label: 'Burger' },
  { image: heroImages.salmon, label: 'Salmon' },
  { image: heroImages.dessert, label: 'Cake' },
];

// Next's server utility supplies optimized responsive URLs without client image hooks.
// A static image cannot dismiss a blur placeholder, so the SCSS frame is the placeholder.
function photoProps(image: { src: string; alt: string }, sizes: string, critical = false) {
  return getImageProps({
    src: image.src,
    alt: image.alt,
    fill: true,
    sizes,
    loading: critical ? 'eager' : 'lazy',
    fetchPriority: critical ? 'high' : undefined,
  }).props;
}

export default function Hero() {
  return (
    <section id="top" className={styles.hero} aria-labelledby="hero-title" data-calm-surface>
      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>MIKLOL · CAFE & RESTAURANT</p>
          <h1 id="hero-title">Breakfast.<br />Lunch. Dinner.<br />All at MIKLOL.</h1>
          <p className={styles.intro}>Garden Pesto Pasta. The MIKLOL Burger.<br />Espresso and chocolate cake to finish.</p>
          <div className={styles.actions}>
            <a href="#reservation" className={styles.primary}>Reserve a table</a>
            <a href="#menu" className={styles.secondary}>View the menu</a>
          </div>
          <ul className={styles.trustPoints} aria-label="Plan your visit">
            <li>{categories.length} menu sections</li>
            <li>Vegetarian options</li>
            <li>1–8 guests</li>
          </ul>
        </div>

        <div className={styles.collage} aria-label="Pasta, pizza, coffee, and cafe seating">
          <figure className={`${styles.photo} ${styles.mainPhoto}`}>
            <picture>
              <source media="(max-width: 600px)" type="image/avif" srcSet={mobilePastaSrc} />
              <img {...photoProps(heroImages.pasta, '(max-width: 600px) 53vw, (max-width: 850px) 70vw, (max-width: 1200px) 40vw, 510px', true)} />
            </picture>
          </figure>
          <figure className={`${styles.photo} ${styles.pizzaPhoto}`}>
            <img {...photoProps(heroImages.pizza, '(max-width: 850px) 28vw, (max-width: 1200px) 16vw, 200px')} />
          </figure>
          <figure className={`${styles.photo} ${styles.coffeePhoto}`}>
            <img {...photoProps(heroImages.coffee, '(max-width: 850px) 25vw, (max-width: 1200px) 14vw, 180px')} />
          </figure>
          <figure className={styles.interior}>
            <div className={`${styles.photo} ${styles.interiorPhoto}`}>
              <img {...photoProps(heroImages.interior, '(max-width: 600px) 35vw, (max-width: 850px) 65vw, (max-width: 1200px) 35vw, 450px')} />
            </div>
            <figcaption>Daylight, plants, and woven chairs.</figcaption>
          </figure>
        </div>

        <div className={styles.tablePhotos} aria-label="Burger, salmon, and chocolate cake">
          {tablePhotos.map(({ image, label }) => (
            <figure className={styles.tablePhoto} key={image.src}>
              <div className={styles.thumbnail}>
                <img {...photoProps(image, '(max-width: 600px) 28vw, 72px')} />
              </div>
              <figcaption>{label}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
