# Project briefs for jakedcl.com

Source: GitHub repos under `jakedcl`, read 2026-09-25. Use these facts on the portfolio. Do not invent features, clients, or live URLs that are not listed here. Recent Projects on the site come from Sanity, not from `src/data/resume.ts`.

---

## logiparty

**Repo:** [jakedcl/logiparty](https://github.com/jakedcl/logiparty) (public)  
**Live:** [logiparty.com](https://logiparty.com) · tenant example [test.logiparty.com](https://test.logiparty.com/login)  
**Also:** https://logiparty.vercel.app

Multi-tenant SaaS for third-party logistics companies that run warehouse, fleet, and crew for live events, deliveries, festivals, and corporate work. Each 3PL gets its own workspace and a white-label client portal. Staff and clients are not supposed to see the Logiparty name in day-to-day use.

**Who uses it**

- Platform: Logiparty
- Tenant: the 3PL (org admin, managers, warehouse staff, drivers)
- End client: the 3PL’s customers (example in the product spec: Red Bull), who only see their own jobs and inventory

**What it does**

- Subdomain per org: `{slug}.logiparty.com`
- Invite-only auth. Roles: OrgAdmin, Manager, Staff, Client. Staff have capability tags (driver, warehouse, forklift, lead, rigger, staging)
- Jobs are the unit of work: inventory lines, fleet, crew, up to 5 locations, documents, activity. Statuses: draft → upcoming → ready → completed, or draft → denied
- Client portal: request a job, upload PDFs/images, see only that company’s inventory and jobs
- Catalogs: client-owned inventory, the 3PL’s own inventory, and a separate fleet
- Inventory and vehicles lock while a job is upcoming or ready, then release after load-out
- Auto-ready when load-in crew, load-out crew, a vehicle, and loaded quantities are all in place
- Documents in Cloudflare R2 via signed URLs
- Staff time-off requests that managers approve
- Org activity log, scoped by role
- White-label: org name, logo, primary color, email from-name
- Dashboard areas in the app: jobs, my-jobs, clients, client inventory, inventory, fleet, team, availability, activity, notifications, settings, profile

**Stack:** Next.js 15 App Router, React 19, Tailwind v4, shadcn/ui, NextAuth v5, Drizzle, Neon Postgres with row-level security, Cloudflare R2, Resend, Vercel. Stripe billing is scaffolded (checkout, portal, webhook, settings) and is not the shipped customer story yet. Realtime is deferred.

**Status:** Milestones M0–M5 (MVP) are built. Hand onboarding is the v1 plan, not public signup. A school capstone, `thirdpartylogistics`, sits in the repo as legacy reference only.

**Portfolio angle:** This is the serious product. Full-stack, multi-tenant, RLS, white-label, real ops workflow. Do not describe it as a class project.

---

## headsuptrucker

**Repo:** [jakedcl/headsuptrucker](https://github.com/jakedcl/headsuptrucker) (private)  
**URL on the repo:** https://headsuptrucker.vercel.app

Free, map-first tool for posted vehicle clearances around NYC, Long Island, the Hudson Valley, southwest Connecticut, and NYC-facing New Jersey. You enter a vehicle height. Red markers are at or below it. Orange markers are 1–12 inches above it. No account, payment, or routing service.

**What it does**

- `/` height entry. Max supported vehicle height is 13′6″
- `/map?height=` map for that height. URL keeps lat, lng, zoom, selected bridge, and optional from/to
- From/To traces a driving path and lists posted records near it. It is not turn-by-turn navigation
- Clustered markers, a mobile clearance list, and `/methodology` for sources and limits
- Gray markers mean more than 12 inches of clearance, not a guaranteed fit
- Missing data is not treated as clear. New York’s one-foot posting allowance is never added into the hazard math

**Data:** A committed snapshot, so the site does not call government APIs on each visit. Sources are adapted in `scripts/sources/`: NYSDOT posted height and load, CTDOT posted height, NJDOT truck-map low clearances, OSM maxheight for NJ (labeled as community data). NYC’s older 149-location set is kept for audit and is not shown as posted warnings. Basemap is OpenStreetMap raster tiles via MapLibre.

**Stack:** Next.js 16, React 19, TypeScript, MapLibre. No database, no analytics, no stored geolocation. Fonts are local.

**Status:** The README calls it a local working prototype that builds for Vercel and has not been field-verified. `robots` is set to noindex until launch checks are done. Do not claim it is a finished public routing product.

**Portfolio angle:** A data pipeline plus a map UI. Official feeds, provenance, and careful labeling of what a marker does and does not mean.

---

## metrotapes

**Repo:** [jakedcl/metrotapes](https://github.com/jakedcl/metrotapes) (public)  
**URL on the repo:** https://metrotapes.vercel.app  
**Public site used elsewhere:** metrotapes.com

An interactive subway-station scene. The station is the navigation. Photo, video, and about are camera shots inside the 3D space, not separate page layouts. A blog route is a normal page.

**What it does**

- Boot screen, then a station intro
- Routes: `/` (kiosk), `/photo`, `/video`, `/about`, `/blog`
- `StationScene` (React Three Fiber) with kiosk UI, a metro machine face, subway lamp, and wall pages you can interact with
- Graphics quality tiers
- Sanity-backed content (client, image URL builder, portable text, embedded studio build)

**Stack:** Vite, React 18, React Router, Three.js, React Three Fiber, postprocessing, Sanity, styled-components. Studio is built into the Vercel output under `/studio`.

**Portfolio angle:** The 3D piece. Custom scene, not a template gallery. Say it works on desktop and mobile only if you have checked the current build; the scene is built to run in the browser with a boot/intro.

---

## 731photography

**Repo:** [jakedcl/731photography](https://github.com/jakedcl/731photography) (private)  
**Brand:** Thomas Lurker (public) / 731photography (shop)  
**Live:** [thomaslurker.com](https://thomaslurker.com)  
**Also:** https://731photography.vercel.app

Print shop and event-booking site built as a birthday gift for photographer Thomas Lurker. He sells unframed prints and takes event inquiries. He is not a developer, so Studio and checkout stay simple.

**What it does**

- `/` featured-photo hero and a shop preview
- `/prints` masonry gallery, `/prints/[slug]` with a crop preview that follows the selected size, then Stripe Checkout
- Buyer picks size and finish (Enhanced Matte or Lustre). Retail price is per size. The Prodigi SKU changes with the size/finish pair
- After payment, a Stripe webhook creates a Prodigi order and sends buyer and owner emails (Resend). Prodigi callbacks send ship and cancel mail. Order numbers look like `TL-` plus 8 hex characters
- `/book` event inquiry, `/contact` for order or general questions
- `/about` from Sanity, plus shipping, privacy, and terms
- Photos, print sizes/prices, and site settings are Sanity documents. Hotspot on the image drives the crop. `forSale: false` keeps a photo in the gallery with no buy button

**Not built:** framed or wall-art configurator.

**Stack:** Next.js 16 App Router, React 19, Tailwind 4, Sanity v6 (embedded `/studio`), Stripe, Prodigi Orders API, Resend, Vercel.

**Portfolio angle:** A real store. CMS, payments, print fulfillment, and email, wired as one flow. Do not call the fulfillment Gelato or Printful.

---

## skyinfoline

**Repo:** [jakedcl/skyinfoline](https://github.com/jakedcl/skyinfoline) (public)  
**URL on the repo:** https://skyinfoline.vercel.app  
**Studio:** https://skyinfoline.sanity.studio/  
**On jakedcl.com:** `/skyline` redirects here

Stylized Manhattan skyline from the west (Jersey City). Left to right is north to south. Buildings are transparent PNG cutouts in Sanity, scaled by height, not a 3D city model.

**What it does**

- Interactive 2D skyline and a building detail panel
- Keyboard nav (left, right, Esc)
- Era timeline with play/pause and era chips. A year-demolished field hides towers outside their lifespan (Twin Towers example: 2001)
- Two viewpoints: Jersey City (north → south) and Brooklyn Bridge (south → north)
- Building fields: name, height, year, architect, cluster, style, nicknames, skyline importance, order index, cutout PNG
- Content edits in Studio publish without a code deploy

**Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind 4, Sanity v6, embedded `/studio`.

**Status:** v1 baseline is shipped. Compare mode, night mode, and a true 3D orbit are parked or later. The current skyline is faux-3D cutouts.

**Portfolio angle:** A content-driven visual piece. Sanity is the product, not a blog bolted on. Do not describe it as a Three.js city.

---

## drewdella

**Repo:** [jakedcl/drewdella](https://github.com/jakedcl/drewdella) (public)  
**Live:** [drewdella.com](https://drewdella.com)  
**Also:** https://drewdella.vercel.app

Artist site for Drew Della that is a Google results page on purpose. Tabs are the navigation. Listings use the blue title, green cite, gray snippet pattern. The joke has to look accurate, then break (XP “congratulations” popup, doodles, the actual art).

**What it does**

- `/` is All, a mixed results page. `/home` is the old logo-and-search landing, linked as the “official site” result
- Tabs: All, Music, Images, Videos, Blog, Socials, Lyrics, Shopping, Maps
- Shop with nothing for sale uses a Google empty-results state, not a 404
- Site search ranks title matches over body matches across pages, Sanity docs, and stored videos. On mobile, the first tap opens results without the keyboard
- Sanity holds releases, lyrics, blog posts, one image gallery, social links, map venues, and a cron-owned YouTube cache
- A daily Vercel cron snapshots the YouTube channel into Sanity so visitors never call the YouTube API. Shorts whose title or description contain `#` are dropped. The cache keeps 12 videos
- Mapbox for live-show venues

**Stack in the repo today:** Next.js 15 App Router, React 18, MUI, Sanity, Mapbox GL, Turf, Vercel. The README’s architecture section still describes an older Vite SPA. Trust `package.json` and `app/`. Studio is at `/studio`. Sanity project `qcu6o4bq`, dataset `production`, public reads, server-only writes.

**Portfolio angle:** Information design. One composition, CMS as the catalog, and an API used on a schedule instead of per page view.

---

## favoritesonnyc

**Repo:** [jakedcl/favoritesonnyc](https://github.com/jakedcl/favoritesonnyc) (public)  
**URL on the repo:** https://favoritesonnyc.vercel.app

Website for Favorite Son Pizzeria & Wine Bar, 1210 Forest Avenue, Staten Island. Owner Danny Ippolito. New repo (created 2026-09-24).

**What the site is**

- Next.js 16, React 19, Tailwind 4. No CMS. Copy lives in `src/content/menu.ts` (menu) and `src/content/site.ts` (hours, walk-in notice, 86’d items)
- Routes: `/`, `/menu`, `/drinks`, `/story`, `/visit`, plus `robots.ts` and `sitemap.ts`
- Homepage leads with whole pies, 14 inches, cut into six, the current service notice, menu, directions, and a phone link

**Facts the research brief treats as confirmed for copy**

- Favorite Son Pizzeria & Wine Bar
- 1210 Forest Avenue, Staten Island, NY 10310
- danny@favoritesonnyc.com · phone 929-805-0063
- Wednesday–Monday, 5–10 PM; closed Tuesday
- 100% sourdough pizza, natural wine, and cocktails
- As of the 2026-09-23 owner note: dine-in only, first come, no reservations yet, no delivery, no slices, no preorders
- Electric Moretti Forni oven. Do not call it wood-fired or coal-fired

A long research brief is in the repo (`favorite-son-research-brief.md`). It is background. The live pages and `src/content` are what shipped. Do not add supplier logos, fermentation times, or a biography that the brief marks as unverified.

**Portfolio angle:** A small client site with real operating constraints (hours, service model, menu) kept in code so the owner’s facts stay exact.

---

## compactpickup

**Repo:** [jakedcl/compactpickup](https://github.com/jakedcl/compactpickup) (public)  
**Live:** https://compactpickup.vercel.app

A VHS-styled catalog of compact and mid-size pickup trucks. Pick a manufacturer, open a model, or walk a timeline. Started as a React-fundamentals project and is a real Next app with a CMS.

**What it does**

- Home: manufacturer menu (Sanity), image carousel, a clock in the VHS chrome. “More…” and “One-Off's” sort to the bottom
- `/:manufacturer` and `/:manufacturer/:model` for listings and model pages
- `/timeline` for model history
- `TruckModel3D` for a 3D model view

**Stack:** Next.js 15, React 19, TypeScript, Tailwind 4, Sanity (separate `sanity/` studio), React Three Fiber, drei, Three.js. Deployed on Vercel. Last push on the repo was 2026-02-06.

**Portfolio angle:** Theme as interface (VHS), not a coat of paint. CMS-driven catalog plus a 3D model view. The README is written like a class writeup. Describe the product, not the homework outline.

---

## bannquet

**Repo:** [jakedcl/bannquet](https://github.com/jakedcl/bannquet) (public)  
**URL on the repo:** https://bannquet.vercel.app  
**Product domain named in the repo:** bannquet.com

Mountain weather and trip reports for the Northeast.

**Regions:** New York (Adirondacks, Catskills, Shawangunks, Thacher), Vermont (Green Mountains), New Hampshire (White Mountains), Maine (Baxter, Mahoosucs, Acadia).

**What it does**

- Weather from the National Weather Service, summit vs valley, hourly and daily forecasts, wind, precipitation, alerts
- A live ticker for extreme conditions across regions
- Mount Washington Observatory data for New Hampshire
- Trip reports: TipTap editor, compressed image uploads, optional Mapbox pin, tags (hiking, climbing, skiing, and so on)
- Email verification before a report is public (Resend). Publish link expires in 24 hours. Edit link does not expire
- Embedded Sanity Studio

**Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind 3.4, Framer Motion, Mapbox GL, TipTap, Sanity, Resend, NWS API.

**Related, not this repo:** [jakedcl/bannquet-io](https://github.com/jakedcl/bannquet-io) is a separate socket server described as the io server for `bannquet.com/usermap`. Do not merge that feature into this writeup unless you have read that repo.

**Portfolio angle:** A dashboard with a real public API and a community publishing flow (draft, verify, edit link), not a static weather widget.

---

## How to use this on jakedcl.com

- One project card per product. Lead with what a visitor can do, then the stack in a short line.
- Prefer the custom domain when the repo states one (logiparty.com, thomaslurker.com, drewdella.com, bannquet.com). Use the Vercel URL when that is all the repo claims.
- headsuptrucker and skyinfoline are the easy omissions if the feed only shows three cards. Favorite Son is a client site. Compact Pickup is the odd visual one.
- Do not paste seed users, database hostnames, or API keys from any repo into the site.
