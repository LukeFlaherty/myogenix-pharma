# Home Page Design PRD
**MyoGenix Pharma — Technology-Agnostic Reference**

This document is the authoritative design specification for the home page. It is written to be fully replicable in any technology stack (WordPress, Webflow, Shopify, plain HTML/CSS, etc.). All values are expressed in plain CSS units, not framework-specific utilities.

---

## Design System

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| Black | `#000000` | Headings, CTAs, active states |
| White | `#ffffff` | Page background, card backgrounds |
| zinc-50 | `#fafafa` | Subtle backgrounds, pill backgrounds |
| zinc-100 | `#f4f4f5` | Section backgrounds, dividers |
| zinc-200 | `#e4e4e7` | Card borders, dividers |
| zinc-300 | `#d4d4d8` | Decorative text (step numbers) |
| zinc-400 | `#a1a1aa` | Secondary labels, taglines, unit text |
| zinc-500 | `#71717a` | Body copy, descriptions |
| zinc-600 | `#52525b` | Supporting text |
| zinc-700 | `#3f3f46` | Button hover state |
| zinc-800 | `#27272a` | Alternative button hover |

### Typography

The site uses a single sans-serif font stack throughout. Use your site's existing sans-serif or a clean system font (`-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`).

| Role | Size | Weight | Color | Notes |
|---|---|---|---|---|
| Page headline (H1) | 36px mobile / 48px tablet / 60px desktop | 800 | `#000` | Line-height 1.1, letter-spacing -0.02em |
| Section heading (H2) | 30px / 36px | 700 | `#000` | Letter-spacing -0.01em |
| Category box title (H3) | 18px | 700 | `#000` | |
| Product name | 14px | 700 | `#000` | |
| Overline label | 10–11px | 700 | `#a1a1aa` | Uppercase, letter-spacing 0.1em |
| Body copy | 18px | 400 | `#71717a` | Line-height 1.6 |
| Card body / descriptions | 12–14px | 400 | `#71717a` | Line-height 1.6 |
| Taglines | 11px | 400 | `#a1a1aa` | |
| Price | 14–18px | 700 | `#000` | |
| Price unit suffix | 10px | 400 | `#a1a1aa` | |
| Button text | 10–14px | 700 | `#fff` | |
| Nav links | 14px | 500 | `#71717a` active → `#000` | |

### Spacing Scale
Base unit: **4px**. All spacing follows multiples of 4.

| Token | Value |
|---|---|
| xs | 4px |
| sm | 8px |
| md | 12px |
| lg | 16px |
| xl | 20px |
| 2xl | 24px |
| 3xl | 32px |
| 4xl | 40px |
| 5xl | 48px |
| 6xl | 56px |
| 7xl | 64px |
| 8xl | 80px |

### Border Radius

| Token | Value | Usage |
|---|---|---|
| Pill | 9999px | Badges, overline chips |
| Large button / tag | 8px | Small buttons, tags |
| Card (small) | 12px | Product cards |
| Card (standard) | 16px | Category boxes, step cards, peptide cards |

### Shadows

| State | Value |
|---|---|
| Default card | `none` |
| Hover card | `0 4px 16px rgba(0,0,0,0.08)` |
| Hover large card | `0 8px 24px rgba(0,0,0,0.10)` |

### Borders

All borders: `1px solid #e4e4e7` (zinc-200). On hover, transition to `1px solid #d4d4d8` (zinc-300).

### Max Content Width

- Standard sections: **1024px** centered with horizontal padding 16px
- Wide sections (category grid, peptide cards): **1152px** centered with horizontal padding 16px

### Breakpoints

| Name | Min-width |
|---|---|
| Mobile (default) | 0px |
| Tablet (sm) | 640px |
| Desktop (md) | 768px |
| Large (lg) | 1024px |

---

## Page Structure (top to bottom)

1. Navbar (sticky)
2. Hero
3. Category Boxes (Programs Grid)
4. New Arrivals (Featured Products)
5. How It Works
6. FAQ Accordion
7. Footer

---

## Section 1 — Navbar

**Behavior:** Sticky to the top of the viewport on scroll. Background is white at 90% opacity with a backdrop blur (8–12px). Bottom border: `1px solid #f4f4f5`.

**Height:** ~65px

**Layout:** Single horizontal row, `max-width: 1024px`, centered, `padding: 16px`.

```
[Logo]          [Nav links]          [Sign in]  [Get started button]
```

**Logo:** Image, height 36px, width auto.

**Nav links (desktop, ≥768px):**
- Items: Weight Management · Peptides · How it works · FAQ
- Font: 14px, weight 500
- Default color: `#71717a`
- Hover/active: `#000`
- Gap between items: 24px

**Right CTAs (desktop):**
- "Sign in" — text link, 14px, weight 500, color `#71717a`, hover `#000`
- "Get started" — filled button: background `#000`, color `#fff`, padding `8px 16px`, border-radius 12px, font 14px weight 700, hover background `#27272a`

**Mobile (<768px):**
- Show: Logo left, Cart icon + Hamburger icon right
- Hamburger: 3 horizontal bars (2px tall, 20px wide, gap 6px), transitions to an X on open
- Mobile menu drops below the bar: white background, top border `1px solid #f4f4f5`, padding `16px`, stacked nav links + "Get started" button full-width

---

## Section 2 — Hero

**Background:** White (`#ffffff`)

**Decorative element:** Subtle grid overlay covering the entire section. Two sets of 1px lines (vertical + horizontal), color `rgba(0,0,0,0.03)`, spaced every **48px**. Implemented as a `background-image` with two linear-gradients or as an absolutely-positioned non-interactive div behind the content.

```css
background-image:
  linear-gradient(to right, black 1px, transparent 1px),
  linear-gradient(to bottom, black 1px, transparent 1px);
background-size: 48px 48px;
opacity: 0.03;
```

**Padding:** `80px` top, `56px` bottom. `16px` horizontal.

**Content alignment:** Centered horizontally. All text center-aligned.

**Max content width:** 1024px

**Layout (flex column, centered, gap 20px):**

### Overline pill
- Rounded pill shape (border-radius 9999px)
- Border: `1px solid #e4e4e7`
- Background: `#fafafa`
- Padding: `6px 12px`
- Content: Small filled dot (6px circle, `#000`) + label text
- Label: "Provider-reviewed · FDA-registered compounding"
- Label font: 12px, weight 600, color `#52525b`

### H1 Headline
- Text: "Clinical programs for every health goal."
- Size: 36px mobile → 48px tablet → 60px desktop
- Weight: 800 (or heaviest available)
- Color: `#000`
- Line-height: 1.1
- Letter-spacing: -0.02em
- Max-width: 768px

### Subheadline paragraph
- Text: "Compounded weight management, men's health, sexual health, and performance peptides — reviewed by a licensed provider before every shipment."
- Size: 18px
- Weight: 400
- Color: `#71717a`
- Line-height: 1.6
- Max-width: 672px

> **No CTA buttons in the hero.** The intent is to let visitors scroll directly to the category product cards below.

---

## Section 3 — Category Boxes (Programs Grid)

**Background:** `#fafafa` (zinc-50)
**Top border:** `1px solid #f4f4f5`
**Padding:** `48px` vertical, `16px` horizontal
**Max content width:** 1152px

### Grid Layout

- **Desktop (≥640px):** 2 columns, gap 16px
- **Mobile (<640px):** 1 column, gap 16px

There are **4 category boxes** arranged in this 2×2 grid:

| Row 1 | Row 1 |
|---|---|
| Mens Health | Weight Loss |
| **Row 2** | **Row 2** |
| Sexual Health | Peptides |

### Category Box

Each box is a white card:
- Background: `#ffffff`
- Border: `1px solid #e4e4e7`
- Border-radius: 16px
- Padding: 20px

**Box header row** (space-between, vertically centered):
- Left: Category name — 18px, weight 700, color `#000`
- Right: "Shop all →" link — 12px, weight 600, color `#a1a1aa`, hover → `#000`, transition 150ms

**Product card row:**
- Horizontal scrolling container. Overflow hidden on the Y axis, scrollable on the X axis.
- Hidden scrollbar (scrollbar-width: none; -ms-overflow-style: none; and ::-webkit-scrollbar { display: none; })
- Gap between cards: 12px
- Bottom padding inside the scroll container: 8px (so the bottom border of cards isn't cut off)
- **Scroll hint:** A gradient overlay on the right edge of the container. Absolutely positioned, pointer-events none, width 48px, gradient from `#fff` (right) to `transparent` (left). This signals more cards exist off-screen.

### Product Card

Width: **176px fixed** (`flex-shrink: 0` — cards never compress)
Border-radius: 12px
Border: `1px solid #e4e4e7`
Background: `#ffffff`
Overflow: hidden
Cursor: pointer (entire card is a link)
Transition: border-color 150ms, box-shadow 150ms
Hover: border → `#d4d4d8`, shadow → `0 4px 16px rgba(0,0,0,0.08)`

**Card layout (flex column):**

1. **Product image** (top)
   - Aspect ratio: 1:1 (square)
   - Width: 100% of card (176px)
   - Object-fit: cover
   - Background: `#fafafa`
   - On hover: image scales to 104% (transition 300ms ease)

2. **Content area** (bottom, padding 12px)
   - **Product name:** 14px, weight 700, color `#000`, tight line-height
   - **Tagline:** 11px, weight 400, color `#a1a1aa`, line-height 1.4, margin-top 2px
   - **Price + button row** (space-between, align center, margin-top 12px):
     - Price: 14px, weight 700, color `#000`
     - Price unit (e.g. "/mo", "/vial"): 10px, weight 400, color `#a1a1aa`, margin-left 2px
     - "Shop →" button: background `#000`, color `#fff`, padding `4px 10px`, border-radius 8px, font 10px weight 700
     - Button hover: background `#3f3f46`

### Category Content Data

| Category | Products (repeat as placeholders) | Shop All Link |
|---|---|---|
| Mens Health | Tirzepatide ×4 (placeholder) | /weight-management/tirzepatide |
| Weight Loss | Tirzepatide, Semaglutide, Tirzepatide, Semaglutide | /weight-management |
| Sexual Health | Tirzepatide ×4 (placeholder) | /weight-management/tirzepatide |
| Peptides | Wolverine, Tesamorelin, Klow, Glow | /peptides |

**Product card data used:**

| Name | Tagline | Starting Price | Unit | Image | PDP Link |
|---|---|---|---|---|---|
| Tirzepatide | Dual-action GLP-1 therapy | $199 | /mo | tirzepatide.webp | /weight-management/tirzepatide |
| Semaglutide | Proven GLP-1 therapy | $179 | /mo | semaglutide.webp | /weight-management/semaglutide |
| Wolverine | Elite tissue recovery | $169 | /vial | wolverine.webp | /peptides/wolverine |
| Tesamorelin | GH optimization | $179 | /vial | tesamorelin.webp | /peptides/tesamorelin |
| Klow | Metabolic support | $149 | /vial | klow.webp | /peptides/klow |
| Glow | Longevity & renewal | $179 | /vial | glow.webp | /peptides/glow |

---

## Section 4 — New Arrivals (Featured Peptides)

**Background:** `#f4f4f5` (zinc-100) — one tone darker than the category section, providing visual separation
**Top border:** `1px solid #e4e4e7`
**Padding:** `56px` vertical, `16px` horizontal
**Max content width:** 1152px

### Section Header

**Layout:** On mobile, flex column centered. On desktop (≥640px), single row with left content and right link, space-between, align bottom.

**Left block:**
- Overline: "New arrivals" — 10px, weight 700, uppercase, letter-spacing 0.1em, color `#a1a1aa`
- H2: "3 new peptides" — 30px mobile / 36px desktop, weight 700, color `#000`, margin-top 6px
- Description paragraph: "The latest additions to our compounded peptide line. Provider-reviewed and shipped cold-chain from our FDA-registered facility." — 14px, color `#71717a`, line-height 1.6, max-width 512px, margin-top 8px

**Right link (desktop only):**
- "View all peptides →" — 14px, weight 600, color `#000`, text-decoration none, underline-offset 4px, hover: underline

**Header bottom margin:** 40px

### Featured Product Cards

**Desktop (≥640px):** 3 equal columns, gap 24px
**Mobile (<640px):** Single column (flex column), gap 16px — each card is a **horizontal** layout

---

#### Desktop Card (≥640px) — Vertical layout

Card: rounded 16px, border `1px solid #e4e4e7`, background `#fff`, overflow hidden, full-height flex column
Hover: border → `#d4d4d8`, shadow → `0 8px 24px rgba(0,0,0,0.10)`
Entire card is a clickable link.

**Image (top):**
- Aspect ratio: 1:1 (square)
- Width: 100%
- Object-fit: cover
- Background: `#fafafa`
- On hover: scale 103%, transition 300ms

**Content area (flex column, padding 20px, flex-grow 1):**
- Overline: Generic name — 10px, weight 700, uppercase, letter-spacing 0.1em, color `#a1a1aa`
- H3: Product name — 20px, weight 700, color `#000`, margin-top 4px
- Benefit text: 12px, color `#71717a`, line-height 1.6, flex-grow 1, margin-top 8px

**Price + CTA row** (bottom of content, border-top `1px solid #f4f4f5`, padding-top 16px, margin-top 16px):
- Left: "Starting at" label (10px, color `#a1a1aa`) + price line (18px bold `#000` + "/vial" suffix 10px `#a1a1aa`)
- Right: "Order →" button — background `#000`, color `#fff`, padding `6px 12px`, border-radius 12px, 12px font, weight 700

---

#### Mobile Card (<640px) — Horizontal layout

The same card flips to a **horizontal row** so all 3 cards are visible in one viewport without scrolling.

Card: rounded 16px, border `1px solid #e4e4e7`, background `#fff`, overflow hidden, flex **row**

**Image (left side):**
- Fixed dimensions: **112px × 112px** (flex-shrink: 0)
- Object-fit: cover
- Background: `#fafafa`

**Content area (right side, flex column, space-between, padding 12px):**
- Top block:
  - Overline: generic name (10px, `#a1a1aa`, uppercase)
  - Product name: 16px, bold, `#000`, margin-top 4px
  - Benefit text: 12px, `#71717a`, margin-top 4px
- Bottom row (price + button, border-top `1px solid #f4f4f5`, padding-top 12px, margin-top 12px):
  - Starting at label + price (16px bold) + unit (10px)
  - "Order →" button (10px, same style as desktop)

---

#### Featured Products Data

| Name | Generic Name | Benefit | Starting Price |
|---|---|---|---|
| Wolverine | Recovery Peptide Blend | Accelerated healing, joint & tendon repair, anti-inflammatory | $169/vial |
| Tesamorelin | GHRH Analogue | Visceral fat reduction, GH optimization, lean mass support | $179/vial |
| Glow | Longevity & Renewal Blend | Cellular regeneration, skin health, antioxidant defense, longevity | $179/vial |

---

## Section 5 — How It Works

**Background:** `#fafafa` (zinc-50)
**Top border:** `1px solid #f4f4f5`
**Padding:** `80px` vertical, `16px` horizontal
**Max content width:** 1024px
**Section ID:** `how-it-works` (for anchor links)

### Section Header

- Overline: "Process" — 12px, weight 600, uppercase, letter-spacing 0.1em, color `#a1a1aa`
- H2: "How it works" — 30px, weight 700, color `#000`, margin-top 8px
- Description: "From your first order to your ongoing program — here's what to expect at every step." — 16px, color `#71717a`, line-height 1.6, max-width 512px, margin-top 12px

**Header bottom margin:** 48px

### Step Cards Grid

- **Desktop (≥1024px):** 4 equal columns, gap 16px
- **Tablet (640–1023px):** 2 columns, gap 16px
- **Mobile (<640px):** 2 columns, gap 16px (images are smaller but layout stays 2-up so all 4 steps are visible without excessive scrolling)

### Step Card

Card: flex column, rounded 16px, border `1px solid #e4e4e7`, background `#fff`, overflow hidden. No hover effect (informational, not interactive).

**Photo (top):**
- Aspect ratio: **4:3** (landscape — less tall than square, keeps cards compact)
- Width: 100%
- Object-fit: cover
- Background: `#f4f4f5`

**Text area (padding 16px, flex column, flex-grow 1):**
- Step number: "01" / "02" / "03" / "04" — 10px, weight 700, uppercase, letter-spacing 0.1em, color `#d4d4d8` (zinc-300 — intentionally very light), margin-bottom 8px
- Title: 14px, weight 700, color `#000`, tight line-height (~1.3)
- Description: 12px, color `#71717a`, line-height 1.6, margin-top 6px

### Step Content

| # | Photo | Title | Description |
|---|---|---|---|
| 01 | questionnaire.png | Questionnaire | Answer a few questions and share your medical details. |
| 02 | review-provider.png | Reviewed & approved by provider | Discuss your goals and receive expert recommendations. |
| 03 | receive-medication.png | Receive medication | Medication and supplies shipped straight to your door. |
| 04 | calendar.png | Monthly monitoring | Stay on track with regular free check-ins to ensure progress. |

---

## Section 6 — FAQ Accordion

**Background:** `#ffffff`
**Top border:** `1px solid #f4f4f5`
**Padding:** `80px` vertical, `16px` horizontal
**Max content width:** 1024px
**Section ID:** `faq`

### Layout

- **Desktop (≥1024px):** 2-column grid, ratio 1:2 (left sidebar + right accordion)
- **Mobile/Tablet (<1024px):** Single column, header above accordion

**Left sidebar:**
- Overline: "FAQ" — 12px, weight 600, uppercase, `#a1a1aa`
- H2: "Common questions" — 30px, weight 700, `#000`, margin-top 8px
- Subtext: 14px, `#71717a`, margin-top 12px
- CTA button (optional): "Configure your program →" — background `#000`, white text, padding `12px 20px`, border-radius 12px, 14px weight 600, margin-top 24px

**Right accordion:**
- Items divided by `1px solid #f4f4f5` horizontal rules
- Each item has `16px` vertical padding

**Accordion item:**
- Button row: question text (14px, weight 600, `#000`) on the left, `+` icon on the right (color `#a1a1aa`, 16px)
- When open: icon rotates 45° (becomes `×`), answer text slides/fades in below
- Answer text: 14px, `#71717a`, line-height 1.6, margin-top 12px
- First item open by default

### FAQ Content

| Q | A |
|---|---|
| What is tirzepatide and how is it different from semaglutide? | Tirzepatide is a dual GIP/GLP-1 receptor agonist — it activates two metabolic pathways simultaneously. Semaglutide only activates the GLP-1 receptor. Clinical trials (SURMOUNT-1) show tirzepatide produced significantly greater average weight loss than semaglutide across comparable doses. |
| How does dosing escalation work? | You start at 10 mg/month and increase in 10 mg steps based on tolerance and provider guidance. Most patients step up every 4 weeks. Our configurator lets you plan your escalation upfront, and your provider confirms each step is appropriate before it ships. |
| Do I need a new consultation every month? | Subscribers don't. Your initial approval covers your configured escalation program. A new consultation is only required for one-time purchases, or if you request a dose change outside your original program. Consult fees are $79. |
| What if my provider adjusts my dose? | If your provider determines a different dose is more appropriate, they'll contact you before fulfilling the order. You're never charged for a dose that wasn't approved. |
| How is this compounded and where does it ship from? | Your medication is compounded at an FDA-registered 503A pharmacy in the United States. It ships refrigerated in discreet packaging with a cold pack valid for up to 72 hours in transit. |
| Can I cancel my subscription? | Yes — anytime. Cancel before your renewal date and you won't be charged for the next cycle. There's no minimum commitment and no cancellation fee. |

---

## Section 7 — Footer

**Background:** `#ffffff`
**Top border:** `1px solid #f4f4f5`
**Padding:** `64px` vertical, `16px` horizontal
**Max content width:** 1024px

### Grid Layout

- **Desktop (≥640px):** 4 columns (1 brand + 3 link groups), gap 40px
- **Mobile (<640px):** 2 columns; brand column spans full width

**Column 1 — Brand:**
- Logo image, height 32px, width auto
- Tagline: 12px, `#a1a1aa`, line-height 1.6, margin-top 12px

**Columns 2–4 — Link Groups:**

| Column | Group Name | Links |
|---|---|---|
| 2 | Programs | Weight Management, Tirzepatide, Semaglutide |
| 3 | Company | About, How it works, FAQ, Affiliate Program |
| 4 | Legal | Privacy Policy, Terms of Service, Contact |

- Group heading: 12px, weight 600, uppercase, letter-spacing 0.1em, `#a1a1aa`, margin-bottom 12px
- Link items: 14px, `#71717a`, hover `#000`, line-height 1, gap 8px between items

**Bottom bar** (margin-top 48px, border-top `1px solid #f4f4f5`, padding-top 24px):
- Layout: flex row space-between on desktop, column centered on mobile, gap 12px
- Left text: "© [year] MyoGenix Pharma. For informational purposes only. Not medical advice." — 12px, `#a1a1aa`
- Right text: "Compounded medications are not FDA-approved." — 12px, `#a1a1aa`

---

## Global Interaction Patterns

### Buttons

**Primary (filled):**
- Background: `#000`, text: `#fff`
- Border-radius: 12px
- Padding: `8px 16px` (small) or `12px 20px` (standard)
- Font: weight 700
- Hover: background `#27272a`, transition 150ms

**Text link / secondary:**
- No background, no border
- Color: `#71717a` default
- Hover: `#000`, optional underline
- Transition: color 150ms

### Card Hover

All clickable cards share this hover pattern:
- Border transitions from `#e4e4e7` → `#d4d4d8`
- Box-shadow fades in: `0 4px 16px rgba(0,0,0,0.08)`
- Any inner image scales to 103–104% (transform: scale)
- All transitions: 150–300ms ease

### Transitions

| Property | Duration | Easing |
|---|---|---|
| Color, border-color, background-color | 150ms | ease |
| Box-shadow | 150ms | ease |
| Image scale (hover) | 300ms | ease |
| Accordion open/close | 200ms | ease |
| Hamburger → X | 200ms | ease |

---

## Responsive Behavior Summary

| Section | Mobile (<640px) | Tablet (640–1023px) | Desktop (≥1024px) |
|---|---|---|---|
| Navbar | Logo + Cart + Hamburger | Logo + Cart + Hamburger | Full nav + Sign in + Get started |
| Hero headline | 36px | 48px | 60px |
| Category boxes | 1 column | 2 columns | 2 columns |
| Product cards inside boxes | Horizontally scrollable row (176px cards) | Same | Same |
| New peptide cards | Stacked, horizontal layout (img left, text right) | 3 columns, vertical layout | 3 columns, vertical layout |
| How it works | 2 columns | 2 columns | 4 columns |
| FAQ | Stacked (header then accordion) | Stacked | 2 columns (1:2 ratio) |
| Footer | 2 columns (brand full-width) | 4 columns | 4 columns |

---

## Notes on Scroll Behavior

- The navbar is **sticky** — it stays at the top of the viewport as the user scrolls.
- The `How it works` and `FAQ` sections are anchor-linked from the navbar (`#how-it-works`, `#faq`). Smooth scroll behavior is recommended: `html { scroll-behavior: smooth; }`.
- The horizontal product card rows should use native momentum scrolling on touch devices: `-webkit-overflow-scrolling: touch` (or the equivalent for your platform).
- Scrollbar is hidden on the horizontal product rows (visually), but the gradient fade on the right edge communicates that more content exists.
