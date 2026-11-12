# MIKLOL Cafe & Restaurant

A warm, playful restaurant website with an espresso-and-cream palette, burnt-orange accents, editorial typography, interactive 3D scenes, and local food photography. Built with Next.js 16 App Router, React 19, and TypeScript.

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
- **Three.js, React Three Fiber, and drei** render a selectable food showcase. The hero uses a two-photo composition on phones and the existing collage on larger screens. Models use procedural geometry, so no external `.glb` files or model-compression setup are required.
- **GSAP + ScrollTrigger** animate section reveals, counters, and the story. **Lenis** provides smooth scrolling on pointer-based desktop screens; phones and touch devices use native scrolling; **Framer Motion** handles the mobile menu and smaller interface transitions.
- **`next/image`** serves responsive, optimized photographs. The server-rendered hero and compact menu thumbnails use its `getImageProps` utility to avoid unnecessary client image hooks. **`next/font`** supplies Cormorant Garamond and DM Sans.
- The menu supports category and dietary filtering. Signature favorites persist in the browser when local storage is available. The gallery includes a keyboard-operable lightbox, and guest notes have slider controls.

The 3D Canvas code loads dynamically when its section approaches the viewport; the render loop pauses out of view. A photograph remains visible while loading and replaces 3D for reduced-motion preferences, data-saving connections, devices reporting four or fewer logical processors or 4 GB of memory, and WebGL initialization/rendering failures. Food names and prices remain available through ordinary buttons in fallback mode.

## Project structure

```text
app/                       App Router page, layout, SEO, and favicon
components/                Page sections, interactions, and SCSS modules
  three/CanvasScene.tsx    Procedural coffee and food models
data/
  menu.ts                 Menu categories, items, prices, dietary labels
  site.ts                 Business and contact details
styles/
  _variables.scss         Colors, fonts, spacing, breakpoints
  _mixins.scss            Shared responsive and styling helpers
  _animations.scss        Reusable motion definitions
  globals.scss            Global styles and accessibility defaults
public/images/             Local coffee, food, interior, people, gallery photos
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
| Story, signature dishes, occasions, sample guest notes, footer copy | `components/Home.tsx` |
| Floating food names and prices | `floatingFoods` in `components/ThreeScene.tsx` |
| Gallery images and descriptive alt text | `components/Gallery.tsx` |
| Reservation fields, time slots, validation, confirmation | `components/Reservation.tsx` |
| Announcement, navigation, preloader, scrolling effects | `components/SiteChrome.tsx` |
| Colors, spacing, fonts, responsive breakpoints | `styles/_variables.scss` |
| Google Font selection, page title, description, social previews | `app/layout.tsx` |
| 3D geometry, materials, lighting, movement | `components/three/CanvasScene.tsx` |

Keep repeated dish names and prices in the signature section and 3D showcase consistent with `data/menu.ts`. All displayed menu prices use ETB.

To replace a photograph, put the new image in the relevant `public/images/` folder and update its path and alt text in the component or data record. Public image paths start with `/images/`; do not include `public/`. Preserve the component's image dimensions or `fill` container, responsive `sizes`, and placeholder behavior.

The collection contains **31 distinct stock photographs**, with optimized hero derivatives and sources documented in [CREDITS.md](CREDITS.md). To refresh the stock collection:

```bash
python3 -m pip install requests Pillow
python3 scripts/download-images.py
```

This requires internet access and overwrites the stock images and credits file. Keep credits for any replacement photographs. The small phone hero image is an inline AVIF generated from `public/images/hero/pasta.jpg`. After replacing that photo, run `npm run assets:hero` to regenerate `pasta-mobile.avif` and `data/hero-mobile.ts`. This preserves the desktop image and removes an extra critical image request on phones.

## Reservations and launch details

The reservation form is a **client-side preview**. It validates the date, time, party size, name, and phone number, rejects past visits using the `Africa/Addis_Ababa` timezone, and shows a confirmation summary. It does **not** create a booking, send a message, reserve capacity, or transmit guest details. After a valid preview, the guest can call the owner to confirm the table. Connect a booking provider or server endpoint and wait for its successful response before presenting a real reservation confirmation.

The menu, prices, guest impressions, proposed hours, and venue/staff photography are illustrative. Replace them with verified MIKLOL information before launch. The owner’s phone (**0921282925**) and address (**Bahir Dar, Kebele 14, around Nock**) are configured in `data/site.ts`. Directions use a Google Maps search for that description, without an invented map pin. The footer email is **erminati085@gmail.com**. Add verified social profile URLs when available. Opening hours remain labelled proposed until confirmed.

Deploy to a host that supports Next.js, with `npm run build` as the build command and `npm start` as the start command. Set `NEXT_PUBLIC_SITE_URL` to the public deployment URL (see `.env.example`); metadata, the canonical URL, and social image URLs use it in `app/layout.tsx`. Update the Open Graph image and copy as needed.

## Phone behavior and browser checks

Phones have a 64px header, safe-area-aware Reserve/Menu/Call/Directions bar, compact menu cards, sticky swipe tabs, signature scroll-snap cards, swipeable review notes, and a fullscreen gesture gallery. The bottom bar hides for the keyboard, reservation form, and modal dialogs. Text inputs use 16px text and 52px fields. Reduced motion, slow networks, and weak/unknown phone hardware receive static food photos. Phone scrolling is native.

The Playwright suite covers **360, 390, 430, 768, and 1024px**, real Chrome touch gestures, shared favorites, form validation, keyboard geometry, modal focus, weak-device fallbacks, and axe WCAG A/AA checks. It uses an installed Google Chrome browser. The configuration reuses a running development server or starts one when needed.

```bash
npm run test:e2e
```

For production performance measurements, build and start the app, then run Lighthouse Mobile:

```bash
npm run build
npm start
npx lighthouse http://localhost:3000 --only-categories=performance,accessibility --output=html
```

Measured results and changes from this mobile pass are recorded in `MOBILE-CHANGES.txt`. Lighthouse is a lab measurement; scores can vary by hardware, browser version, server, and network.


## Kitchen team photographs

The kitchen section is in `components/KitchenTeam.tsx`, styled in its SCSS module with the existing palette and typography. Six original photo placeholders are configured in `data/kitchen-team.ts`; no qualifying real stock photos were selected. See `CREDITS.md` for the source review and exact counts.

To add your own image, place it in `public/images/team/` and replace only the filename in the config. The `.placeholder.svg` suffix controls the empty state. Verify the planned alt/caption still describes your image. The first supplied image appears in the story; the buna image (or first supplied image) also appears in the hero; available photos populate the gallery. All share the same file paths. Stock images require credits and are labeled as illustrative, never as employees.

Desktop uses three columns, tablet uses two, and phones use a native scroll-snap track with 44px dot controls, arrow/Home/End key support and a live slide count. Cards reveal once as they enter view; reduced-motion users see them immediately. Images and captions occupy separate areas.

Focused checks: `npm run typecheck`, `npm run build`, and `npm run test:e2e -- tests/kitchen-team.spec.ts`.
