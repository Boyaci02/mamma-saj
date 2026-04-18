# Design System — Mammas Saj

## Personality
Warm family-run Middle Eastern restaurant in Göteborg — saj, kebab, shawarma, manakish, burgers, pizza. Friendly, hand-made feel inspired by the mascot logo (chef in purple hijab, dome-oven with flames, saj paddle). Color story leans terracotta + saffron gold + warm cream, not generic red/green Lebanese clichés. Friendly, appetizing, legible — Swedish body copy.

## Colors
| Token          | Value      | Usage                              |
|----------------|------------|------------------------------------|
| --saffron      | #E8A13E    | Primary accent, CTAs, prices       |
| --saffron-deep | #C97E1E    | Button hover, focus rings          |
| --terracotta   | #C15A3A    | Secondary accent, section dividers |
| --oven-red     | #7A2E1F    | Dark warm red for headings bg      |
| --wood-brown   | #5B3A1F    | Body on cream, nav on scroll       |
| --charcoal     | #231712    | Deep text on cream                 |
| --cream        | #F7ECD8    | Primary page background            |
| --cream-warm   | #EFDEC2    | Alt section background             |
| --cream-soft   | #FBF4E6    | Card bg on cream                   |
| --off-white    | #FFFAF0    | Highest surfaces                   |
| --text         | #2B1F18    | Body text                          |
| --text-muted   | #6B5342    | Secondary text                     |
| --border       | rgba(91,58,31,0.12) | Borders/dividers          |
| --footer-bg    | #1C110B    | Footer, final dark section         |

## Typography
| Element | Font              | Size                          | Weight | Line-height |
|---------|-------------------|-------------------------------|--------|-------------|
| h1      | Fraunces          | clamp(3rem, 7vw, 5.5rem)      | 700    | 0.95        |
| h2      | Fraunces          | clamp(2rem, 4vw, 3rem)        | 600    | 1.1         |
| h3      | Fraunces          | 1.25rem                        | 600    | 1.3         |
| body    | Plus Jakarta Sans | 1rem (17px)                   | 400    | 1.65        |
| eyebrow | Plus Jakarta Sans | 0.74rem, letter-spacing 0.22em| 600    | —           |
| nav     | Plus Jakarta Sans | 0.88rem                       | 500    | —           |
| button  | Plus Jakarta Sans | 0.88rem, letter-spacing 0.06em| 600    | —           |

- Fraunces carries subtle optical sizing + slight warm character — fits the hand-made feel without feeling Italian-restaurant-cliché.
- Italic variants allowed on short accents (e.g. "äkta smaker").
- Headings use tight tracking (-0.02em on h1/h2), body defaults.

## Spacing Scale
4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 80 · 120 (px)

Section vertical rhythm: **120px** desktop, **80px** mobile.

## Border Radius
| Element  | Radius |
|----------|--------|
| Buttons  | 999px  |
| Cards    | 18px   |
| Inputs   | 12px   |
| Images   | 16px   |
| Pill tag | 999px  |

Rounded-pill buttons echo the soft cartoon logo language.

## Shadows
| Level   | Value                                             |
|---------|---------------------------------------------------|
| subtle  | 0 2px 8px rgba(35,23,18,0.06)                    |
| card    | 0 12px 32px rgba(35,23,18,0.08)                  |
| lifted  | 0 20px 48px rgba(35,23,18,0.18)                  |
| button  | 0 8px 24px rgba(201,126,30,0.28)                 |

## Buttons
| Style     | Background    | Text      | Border                         | Radius | Padding    |
|-----------|---------------|-----------|--------------------------------|--------|------------|
| Primary   | --saffron     | --charcoal| none                           | 999px  | 14px 28px  |
| Secondary | transparent   | --wood-brown | 1.5px solid rgba(91,58,31,0.3) | 999px  | 14px 28px  |
| Ghost     | transparent   | --wood-brown | none                         | 999px  | 10px 18px  |

Hover: transform translateY(-2px) + shadow lift; 150ms exit, instant on (Emil rule).

## Nav
- Fixed top. Transparent initially (over warm hero), gains cream+blur background once the hero has scrolled past.
- Left: logo-small.webp (44px) + "Mammas Saj" wordmark.
- Right: Meny · Om oss · Hitta oss · **Beställ online** (saffron pill CTA).
- Mobile (≤900px): hamburger menu, full-screen cream overlay.

## Hero
- Full 100vh. Warm cream gradient + subtle oven-glow radial at 60% 80% in saffron/terracotta. Optional SVG arabesque watermark at 6% opacity.
- Centered layout: eyebrow ("GÖTEBORG · MELLANÖSTERN") → display headline "Äkta smaker, bakade på stenen" → sub copy in Swedish → primary CTA "Beställ online" + ghost "Se menyn".
- logo.webp sits in about section, not the hero (to keep hero typographic and fast).

## Meny section
- 5 category cards on cream-warm section: Grillad Kyckling · Kebab & Shawarma · Manakish · Burgers · Pizza.
- 2fr / 3fr grid on desktop (one featured card + compact pair) OR simple 3-column, decide in build.
- Each card: food image (aspect 4/3) → title (Fraunces 1.25rem) → 1-line tagline → saffron "Se i menyn" underline link.
- No prices on site — prices live in Qopla. Every CTA path goes to Qopla.

## Om oss
- 2-column on desktop: logo.webp on left (600px max), text on right.
- Copy: "Vi är en liten, varm familjeplats mitt i Göteborg..." 2-3 sentences. Anchors: äkta smaker, färska råvaror, Deltavägen.

## Beställ (online)
- Alt bg: wood-brown or oven-red deep section with cream text.
- Big headline: "Hungrig?" and "Beställ online via Qopla" CTA.
- Mention: upphämtning + hemleverans via Qopla.

## Hitta oss
- 2-column: hours table (all days 10:00-21:00) + iframe Google Map of Deltavägen 6, 41730 Göteborg.
- Tel link if provided (owner hasn't shared — leave placeholder or omit).

## Footer
- Dark `#1C110B`. 3-col: brand + description / navigation / contact & social.
- Mini logo-small.webp at top of brand col.
- Copyright + Grupo/agency credit.

## Animation (Emil rules)
- Global `.fade-in`: opacity 0 + translateY(8px) → opacity 1 + translateY(0), 500ms cubic-bezier(0.22, 1, 0.36, 1).
- Stagger delays: 0, 50, 100, 150, 200, 250ms.
- Hover: 150ms exit / instant on (use `transition-duration: 0s` on `:hover`).
- Press: translateY(0) scale(0.98) in 80ms on `.btn:active` / `.card:active` where applicable.
- Respect `prefers-reduced-motion`.

## Image Language
- Food photography warm-toned, moody, dark-wood / rustic surfaces when possible.
- No bright white-studio shots — they clash with the cream page bg.
- Menu card covers: 4:3, loading="lazy", `object-fit: cover`, `transition: transform 600ms` on hover scale(1.04).
- Unsplash slot IDs documented in HTML `alt` attributes and the `image-credits` comment block for easy swap to owner photos later.

## SEO & Language
- Every piece of UI/copy in **Swedish**.
- Canonical: `https://mammassaj.se`
- Locale: `sv_SE`
- Restaurant JSON-LD: address, hours (Mo-Su 10:00–21:00), price range "€€", cuisines ["Middle Eastern", "Swedish"], sameAs Qopla.
- sitemap.xml, llms.txt (Swedish), index.md all in project root.

## Notes
- Domain: mammassaj.se (note double-s from "Mammas Saj" = Swedish possessive "Mom's Saj").
- All order/reservation intent leaves for Qopla — treat external link as a conversion event, give it visual priority.
- Logo files: assets/logo.webp (full, transparent), assets/logo-small.webp (200×200, for nav). Both transparent background.
- Part of owner's family restaurant, not chain. Friendly vibe > corporate vibe.
