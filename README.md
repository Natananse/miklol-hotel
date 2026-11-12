# MIKLOL Cafe & Restaurant

A warm, playful restaurant website with an espresso-and-cream palette, burnt-orange accents, editorial typography, interactive 3D scenes, and local food photography. Built with Next.js 16 App Router, React 19, and TypeScript.

## Run locally

Use Node.js **20.9 or newer** and npm.

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
- **Three.js, React Three Fiber, and drei** render a floating coffee cup with steam and a selectable food showcase. Models use procedural geometry, so no external `.glb` files or model-compression setup are required.
- **GSAP + ScrollTrigger** animate section reveals, counters, and the story. **Lenis** provides smooth scrolling; **Framer Motion** handles the mobile menu and smaller interface transitions.
- **`next/image`** serves responsive, optimized photographs. **`next/font`** supplies Cormorant Garamond and DM Sans.
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
| Hero, story, signature dishes, occasions, sample guest notes, footer copy | `components/Home.tsx` |
| Floating food names and prices | `floatingFoods` in `components/ThreeScene.tsx` |
| Gallery images and descriptive alt text | `components/Gallery.tsx` |
| Reservation fields, time slots, validation, confirmation | `components/Reservation.tsx` |
| Announcement, navigation, preloader, scrolling effects | `components/SiteChrome.tsx` |
| Colors, spacing, fonts, responsive breakpoints | `styles/_variables.scss` |
| Google Font selection, page title, description, social previews | `app/layout.tsx` |
| 3D geometry, materials, lighting, movement | `components/three/CanvasScene.tsx` |

Keep repeated dish names and prices in the signature section and 3D showcase consistent with `data/menu.ts`. All displayed menu prices use ETB.

To replace a photograph, put the new image in the relevant `public/images/` folder and update its path and alt text in the component or data record. Public image paths start with `/images/`; do not include `public/`. Preserve the component's image dimensions or `fill` container, responsive `sizes`, and placeholder behavior.

The collection contains **31 distinct optimized photographs**, about 5 MiB in total, with sources documented in [CREDITS.md](CREDITS.md). To refresh the stock collection:

```bash
python3 -m pip install requests Pillow
python3 scripts/download-images.py
```

This requires internet access and overwrites the stock images and credits file. Keep credits for any replacement photographs.

## Reservations and launch details

The reservation form is a **client-side preview**. It validates the name, email, date, time, and party size, rejects past visits using the `Africa/Addis_Ababa` timezone, and shows a confirmation summary. It does **not** create a booking, send email, reserve capacity, or transmit guest details. Connect a booking provider or server endpoint and wait for its successful response before presenting a real reservation confirmation.

The menu, prices, guest impressions, proposed hours, and venue/staff photography are illustrative. Replace them with verified MIKLOL information before launch. Add real contact and location details in `data/site.ts`; the current map area is decorative until a location link is supplied.

Deploy to a host that supports Next.js, with `npm run build` as the build command and `npm start` as the start command. Set `NEXT_PUBLIC_SITE_URL` to the public deployment URL (see `.env.example`); metadata, the canonical URL, and social image URLs use it in `app/layout.tsx`. Update the Open Graph image and copy as needed.

Performance and accessibility are design targets, not measured Lighthouse scores. Run Lighthouse against the **production build**, then check the menu, mobile navigation, lightbox, favorites, reservation validation, and 3D/static fallback on representative desktop and mobile devices.
