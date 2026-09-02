# Design Brief: 90s Camcorder Theme — jakedcl.com

**Status:** Planned / not started  
**Scope:** Documentation only — **do not implement** until process gates are approved  
**Repo:** `jakedcl.com` (Next.js + Sanity portfolio)

---

## Context

- Earlier **3D notebook** exploration was abandoned. The site is back to a clean main portfolio.
- The user wants a **deliberate design process**, not vibe coding. Colors-only “themes” look cheap; the redesign must be a real system.
- Process: **agree on design → then implement**. Explain concepts before big changes so Jake can articulate the direction.
- **Audience:** Attract creative clients; also read as sharp to developers; everyday visitors should still “get it.”
- **Goals:** Generational (readable nostalgia), intuitive, modern — not a costume party or pure retro pastiche.

---

## Reference assets (already shared)

Images were shared in Cursor and saved as local assets. Use these as the visual north star:

1. **Blue OSD camcorder menu screen** — classic Handycam on-screen display: battery (~60min), LP mode, running timecode, tape remaining (~59min), 16BIT audio indicator. Deep blue field, white/cyan blocky HUD type.
2. **Physical stickers on silver body** — factory labels on metal: STAMINA, Super SteadyShot, 3.5" LCD. Small, purposeful badges on brushed/silver hardware.
3. **Sony Video 8 Handycam CCD-TRV15** — silver consumer body, teal LCD-side sticker language, compact 90s consumer product silhouette.
4. **Sony DCR-VX1000 Digital Handycam** — MiniDV prosumer energy: industrial gray, denser controls, more “serious” hardware feel.
5. **Another blue OSD** — SP mode, REC indicator, tape remaining, battery — reinforces HUD chrome as a recurring language.

These assets already cover hero / hardware / OSD direction. Stickers and textures may still need a curated pack (see wishlist).

---

## Design system (3 layers)

Treat the theme as three layers that map to UI roles — not one flat “blue filter.”

| Layer | Material language | Maps to UI |
| --- | --- | --- |
| **1. Hardware** | Silver / black, dials, panel seams, plastic+metal | Page frame, section shells, cards, structural chrome |
| **2. OSD** | Blue screen, mono HUD, timecode / battery / REC | Nav, status bars, chrome overlays, “system” UI |
| **3. Stickers** | STAMINA, Super SteadyShot, LCD badges, etc. | Accents on projects, skills, CTAs — sparse, intentional |

**Rule of thumb:** Hardware = structure. OSD = interface chrome. Stickers = moments of product personality.

---

## Fonts

| Role | Direction |
| --- | --- |
| **OSD / HUD** | VCR OSD Mono (or similar blocky mono). Locked early — this is the signature voice of the chrome. |
| **Body** | Helvetica / Neue Haas — Jake’s preference. Readable, modern, human. Do not replace body with OSD mono. |

---

## Content mapping

Same information architecture; new metaphors only where they earn their keep.

| Current | Camcorder metaphor |
| --- | --- |
| Filmstrip | Tape / playback |
| Resume | Title card / clean readable content (not a blue menu dump) |
| Projects | Recordings / sticker stack |

---

## Anti-patterns

- **Don’t** paint the entire resume as a blue OSD screen.
- **Don’t** sticker-collage the whole page.
- **Keep** body copy human and readable (Helvetica/Neue Haas).
- **One** signature interaction — not five competing gimmicks.

---

## Recommended approach

**Skin-first with one signature move.**

- Keep the **same content architecture**.
- Theme = **design system (3 layers) + one memorable interaction**.
- Avoid rebuilding IA or inventing parallel navigation metaphors until the visual system is proven.

---

## Asset wishlist (for Jake)

Priority order:

1. **Hero refs** — already strong enough from shared images; refine if needed after moodboard.
2. **Sticker pack by job** — curated labels for projects / skills / CTAs (not random clipart).
3. **Optional textures** — brushed metal, LCD grain, tape window — only if they support Hardware/OSD layers without clutter.
4. **Fonts locked early** — OSD mono + Helvetica/Neue Haas before any full-site pass.
5. **Content map questions** — confirm which sections get which layer (see open decisions).

---

## Open decisions (answer before build)

1. **First viewport:** viewfinder-first **or** silver body-first?
2. **Filmstrip:** keep as-is **or** lean into a tape-rolling feel?
3. **Resume:** mostly clean text with OSD chrome around the edges?
4. **One wow moment:** stickers **/** REC **/** cassette door **/** other?

Do not start implementation until these are decided (or explicitly deferred with a default).

---

## Process gates (do not skip)

User approves each step before code advances to the next:

1. **Moodboard lock**
2. **1-page brief** ← this document
3. **Wireframe**
4. **One component prototype**
5. **Full site pass**

**Explicit: DO NOT IMPLEMENT THE THEME YET.** Other production work on the current site may proceed in the meantime; this brief exists so the vision is not lost.

---

## Handoff note for future agents

- Read this file before any camcorder / 90s / Handycam / OSD theming work.
- Prefer explaining concepts and getting approval over large unsolicited UI diffs.
- Docs-only until gates 1–4 are complete and approved.
