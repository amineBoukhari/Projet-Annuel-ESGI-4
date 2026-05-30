---
name: Gesto-Resto
description: A clean, professional restaurant management dashboard that turns operational chaos into calm clarity.
colors:
  primary: "#3ab7bf"
  primary-hover: "#2fa3aa"
  primary-muted: "#e6f7f8"
  secondary: "#ffc851"
  secondary-hover: "#e6b347"
  secondary-muted: "#fff8e6"
  ink: "#1a1a1a"
  ink-secondary: "#4a4a4a"
  ink-muted: "#6b7280"
  surface: "#f0f0f0"
  surface-raised: "#ffffff"
  border: "#e5e5e5"
  border-strong: "#d4d4d4"
  success: "#16a34a"
  warning: "#ca8a04"
  error: "#dc2626"
  info: "#2563eb"
typography:
  display:
    fontFamily: "Jost, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 4vw, 2.5rem)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Jost, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Jost, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "normal"
  body:
    fontFamily: "Jost, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Jost, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.01em"
rounded:
  sm: "6px"
  md: "10px"
  lg: "16px"
  xl: "24px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface-raised}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.surface-raised}"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  input:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
  card:
    backgroundColor: "{colors.surface-raised}"
    rounded: "{rounded.lg}"
    padding: "24px"
  nav-item:
    backgroundColor: "transparent"
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
  nav-item-active:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
  badge:
    backgroundColor: "{colors.primary-muted}"
    textColor: "{colors.primary-hover}"
    rounded: "{rounded.sm}"
    padding: "4px 10px"
---

# Design System: Gesto-Resto

## 1. Overview

**Creative North Star: "The Clean Ledger"**

Gesto-Resto is a restaurant management dashboard that treats operational data with the same care a bookkeeper treats a ledger: every number has its place, every status is clear, and nothing is decorated for decoration's sake. The visual system is built on calm confidence — professional without being cold, clean without being sterile, trustworthy without being dull.

The interface is organized around a simple rhythm: soft gray surfaces hold white cards, which hold the content. The primary teal acts as a reliable anchor — used for primary actions and key status indicators, never as decoration. The amber accent is sparing: it signals important states, highlights key metrics, and warns when attention is needed. The whole palette breathes; nothing competes for attention.

This system explicitly rejects generic Bootstrap/admin templates, cartoonish playfulness, and corporate density. It also rejects dark-mode-only developer aesthetics. Every screen should be scannable in under three seconds, and every interaction should feel predictable.

**Key Characteristics:**
- Calm, organized information hierarchy with generous whitespace
- Subtle structural shadows that lift surfaces without shouting
- A teal-and-amber palette that feels fresh and warm, not trendy
- Consistent rounded corners (no mix of sharp and soft)
- Typography that prioritizes readability over flair

## 2. Colors

The palette is built around a professional teal primary and a warm amber secondary, grounded in a clean neutral scale that ranges from near-black ink to soft paper white.

### Primary
- **Deep Teal** (#3ab7bf): The main brand color. Used for primary buttons, active nav states, key links, and the logo mark. It conveys freshness and reliability without being aggressive.
- **Teal Hover** (#2fa3aa): A slightly deeper teal for hover and pressed states on primary elements. Ensures clear feedback without dramatic shifts.
- **Teal Muted** (#e6f7f8): A very light teal wash for backgrounds, badges, and subtle highlights. Used when the primary needs to whisper, not shout.

### Secondary
- **Warm Amber** (#ffc851): The accent color. Used sparingly for secondary buttons, warning states, highlighted metrics, and key callouts. Its warmth balances the coolness of the teal.
- **Amber Hover** (#e6b347): A deeper amber for hover states on secondary elements.
- **Amber Muted** (#fff8e6): A very light amber wash for subtle highlights, warning backgrounds, and chip backgrounds.

### Neutral
- **Ink** (#1a1a1a): Primary text color. Near-black with just enough warmth to avoid the harshness of pure #000.
- **Ink Secondary** (#4a4a4a): Secondary text — descriptions, metadata, captions.
- **Ink Muted** (#6b7280): Placeholder text, disabled states, timestamps. Must maintain 4.5:1 contrast against white surfaces.
- **Surface** (#f0f0f0): The app canvas — the background behind cards and the sidebar. Slightly warmer than pure gray to avoid a clinical feel.
- **Surface Raised** (#ffffff): Cards, modals, dropdowns, input backgrounds. Pure white for maximum contrast against the surface.
- **Border** (#e5e5e5): Subtle dividers, table borders, input borders at rest.
- **Border Strong** (#d4d4d4): Active or hovered borders, stronger dividers when needed.

### Semantic Colors
- **Success** (#16a34a): Paid invoices, completed tasks, positive stock levels.
- **Warning** (#ca8a04): Draft states, pending approvals, low-stock alerts.
- **Error** (#dc2626): Cancelled invoices, validation errors, deletion confirmations.
- **Info** (#2563eb): Validated states, informational badges, neutral alerts.

### Named Rules
**The Teal Discipline Rule.** The primary teal appears on no more than 10% of any given screen. Its rarity is the point. If teal is everywhere, it becomes wallpaper.

**The Amber Sentry Rule.** Amber is a signal, not a skin. It appears only when something needs attention: a warning, a highlighted metric, a secondary action that requires thought.

## 3. Typography

**Display Font:** Jost (system-ui fallback)
**Body Font:** Jost (system-ui fallback)

**Character:** Jost is a modern geometric sans-serif with a friendly, open feel. It carries the "clean" part of "The Clean Ledger" — precise letterforms, generous counters, and a range of weights that allow hierarchy without switching families. The geometric quality feels contemporary and professional; the slightly rounded terminals keep it approachable.

### Hierarchy
- **Display** (600, clamp(1.75rem, 4vw, 2.5rem), line-height 1.2, letter-spacing -0.02em): Page titles and hero headings. Used sparingly — typically once per page.
- **Headline** (600, 1.5rem, line-height 1.3, letter-spacing -0.01em): Section headings, card titles, modal headers.
- **Title** (500, 1.125rem, line-height 1.4): Sub-section headings, table column headers, list item titles.
- **Body** (400, 0.9375rem/15px, line-height 1.6): Paragraphs, descriptions, form labels. Max line length: 65ch for comfortable reading.
- **Label** (500, 0.8125rem/13px, line-height 1.4, letter-spacing 0.01em): Buttons, badges, nav items, form hints, table cell data. Uppercase is reserved for badges and short status labels only.

### Named Rules
**The One Family Rule.** Jost carries the entire typographic load. Hierarchy is created through weight and size contrast, not font switching. No secondary display font, no mono for labels, no serif for headlines.

**The 65ch Rule.** Body text never exceeds 65 characters per line. In wide containers, body copy is constrained with `max-width: 65ch` to maintain readability.

## 4. Elevation

The system uses subtle structural shadows to convey depth. Surfaces are flat at rest; shadows appear only as a response to state (hover, focus, elevation) or to separate distinct layers (cards on canvas, modals over content). The shadow vocabulary is tight and diffused — never sharp drop shadows.

### Shadow Vocabulary
- **Ambient** (`box-shadow: 0 1px 3px rgba(0,0,0,0.05)`): Default card and container shadow. Barely perceptible, just enough to lift white surfaces off the gray canvas.
- **Lifted** (`box-shadow: 0 4px 12px rgba(0,0,0,0.06)`): Hover states on cards, active dropdowns, focused inputs. A gentle lift that confirms interactivity.
- **Elevated** (`box-shadow: 0 8px 24px rgba(0,0,0,0.08)`): Modals, toasts, popover panels. Significant but still soft — the shadow is diffuse, not a hard edge.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. If an element has a shadow when nothing is happening, the shadow is too heavy. Shadows are a response, not a default.

**The No-999 Rule.** Never use arbitrary z-index values like 999 or 9999. The semantic z-index scale is: dropdown (10) → sticky header (20) → modal backdrop (30) → modal (40) → toast (50) → tooltip (60).

## 5. Components

### Buttons
- **Shape:** Gently rounded corners (10px / rounded-md)
- **Primary:** Deep Teal (#3ab7bf) background, white text, 10px 20px padding. Font: Label (500, 0.8125rem). Transition: background-color 200ms ease-out, transform 150ms ease-out.
- **Hover / Focus:** Background shifts to Teal Hover (#2fa3aa). On focus, a 2px ring in Teal Muted (#e6f7f8) appears outside the button. Active state: scale(0.98) for tactile feedback.
- **Secondary:** Warm Amber (#ffc851) background, Ink (#1a1a1a) text. Same padding and shape. Used for secondary actions that need prominence without being primary.
- **Ghost:** Transparent background, Ink text, Border (#e5e5e5) 1px stroke. Hover: Surface (#f0f0f0) background.

### Chips / Badges
- **Style:** Rounded-full (pill shape), 4px 10px padding. Font: Label (500, 0.8125rem).
- **Variants:**
  - Default: Teal Muted background, Teal Hover text.
  - Success: Light green background (#dcfce7), Success text.
  - Warning: Amber Muted background, Warning text.
  - Error: Light red background (#fee2e2), Error text.
  - Info: Light blue background (#dbeafe), Info text.

### Cards / Containers
- **Corner Style:** 16px radius (rounded-lg) — consistent across all cards, modals, and panels.
- **Background:** Surface Raised (#ffffff).
- **Shadow Strategy:** Ambient shadow at rest. Lifted shadow on hover for interactive cards.
- **Border:** No border by default. A 1px Border (#e5e5e5) stroke is used only when a card sits on a white background (rare) or for table containers.
- **Internal Padding:** 24px (lg spacing). Tightened to 16px for compact data cards.

### Inputs / Fields
- **Style:** Surface Raised background, 1px Border (#e5e5e5) stroke, 10px radius, 12px 16px padding. Font: Body (400, 0.9375rem).
- **Focus:** Border shifts to Primary (#3ab7bf), Lifted shadow appears, outline removed. The ring is achieved via border-color + shadow, not a separate outline ring.
- **Error:** Border shifts to Error (#dc2626), subtle Error background tint (#fef2f2).
- **Disabled:** Ink Muted text, Surface background, no border. Cursor: not-allowed.

### Navigation
- **Style:** Sidebar nav items are 12px 16px padded, 10px radius, full width. Font: Label (500, 0.8125rem).
- **Default:** Ink Muted text, transparent background. Icon size 22px, left-aligned with 16px gap to label.
- **Hover:** Surface Raised background, Ink text. Transition: all 150ms ease-out.
- **Active:** Surface Raised background, Ink text, Ambient shadow. The active state is clearly distinguished from hover by the shadow.
- **Logout/Danger:** Same shape, but hover turns text Error red. No red by default.

### Tables
- **Container:** Surface Raised background, 16px radius, Ambient shadow. Overflow hidden for rounded corners.
- **Header:** Surface (#f0f0f0) background, Ink Secondary text, uppercase Label font (0.75rem, 600 weight, 0.05em letter-spacing). No all-caps body copy.
- **Rows:** Divide with 1px Border (#e5e5e5). Hover: Surface (#f0f0f0) background tint.
- **Cells:** Body font (400, 0.9375rem). Amounts and numbers: Title font (500, 0.9375rem) for emphasis.

## 6. Do's and Don'ts

### Do:
- **Do** use the semantic z-index scale: dropdown (10) → sticky (20) → modal-backdrop (30) → modal (40) → toast (50) → tooltip (60).
- **Do** cap body line length at 65ch. Use `max-width: 65ch` on paragraph containers in wide layouts.
- **Do** use `text-wrap: balance` on h1–h3 headings for even line lengths.
- **Do** maintain 4.5:1 contrast for all body text against its background. Placeholder text must meet the same standard.
- **Do** use OKLCH for any new color explorations; the existing hex values approximate OKLCH teal and amber anchors.
- **Do** use Flexbox for 1D layouts and Grid for 2D layouts. Don't default to Grid when flex-wrap would be simpler.
- **Do** use `repeat(auto-fit, minmax(280px, 1fr))` for responsive grids without breakpoints.
- **Do** respect `prefers-reduced-motion: reduce` with instant or crossfade transitions instead of animated entrances.

### Don't:
- **Don't** use gradient text (`background-clip: text`). Use a single solid color for emphasis via weight or size.
- **Don't** use side-stripe borders (`border-left` or `border-right` greater than 1px) as colored accents on cards or alerts. Rewrite with full borders, background tints, or leading icons.
- **Don't** use glassmorphism or decorative blurs. If backdrop-filter is used, it must serve a specific functional purpose.
- **Don't** use the hero-metric template (big number, small label, gradient accent). SaaS cliché.
- **Don't** create identical card grids with icon + heading + text repeated endlessly. Vary the layout and content density.
- **Don't** put tiny uppercase tracked eyebrows above every section. One deliberate kicker as a brand system is voice; an eyebrow on every section is AI grammar.
- **Don't** use numbered section markers (01 / 02 / 03) as default scaffolding unless the section is actually a sequence.
- **Don't** use all-caps for body copy. Reserve uppercase for short labels (≤4 words), badges, and section kickers used sparingly.
- **Don't** look like a generic Bootstrap/admin template. Avoid stock DataTables styling, default Bootstrap colors, and predictable admin-panel layouts.
- **Don't** exceed 3 font families. This system uses one: Jost.
