---
name: Proxio Solutions
description: Software studio site. Technical clarity with a warm, responsive touch.
colors:
  signal-blue: '#2563eb'
  signal-blue-deep: '#1d4ed8'
  signal-wash: '#eff6ff'
  ink: '#0f172a'
  slate-muted: '#64748b'
  paper: '#ffffff'
  mist: '#f8fafc'
  hairline: '#e2e8f0'
  night-panel: '#0b1120'
typography:
  display:
    fontFamily: "'Plus Jakarta Sans Variable', sans-serif"
    fontSize: '4.5rem'
    fontWeight: 800
    lineHeight: 1.08
    letterSpacing: '-0.025em'
  headline:
    fontFamily: "'Plus Jakarta Sans Variable', sans-serif"
    fontSize: '3rem'
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: '-0.025em'
  title:
    fontFamily: "'Plus Jakarta Sans Variable', sans-serif"
    fontSize: '1.25rem'
    fontWeight: 700
    lineHeight: 1.4
  body:
    fontFamily: "'Plus Jakarta Sans Variable', sans-serif"
    fontSize: '1.125rem'
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "'JetBrains Mono', ui-monospace, monospace"
    fontSize: '0.75rem'
    fontWeight: 500
    letterSpacing: '0.2em'
rounded:
  md: '6px'
  lg: '8px'
  xl: '12px'
  2xl: '16px'
  3xl: '24px'
  full: '9999px'
spacing:
  gutter-sm: '16px'
  gutter-md: '24px'
  gutter-lg: '32px'
  card: '24px'
  card-lg: '48px'
  section: '96px'
components:
  button-primary:
    backgroundColor: '{colors.signal-blue}'
    textColor: '{colors.paper}'
    rounded: '{rounded.lg}'
    padding: '14px 32px'
  button-primary-hover:
    backgroundColor: '{colors.signal-blue-deep}'
    textColor: '{colors.paper}'
  button-secondary:
    backgroundColor: '{colors.paper}'
    textColor: '{colors.ink}'
    rounded: '{rounded.lg}'
    padding: '14px 32px'
  input:
    backgroundColor: '{colors.paper}'
    textColor: '{colors.ink}'
    rounded: '{rounded.lg}'
    padding: '12px 16px'
  choice:
    backgroundColor: '{colors.paper}'
    textColor: '{colors.ink}'
    rounded: '{rounded.xl}'
    padding: '10px 16px'
  choice-selected:
    backgroundColor: '{colors.signal-wash}'
    textColor: '{colors.ink}'
  card:
    backgroundColor: '{colors.paper}'
    textColor: '{colors.ink}'
    rounded: '{rounded.2xl}'
    padding: '{spacing.card}'
  feature-card:
    backgroundColor: '{colors.mist}'
    textColor: '{colors.ink}'
    rounded: '{rounded.3xl}'
    padding: '{spacing.card-lg}'
  cta-panel:
    backgroundColor: '{colors.night-panel}'
    textColor: '{colors.paper}'
    rounded: '{rounded.3xl}'
    padding: '80px 48px'
  section-label:
    textColor: '{colors.signal-blue}'
    typography: '{typography.label}'
---

# Design System: Proxio Solutions

## Overview

**Creative North Star: "Clarity with Warmth"**

The site has a technical spine and warm skin:

- **Structure is engineered.** A disciplined grid, generous white space, and mono section labels
  that read like code comments (`// 01 — O Que Fazemos`).
- **The surface is warm and responsive.** Cards lift when you reach for them, a soft blue light
  follows the pointer, buttons lean towards the cursor, and content rises into view as you
  scroll. The site should feel like a studio that answers back, which is what proximity looks
  like on screen.

Light, airy and confident:

- **Colour:** white and near-white surfaces, deep slate ink, and one saturated blue that carries
  every action and highlight.
- **Contrast:** a single dark panel (the closing CTA) gives each page its moment of contrast.
- **Motion:** lively and tactile by choice. It is always tied to an element's entrance, a state
  or the pointer, and every movement respects `prefers-reduced-motion`.

It must never look like a corporate consultancy (stock photography, rigid navy, cold distance) or
a generic SaaS template (purple gradients, 3D icon packs, interchangeable sections).

**Key Characteristics:**

- One accent: signal blue on white, slate for everything quiet.
- Mono labels and `//` markers as the technical signature.
- Large, extra-bold, tightly tracked headlines.
- Rounded, bordered surfaces that respond to the pointer.
- Motion everywhere, with purpose, and fully reduced when asked.

## Colors

A cool, light palette: near-white layers, slate neutrals and a single electric blue.

### Primary

- **Signal Blue** (#2563eb): every primary action (filled buttons, nav CTA), section labels,
  active nav underline, focus lines, selected choices, progress bars, hover tints and the
  pointer-following glow (at 9–25% alpha). It is also the text selection colour.
- **Signal Blue Deep** (#1d4ed8): hover state of filled buttons only.
- **Signal Wash** (#eff6ff): background of a selected choice card or pill in forms.

### Neutral

- **Ink** (#0f172a): headlines, body emphasis, primary text. Also the base of the hero grid
  lines (at 5% alpha).
- **Slate Muted** (#64748b): body copy, descriptions, secondary labels, inactive navigation.
- **Paper** (#ffffff): page background and card surfaces. The token is named
  `--color-proxio-darker` in code, a legacy of an earlier dark theme.
- **Mist** (#f8fafc): alternating section bands, inner panels, feature cards and the form shell.
  The token is named `--color-proxio-dark` in code.
- **Hairline** (#e2e8f0): every border and divider (`--color-proxio-dark-border`).
- **Night Panel** (#0b1120): the closing CTA panel, the one dark surface on a page, with white
  text and white at 60% for its subtitle.

### Named Rules

**The One Signal Rule.** Blue is the only hue with meaning. Actions, focus, selection and progress
are blue; everything else is slate on white. Don't introduce a second accent colour for emphasis.

**The Legacy Names Rule.** In code, `proxio-darker` is white and `proxio-dark` is the light grey
band. Use the tokens as they are and don't add raw hex values for the same colours.

## Typography

**Display Font:** Plus Jakarta Sans Variable (with sans-serif), self-hosted
**Body Font:** Plus Jakarta Sans Variable
**Label/Mono Font:** JetBrains Mono (400, 500, with ui-monospace)

**Character:** A geometric, friendly sans pushed to extra-bold for headlines, paired with a
developer mono for small labels. The sans carries the warmth; the mono carries the engineering.

### Hierarchy

- **Display** (800, 2.25rem on phones up to 4.5rem on large screens, line-height 1.08, tight
  tracking): the hero headline on each page. A keyword may get a hand-drawn blue underline.
- **Headline** (800, 1.875rem on phones, 3rem from `sm`, tight tracking): section titles. The
  words rise into view one by one.
- **Title** (700, 1.25rem): card and service titles, and form step headings (1.25–1.5rem, 800).
- **Body** (400, 1.125rem for lead paragraphs, 1rem in cards, line-height 1.625, slate muted):
  keep lead paragraphs within about 36rem (`max-w-xl`) to `max-w-3xl`.
- **Label** (JetBrains Mono 500, 0.75rem, letter-spacing 0.2em, uppercase, signal blue): section
  eyebrows in the form `// 01 — Label`, with the `//` and number at 60% opacity. Mono at
  0.75rem without tracking also marks step counts, indices (`[03]`, `01`) and technical tags.

### Named Rules

**The Comment Marker Rule.** Section eyebrows are mono, uppercase, tracked and prefixed with `//`
and a two-digit index. Indices count the visible sections in order; when a section is hidden,
renumber the rest.

**The Extra-Bold Headline Rule.** Headlines are 800 weight with tight tracking. Don't set a
headline in regular or light weight.

## Layout

- **Container:** centred, at most 1280px (`max-w-7xl`), with side gutters of 16px, 24px from
  `sm` and 32px from `lg`.
- **Sections:** stacked full-width bands with 96px of vertical padding, alternating Paper and Mist
  and separated by Hairline borders.
- **Grids:**
  - services use three equal columns from `md` and stack below;
  - the contact page uses a 2:1 split (form, then summary and contact cards) from `lg`;
  - feature cards split 3:2 (content, then visual) from `md`.
- **Breakpoints:** Tailwind defaults (`sm` 640, `md` 768, `lg` 1024, `xl` 1280).
- **Density:** generous; cards breathe with 24–48px padding.
- **Pinned scroll sections:** only where a story unfolds step by step (the hidden Urbi showcase),
  never for plain content.
- **Phones:** primary actions go full width. The contact form's navigation sticks to the bottom
  of the screen.

## Elevation & Depth

Mostly flat and bordered at rest. Depth comes from three things:

- **Tonal layering:** Paper over Mist, with Hairline borders.
- **Soft blue-tinted shadows** that appear in response to interaction.
- **The dark CTA panel** as the single high-contrast plane.

The sticky navbar gains a blurred, translucent background and a faint shadow once the page
scrolls.

### Shadow Vocabulary

- **Lift** (`box-shadow: 0 16px 40px -16px rgb(37 99 235 / 0.18)`): a card on hover, together
  with `translateY(-4px)` and a border tinted towards blue.
- **Action glow** (`shadow-lg` tinted `rgb(37 99 235 / 0.2–0.3)`): under filled primary buttons.
- **Nav scrolled** (`0 8px 30px -12px rgb(15 23 42 / 0.12)`): the navbar once scrolled.
- **Active node ring** (`0 0 0 6px rgb(37 99 235 / 0.15)`): a process timeline node when reached.

### Named Rules

**The Earned Shadow Rule.** Surfaces are flat at rest. A shadow appears only as the answer to
hover, scroll or progress, and it is tinted blue or ink, never neutral black.

## Shapes

Softly rounded throughout, with radius growing with surface size:

- 6px for the compact nav CTA;
- 8px for buttons and inputs;
- 12px for choice cards and inner panels;
- 16px for service cards;
- 24px for feature cards, the form shell and the CTA panel;
- full pills for badges and status chips.

Every surface has a 1px Hairline border. Decorative backdrops are a faint 44px grid or a dot
pattern, fading radially, behind heroes and the CTA.

## Components

### Buttons

Confident and tactile.

- **Shape:** gently rounded (8px).
- **Primary:** Signal Blue fill, white bold text (14–16px), 14px × 32px padding, with a blue-tinted
  shadow. On hover it shifts to Signal Blue Deep, and a trailing arrow slides 4px right. On fine
  pointers, primary CTAs are magnetic: they lean slightly towards the cursor.
- **Secondary:** Paper (70% alpha) with a Hairline border and Ink text. On hover the border and
  text turn Signal Blue.
- **Text link CTA:** bold Signal Blue text with an arrow ("Saber mais →").

### Chips and Choices

- **Choice card or pill:** Paper with a Hairline border, 12px radius. Selected adds a Signal Blue
  border, a 1px blue ring and a Signal Wash fill. Multi-select pills swap their icon for a blue
  check.
- **Status badge:** a full pill with a Hairline border, mono or medium 12px text, and a pinging
  blue dot for "live" states.

### Cards / Containers

- **Corner Style:** 16px for service cards, 24px for feature cards and panels.
- **Background:** Paper on Mist bands, or Mist on Paper.
- **Shadow Strategy:** none at rest; Lift on hover (see Elevation).
- **Border:** 1px Hairline, tinting towards blue on hover.
- **Internal Padding:** 24px standard, 32–48px for feature cards.
- **Spotlight variant:** a 420px radial blue glow (9% alpha) follows the pointer inside the card.

### Inputs / Fields

- **Style:** Paper fill, 1px Hairline border, 8px radius, 12px × 16px padding, 14px text with a
  70% slate placeholder. Hover darkens the border to slate-300.
- **Focus:** the border tints towards blue at 40%, and in the contact form a 2px Signal Blue line
  draws under the focused field.
- **Error:** a 12px medium message in red-600 under the field, linked with `aria-describedby`.
  The field still accepts input.
- **Valid hint:** a 12px slate line with a blue check that echoes how the input was read (for
  example "Lemos: 10 000 € – 20 000 €").

### Navigation

- **Bar:** sticky, 64px tall, logo on the left, links in the centre, CTA and language switch on
  the right.
- **Scrolling:** hides on scroll down and returns on scroll up. Once scrolled it gains Mist at 95%
  with a Hairline border and the scrolled shadow.
- **Reading progress:** a 2px Signal Blue bar along its bottom edge.
- **Links:** 14px medium Ink. Hover and active turn Signal Blue, with a 2px underline that grows
  from the left.
- **Language switch:** mono uppercase `EN`/`PT`.
- **Mobile:** a drawer with numbered links (`01`, `02` in mono) that stagger in, a full-width CTA
  and a bordered language button.

### Section Label (signature)

`// 01 — LABEL` in JetBrains Mono, 12px, 0.2em tracking, uppercase, Signal Blue, with the prefix
at 60% opacity. It opens every section and is the clearest expression of the North Star.

### CTA Panel (signature)

A 24px-rounded Night Panel closing each page:

- a dot grid fading at the edges and a blue radial glow from the top;
- a white extra-bold headline and a white-60% subtitle;
- a primary button with a stronger glow.

## Do's and Don'ts

### Do:

- **Do** keep Signal Blue (#2563eb) as the only accent: actions, focus, selection, progress.
- **Do** open sections with the mono `// NN — Label` eyebrow, numbered in visible order.
- **Do** set headlines in Plus Jakarta Sans 800 with tight tracking, and body text in slate muted.
- **Do** make surfaces respond: Lift on card hover (`translateY(-4px)` plus a blue-tinted shadow),
  arrow nudges on CTAs, the magnetic pull on primary buttons for fine pointers.
- **Do** pull every timing from the shared motion tokens (`src/lib/gsap.ts`), and give every
  animation a reduced-motion fallback that shows the final state.
- **Do** use the existing tokens (`proxio-*`) instead of raw hex values.

### Don't:

- **Don't** drift towards a corporate consultancy look: no stock photography, no rigid navy
  palettes, no cold, distant layouts.
- **Don't** fall into a generic SaaS template: no purple or rainbow gradients, no 3D icon packs, no
  interchangeable hero-features-pricing sections.
- **Don't** add a second accent hue or neutral black shadows.
- **Don't** add motion that loops for decoration on content areas. Idle loops are reserved for
  small illustrative accents (the orbit, the float).
- **Don't** fill space with invented proof such as testimonials, client logos or metrics (see
  PRODUCT.md): an honest, shorter page beats a padded one.
