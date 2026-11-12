import Image from 'next/image';
import { heroImages } from '@/data/hero-images';
import { categories } from '@/data/menu';
import styles from './Hero.module.scss';

const tablePhotos = [
  { image: heroImages.burger, label: 'Burger' },
  { image: heroImages.salmon, label: 'Salmon' },
  { image: heroImages.dessert, label: 'Cake' },
];

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
            <Image {...heroImages.pasta} fill preload sizes="(max-width: 600px) 53vw, (max-width: 850px) 70vw, (max-width: 1200px) 40vw, 510px" placeholder="blur" />
          </figure>
          <figure className={`${styles.photo} ${styles.pizzaPhoto}`}>
            <Image {...heroImages.pizza} fill sizes="(max-width: 850px) 28vw, (max-width: 1200px) 16vw, 200px" placeholder="blur" />
          </figure>
          <figure className={`${styles.photo} ${styles.coffeePhoto}`}>
            <Image {...heroImages.coffee} fill sizes="(max-width: 850px) 25vw, (max-width: 1200px) 14vw, 180px" placeholder="blur" />
          </figure>
          <figure className={styles.interior}>
            <div className={`${styles.photo} ${styles.interiorPhoto}`}>
              <Image {...heroImages.interior} fill sizes="(max-width: 600px) 35vw, (max-width: 850px) 65vw, (max-width: 1200px) 35vw, 450px" placeholder="blur" />
            </div>
            <figcaption>Daylight, plants, and woven chairs.</figcaption>
          </figure>
        </div>

        <div className={styles.tablePhotos} aria-label="Burger, salmon, and chocolate cake">
          {tablePhotos.map(({ image, label }) => (
            <figure className={styles.tablePhoto} key={image.src}>
              <div className={styles.thumbnail}>
                <Image {...image} fill sizes="(max-width: 600px) 28vw, 72px" placeholder="blur" />
              </div>
              <figcaption>{label}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
