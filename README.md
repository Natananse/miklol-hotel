# MIKLOL Cafe & Restaurant

A warm, playful restaurant website with an espresso-and-cream palette, burnt-orange accents, editorial typography, and real food photography. Built with Next.js 16 App Router, React 19, and TypeScript. The menu features 36 selections from the owner’s printed menu, with four items in each of nine categories and prices in ETB.

## Run locally

Use Node.js **22 LTS or newer** and npm (the Lighthouse tools need a recent Node runtime).

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). If that port is occupied, use the local URL printed by Next.js.

```bash
npm run typecheck   # TypeScript checks
npm run build       # Production build
npm start           # Serve the production build
```

Google Fonts are fetched during development/build through `next/font/google`, then served by the application. Installation and the first build require internet access; the food photographs are already stored locally.

## Stack and behavior

- **SCSS modules** handle component styling. Global SCSS supplies shared tokens, mixins, animations, typography, and reduced-motion rules.
- **Real-photo signature cards** use `next/image`, native scroll-snap, keyboard controls, and shared favourites. The hero retains its two-photo phone composition and larger-screen collage. The former Canvas showcase and its unused Three.js, React Three Fiber, drei, and type dependencies have been removed.
- **GSAP + ScrollTrigger** animate section reveals and counters. The kitchen image uses CSS `position: sticky` inside its own section, without a pinned animation or offsets. **Lenis** provides smooth scrolling on pointer-based desktop screens; phones and touch devices use native scrolling; **Framer Motion** handles the mobile menu and smaller interface transitions.
- **`next/image`** serves responsive, optimized photographs. The server-rendered hero and compact menu thumbnails use its `getImageProps` utility to avoid unnecessary client image hooks. **`next/font`** supplies Cormorant Garamond and DM Sans.
- The menu supports category and dietary filtering. Signature favorites persist in the browser when local storage is available. The gallery includes a keyboard-operable lightbox, and guest notes have slider controls.

The kitchen copy sits on a solid cream background. At desktop widths, text and image share the same top line and the image sticks below the header while the copy scrolls. Phones stack the photo below the text with a 4:5 aspect ratio. The orange badge sits beside the caption, outside the photo. Sections have a scroll margin so navigation links reveal their headings below the sticky header.

## Project structure

```text
app/                       App Router page, layout, SEO, and favicon
components/                Page sections, interactions, and SCSS modules
  SignatureDishes.tsx      Real-photo signature carousel
  KitchenStory.tsx         Ethiopian story and CSS-sticky image
data/
  menu.ts                 Menu categories, items, prices, dietary labels
  site.ts                 Business and contact details
  story-photo.ts          Story photo, accurate alt text, caption, crop
styles/
  _variables.scss         Colors, fonts, spacing, breakpoints
  _mixins.scss            Shared responsive and styling helpers
  _animations.scss        Reusable motion definitions
  globals.scss            Global styles and accessibility defaults
public/images/             Local coffee, food, interior, people, gallery photos
  menu/                   Optimized WebP menu and coffee photographs
scripts/download-images.py Photo download/optimization helper
CREDITS.md                 Exact photo sources and license links
```

## Make it yours

| Change | Edit |
| --- | --- |
| Menu names, descriptions, prices, images, categories | `data/menu.ts` |
| Contact details, address, map link, social links, opening hours | `data/site.ts` |
| Hero headline, buttons, and collage | `components/Hero.tsx` and `components/Hero.module.scss` |
| Hero photo paths, alt text, and blur placeholders | `data/hero-images.ts` |
| Hero and navigation palette | `styles/_hero-tokens.scss` |
| Story copy and Selam / ሰላም welcome card | `components/KitchenStory.tsx` |
| Story photo, alt text, stock caption, crop position | `data/story-photo.ts` |
| Signature-card selection | `signature: true` on items in `data/menu.ts` |
| Signature-carousel layout and controls | `components/SignatureDishes.tsx` and its SCSS module |
| Occasions, sample guest notes, footer copy | `components/Home.tsx` |
| Gallery images and descriptive alt text | `components/Gallery.tsx` |
| Reservation fields, time slots, validation, confirmation | `components/Reservation.tsx` |
| Announcement, navigation, preloader, scrolling effects | `components/SiteChrome.tsx` |
| Colors, spacing, fonts, responsive breakpoints | `styles/_variables.scss` |
| Google Font selection, page title, description, social previews | `app/layout.tsx` |

The signature carousel reads `signatureMenuItems` from `data/menu.ts`, so its names, descriptions, photographs, and prices stay consistent with the menu selections. The menu has four selections under each of nine headings: Breakfast, Juices & Shakes, Mocktails, Salads, Italian Dishes, Non-fasting, Fasting Dishes, Pizza, and Extras. Names, descriptions, and ETB prices were transcribed from the owner’s uploaded menu photographs. Handwritten price updates take precedence: Vegetable Wrap 250 ETB, Beef Pizza 420 ETB, and Margherita Pizza 400 ETB. The menu groups selections under their headings, and the category and vegetarian/fasting filters use the same data. Food photographs are representative stock images; they are not presented as photographs of MIKLOL’s actual dishes.

Source records for the new menu photos are in `scripts/menu-*-photo-sources.json`. Run `python3 scripts/build-menu-photo-credits.py` after updating those records to regenerate the credits in `CREDITS.md` and the public `/photo-credits.html` page linked from the menu.

To replace a photograph, put the new image in the relevant `public/images/` folder and update its path and alt text in the component or data record. Public image paths start with `/images/`; do not include `public/`. Preserve the component's image dimensions or `fill` container, responsive `sizes`, and placeholder behavior.

The original collection contains **31 distinct stock photographs**. The Ethiopian menu update adds five locally stored food/coffee stock photographs, plus nine WebP derivatives of the original international menu photos. All 14 menu WebPs, original images, and hero derivatives are documented in [CREDITS.md](CREDITS.md). To refresh the original stock collection:

```bash
python3 -m pip install requests Pillow
python3 scripts/download-images.py
```

This legacy helper requires internet access and overwrites the original stock images and credits file; it does not rebuild the newer menu WebPs or staged people photograph. Preserve the added credits when using it. Keep credits for any replacement photographs. The small phone hero image is an inline AVIF generated from `public/images/hero/pasta.jpg`. After replacing that photo, run `npm run assets:hero` to regenerate `pasta-mobile.avif` and `data/hero-mobile.ts`. This preserves the desktop image and removes an extra critical image request on phones.

The story section includes a finished **Selam / ሰላም** welcome card celebrating Habesha hospitality. Its copy speaks in MIKLOL’s house voice. The Amharic heading uses a locally bundled Noto Sans Ethiopic font, with its SIL Open Font License retained in `public/fonts/`. Zeynep S.’s Ethiopian coffee-ceremony photograph (`/images/menu/coffee-ceremony.webp`) accompanies the story with a finished buna caption. Update its `src`, `alt`, `caption`, and `objectPosition` in `data/story-photo.ts` to change the image. Photo attribution remains in `CREDITS.md`.

## Reservations and launch details

The reservation form is a **client-side preview**. It validates the date, time, party size, name, and phone number, rejects past visits using the `Africa/Addis_Ababa` timezone, and shows a confirmation summary. It does **not** create a booking, send a message, reserve capacity, or transmit guest details. After a valid preview, the guest can call the owner to confirm the table. Connect a booking provider or server endpoint and wait for its successful response before presenting a real reservation confirmation.

Menu items and prices come from the owner’s uploaded menu photos. Guest impressions, proposed hours, and venue/staff photography remain illustrative. Replace those remaining placeholders with verified MIKLOL information before launch. The owner’s phone (**+251 92 128 2925**, linked as `tel:+251921282925`) and address (**Bahir Dar, Kebele 14, around Nock**) are configured in `data/site.ts`. Directions use a Google Maps search for that description, without an invented map pin. The footer email is **erminati085@gmail.com**. Add verified social profile URLs when available. Opening hours remain labelled proposed until confirmed.

Vercel can auto-detect this project as Next.js and use `npm run build`; no custom output directory is needed. Canonical and social-image URLs use Vercel's production domain automatically, with the deployment domain as a fallback. Set `NEXT_PUBLIC_SITE_URL` only when you want to override that origin, such as for a preferred custom domain (see `.env.example`). Local builds fall back to `http://localhost:3000`.

`.vercelignore` excludes local configuration, environment files, reports, and test artifacts from uploads. Vercel's local project link is stored in `.vercel/`, which is excluded from Git. On another Next.js host, use `npm run build`, `npm start`, and an explicit `NEXT_PUBLIC_SITE_URL`.

## Phone behavior and browser checks

Phones have a 64px header, safe-area-aware Reserve/Menu/Call/Directions bar, compact menu cards, sticky swipe tabs, signature scroll-snap cards, swipeable review notes, and a fullscreen gesture gallery. The bottom bar hides for the keyboard, reservation form, and modal dialogs. Text inputs use 16px text and 52px fields. Real food photographs are used on every device; no WebGL scene is loaded. Motion respects reduced-motion preferences and phone scrolling is native.

The Playwright suite covers **360, 390, 430, 768, and 1024px**, real Chrome touch gestures, shared favorites, form validation, keyboard geometry, modal focus, lightweight photo rendering, and axe WCAG A/AA checks. The Ethiopian menu/kitchen layout review also targets **1440px**. The suite uses an installed Google Chrome browser. The configuration reuses a running development server or starts one when needed.

```bash
npm run test:e2e
```

For production performance measurements, build and start the app, then run Lighthouse Mobile:

```bash
npm run build
npm start
npx lighthouse http://localhost:3000 --only-categories=performance,accessibility --output=html
```

Measured results and changes from the earlier mobile pass remain recorded in `MOBILE-CHANGES.txt`; they are historical results, not a new measurement of this menu update. Lighthouse is a lab measurement; scores can vary by hardware, browser version, server, and network.
