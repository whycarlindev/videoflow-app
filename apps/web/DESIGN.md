---
name: Cinematic Flow
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#ccc3d8'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#958da1'
  outline-variant: '#4a4455'
  surface-tint: '#d2bbff'
  primary: '#d2bbff'
  on-primary: '#3f008e'
  primary-container: '#7c3aed'
  on-primary-container: '#ede0ff'
  inverse-primary: '#732ee4'
  secondary: '#c6c6c7'
  on-secondary: '#2f3131'
  secondary-container: '#454747'
  on-secondary-container: '#b4b5b5'
  tertiary: '#c8c6c5'
  on-tertiary: '#313030'
  tertiary-container: '#676666'
  on-tertiary-container: '#e7e5e4'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#eaddff'
  primary-fixed-dim: '#d2bbff'
  on-primary-fixed: '#25005a'
  on-primary-fixed-variant: '#5a00c6'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#e5e2e1'
  tertiary-fixed-dim: '#c8c6c5'
  on-tertiary-fixed: '#1c1b1b'
  on-tertiary-fixed-variant: '#474746'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  title-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-bold:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  container-max: 1440px
  gutter: 20px
---

## Brand & Style

The design system is engineered for a high-performance video streaming environment. It prioritizes content immersion by utilizing a "Lights Out" philosophy—minimizing UI interference through deep blacks and high-contrast accents. The aesthetic is **Modern/Corporate with a High-Contrast edge**, blending the reliability of professional software with the energy of live entertainment.

The target audience ranges from casual viewers to professional content creators. The UI should feel fast, responsive, and premium. Key brand pillars include:
- **Immersive Clarity:** Content is hero; UI elements are supportive.
- **Electric Precision:** Vibrant accents guide the eye to primary actions.
- **Structured Depth:** Clear logical grouping using tonal layering rather than heavy decoration.

## Colors

The palette is anchored in a deep-black base to maximize the dynamic range of video content. 

- **Base Background:** Use `#0f0f0f` for the main application canvas.
- **Surface/Elevated:** Use `#1a1a1a` for cards, sidebars, and navigation headers to create subtle separation.
- **Accent (Vibrant Purple):** Reserved for primary calls-to-action, active states, and progress indicators.
- **Typography:** Primary text should be pure white (`#ffffff`) for maximum legibility, with secondary text in a muted grey (`#a3a3a3`).
- **Status:** Functional colors are high-chroma to ensure they remain visible against dark backgrounds. Use Yellow for Drafts and Green for Published status.

## Typography

This design system utilizes **Inter** for its exceptional legibility on digital displays and its neutral, systematic character. 

- **Scale:** A tight typographic scale ensures hierarchy without overwhelming the screen.
- **Contrast:** Use font-weight to differentiate between titles and metadata. 
- **Display Styles:** Large display headers should use tighter letter spacing and heavy weights (Bold/ExtraBold) to mimic cinematic poster styling.
- **Body Text:** Standardize on 16px for primary descriptions and 14px for metadata (view counts, timestamps) to maintain a dense but readable information density.

## Layout & Spacing

The layout follows a **Fluid Grid** model with strict 12-column alignment for desktop, scaling down to 4 columns for mobile.

- **Rhythm:** An 8px linear scale (with a 4px half-step for tight components) governs all padding and margins.
- **Desktop:** 12 columns, 24px margins, 20px gutters.
- **Tablet:** 8 columns, 20px margins, 16px gutters.
- **Mobile:** 4 columns, 16px margins, 12px gutters.
- **Content Density:** In video grids, prioritize a "Comfortable" density where thumbnails have ample room to breathe, using the `lg` (24px) spacing unit between card groups.

## Elevation & Depth

This design system eschews heavy shadows in favor of **Tonal Layering** and **Ghost Outlines**.

- **Level 0 (Base):** `#0f0f0f` - The lowest floor.
- **Level 1 (Surface):** `#1a1a1a` - Used for cards and persistent sidebars.
- **Level 2 (Overlay):** `#262626` - Used for hover states on cards or subtle button backgrounds.
- **Accents:** Use a 1px solid border of `#333333` on all Level 1 surfaces to provide crisp definition against the base background.
- **Modals:** For high-level interruptions, use a 40% blur backdrop-filter behind the surface to maintain context while focusing the user.

## Shapes

The design system uses a **Rounded** shape language to soften the high-contrast aesthetic, making the professional environment feel approachable.

- **Standard (8px):** Buttons, input fields, and small thumbnails.
- **Large (12px):** Video player containers, featured hero cards, and modal windows.
- **Full (Pill):** Search bars and "Category" chips to distinguish them from actionable buttons.

## Components

### Buttons
- **Primary:** Background `#7c3aed`, Text `#ffffff`, 8px radius.
- **Secondary:** Background transparent, Border 1px `#333333`, Hover background `#262626`.
- **Ghost:** No border, Purple text, used for low-priority actions.

### Cards (Video Thumbnails)
- Surface background `#1a1a1a` with 12px radius.
- Thumbnail images should have a subtle 1px inner stroke to prevent them from bleeding into the background.
- Hover state: Slight scale-up (1.02x) and border color change to `#7c3aed`.

### Inputs & Search
- Dark grey fills (`#1a1a1a`) with a focus-state border color of `#7c3aed`.
- Search bars use the "Pill" shape (999px radius) to differentiate from content cards.

### Chips & Tags
- Used for categories (e.g., "Gaming", "Music"). 
- Default state: Background `#262626`.
- Active state: Background `#7c3aed`, Text `#ffffff`.

### Status Badges
- Small, uppercase labels using the `label-bold` type style.
- Backgrounds use a 15% opacity tint of the status color with a 100% opacity solid text color for high legibility.