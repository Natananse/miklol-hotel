import Image from 'next/image';
import localFont from 'next/font/local';
import { ArrowUpRight, Coffee } from 'lucide-react';
import { storyPhoto } from '@/data/story-photo';
import s from './KitchenStory.module.scss';

const ethiopic = localFont({ src: '../public/fonts/NotoSansEthiopic-Regular.ttf', weight: '400', display: 'swap', preload: false });
const blur = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHBhdGggZmlsbD0iIzYxNGIzZSIgZD0iTTAgMGgxNnYxNkgweiIvPjwvc3ZnPg==';

/** CSS sticky stays inside this section, so it cannot pin over the next heading. */
export default function KitchenStory() {
  return <section id="story" className={s.story} aria-labelledby="story-heading">
    <div className={`container ${s.grid}`}>
      <div className={s.copy}>
        <span className="eyebrow">OUR STORY · BAHIR DAR</span>
        <h2 id="story-heading" className={s.heading}>An Ethiopian welcome.<br />A table to share.</h2>
        <p className={s.intro}>Injera to share, fresh food, and time for buna. An Ethiopian welcome in Bahir Dar.</p>

        <div className={s.chapter}>
          <span>01 / FROM THE KITCHEN</span>
          <h3>Cooked for the table.</h3>
          <p>Fresh ingredients, warm spices, and Ethiopian dishes alongside café favourites.</p>
        </div>
        <div className={s.chapter}>
          <span>02 / BUNA & CONVERSATION</span>
          <h3>Time for the coffee ceremony.</h3>
          <p>Buna from the jebena. Small cups, conversation, and a shared welcome.</p>
        </div>

        <div className={s.welcome}>
          <span>THE HEART OF HABESHA HOSPITALITY</span>
          <h3>Selam <span aria-hidden="true">·</span> <span lang="am" className={ethiopic.className}>ሰላም</span></h3>
          <p>Good food, a shared plate, and buna poured with care. Make yourself at home at the MIKLOL table.</p>
        </div>
        <a className={s.menuLink} href="#menu">Explore the menu <ArrowUpRight size={18} aria-hidden="true" /></a>
      </div>

      <figure className={s.visual}>
        <div className={s.photo}>
          <Image
            src={storyPhoto.src}
            alt={storyPhoto.alt}
            fill
            sizes="(max-width: 600px) calc(100vw - 32px), (max-width: 1023px) 88vw, (max-width: 1440px) 41vw, 580px"
            placeholder="blur"
            blurDataURL={blur}
            style={{ objectPosition: storyPhoto.objectPosition }}
          />
        </div>
        <figcaption className={s.caption}>
          <p>{storyPhoto.caption}</p>
          <span className={s.badge} aria-hidden="true"><Coffee size={25} /><span>BUNA</span></span>
        </figcaption>
      </figure>
    </div>
  </section>;
}
