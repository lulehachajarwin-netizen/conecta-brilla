---
name: Serene Vitality
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#3c4a42'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#6c7a71'
  outline-variant: '#bbcabf'
  surface-tint: '#006c49'
  primary: '#006c49'
  on-primary: '#ffffff'
  primary-container: '#10b981'
  on-primary-container: '#00422b'
  inverse-primary: '#4edea3'
  secondary: '#006398'
  on-secondary: '#ffffff'
  secondary-container: '#5bb8fe'
  on-secondary-container: '#00476e'
  tertiary: '#855300'
  on-tertiary: '#ffffff'
  tertiary-container: '#e29100'
  on-tertiary-container: '#523200'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#6ffbbe'
  primary-fixed-dim: '#4edea3'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#005236'
  secondary-fixed: '#cce5ff'
  secondary-fixed-dim: '#93ccff'
  on-secondary-fixed: '#001d31'
  on-secondary-fixed-variant: '#004b73'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1.25rem
  margin-desktop: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.25rem
---

## Brand & Style

The design system establishes an environment of sanctuary, mindful productivity, and gentle optimism for workplace well-being. Balancing calm with restorative vitality, the visual identity mitigates cognitive fatigue and workplace stress through airy layouts, soft biological hues, and friendly geometry.

### Style Movement
A hybrid of **Modern Soft Minimalism** and **Tactile Glassmorphism**:
- Generous breathing room (macro-whitespace) prioritizing calm over density.
- Organic, pill-like contours with pillowy roundedness (`rounded-2xl` to `rounded-3xl`).
- Ultra-diffuse ambient shadows and soft-tinted surfaces that feel lightweight, tactile, and non-intrusive.
- Tactile, gentle micro-interactions that respond with damp spring physics rather than mechanical snaps.

## Colors

The palette is engineered to promote emotional regulation and mental decluttering, balancing pastel soothing tones with high-contrast functional anchors for WCAG AA compliance.

### Role Assignments
- **Primary (`#10B981` / Mint Vitality)**: Signifies emotional reset, natural balance, and healthy progression. Paired with soft tint `#A7F3D0` for ambient containers and highlights.
- **Secondary (`#0284C7` / Restorative Sky)**: Used for reflective exercises, focus flows, and trusted system statuses. Supported by `#BAE6FD` for informational backdrops.
- **Tertiary (`#F59E0B` / Sun Warmth)**: Inspires joy, streaks, celebration, and gratitude badges. Complemented by `#FEF08A` for high-delight micro-moments.
- **Neutral Canvas (`#F8FAFC` to `#F1F5F9`)**: Warm pearlescent and soft slate backgrounds prevent the clinical glare of pure `#FFFFFF` while maintaining crisp visual layering.
- **Typography & Structural Contrast (`#0F172A` to `#334155`)**: Deep slate ensures effortless readability and visual balance across cards and forms.

## Typography

**Plus Jakarta Sans** provides geometric openness with humanist curves, delivering optimal legibility and an approachable tone.

### Application Rules
- **Display & Headlines**: Generous line height and subtle negative tracking (`-0.01em` to `-0.02em`) reduce visual tension on prominent title cards and greeting moments.
- **Body Content**: Set at a generous `lineHeight: 26px` for `body-lg` to create a rhythmic, spacious reading cadence that facilitates relaxation.
- **Labels & Microcopy**: Formatted in medium and semi-bold weights for rapid scanning without aggressive emphasis. Uppercase treatments are restricted to `label-sm` badges and category flags.

## Layout & Spacing

The layout employs an open, responsive fluid grid framework calibrated primarily for handheld mobile workflows and scalable to tablet/desktop dashboards.

### Layout Mechanics
- **Mobile Handheld (360px - 599px)**: 4 columns, `margin: 1.25rem`, `gutter: 1rem`. Bottom navigation persistent bar with dynamic top safe-area inset.
- **Tablet / Large Handheld (600px - 1023px)**: 8 columns, `margin: 2rem`, `gutter: 1.25rem`. Content cards switch to modular 2-up grids.
- **Desktop / Portal View (1024px+)**: 12 columns, max-width container capped at `1200px`, `margin-desktop: 2.5rem`, `gutter-desktop: 1.5rem`.

### Spatial Rhythm
- Apply `space-lg` and `space-xl` internally across cards to enforce the "unhurried breathing" experience.
- Maintain a minimum of `space-md` between discrete interactive blocks.

## Elevation & Depth

Visual depth is achieved through translucent planes and colored ambient shadows rather than harsh drop-shadows.

### Layering Model
1. **Base Layer (Canvas)**: `#F8FAFC` base surface layered with soft, radial ambient blobs (`#A7F3D0` at 12% opacity, `#BAE6FD` at 15% opacity) to provide atmospheric warmth.
2. **Surface Level 1 (Resting Cards)**: Pure white `#FFFFFF` at 90% opacity with `backdrop-filter: blur(12px)` and a whisper-thin outline (`border: 1px solid rgba(255, 255, 255, 0.8)`).
   - **Shadow**: `0 8px 30px -4px rgba(148, 163, 184, 0.12), 0 2px 8px -1px rgba(16, 185, 129, 0.04)`.
3. **Surface Level 2 (Floating Sheets & Modals)**: Solid `#FFFFFF`, elevated with `0 20px 40px -8px rgba(15, 23, 42, 0.08)`.
4. **Surface Level 3 (Active Popovers & Snackbars)**: Layered with a distinct mint or sky ambient aura: `0 12px 28px -4px rgba(2, 132, 199, 0.15)`.

## Shapes

The design system adopts a Pill-Shaped and High-Curvature aesthetic (`roundedness: 3`) to eliminate aggressive angles, reinforcing physical comfort and psychological safety.

### Corner Radii Guidelines
- **Primary Cards & Containers**: `rounded-2xl` (1.5rem) to `rounded-3xl` (2rem).
- **Buttons, Chips, Text Inputs**: Pill geometry (`rounded-full` / 9999px) for single-line interactive elements.
- **Nested Progress Trackers**: Outer tracks conform to `rounded-full` with interior fluid fill matching curvature.
- **Floating Overlays & Bottom Sheets**: Top edges set to `2rem` border radius with smooth curve continuity.

## Components

### Buttons
- **Primary Button**: Pill-shaped (`rounded-full`), height `48px` (touch-target compliant). Background `#10B981` with white bold typography. Hover/Active triggers a scale transformation `scale-[0.98]` with a gentle emerald glow.
- **Secondary Button**: Background `#BAE6FD` with `#0284C7` text, no heavy borders.
- **Tertiary / Uplift Button**: Warm accent `#FEF08A` background with `#B45309` typography for celebratory action items (e.g., "Enviar Agradecimiento").

### Chips & Badges
- Filter and emotion tags are pill-shaped with `height: 36px`, padded with `space-sm` vertically and `space-md` horizontally.
- Inactive state: `#F1F5F9` with slate text. Active state: Pastels (`#A7F3D0` or `#BAE6FD`) paired with deep colored icons.

### Cards
- Resting cards use `#FFFFFF` with `rounded-3xl` (24px to 32px), `space-lg` (24px) internal padding, and delicate ambient shadows.
- Dedicated card types:
  - *Mood Tracker Card*: Large smiling iconography with pastel gradient fills and fluid radio selections.
  - *Reflective Breathing Card*: Mint-tinted backdrop (`#ECFDF5`) containing a pulsating circular breathing guide.

### Form Inputs
- Single-line inputs are styled as full pills (`rounded-full`), height `52px`, bordered with `rgba(203, 213, 225, 0.6)`.
- Focus state softens the border to `#10B981` while generating a diffuse 4px outer ring (`rgba(16, 185, 129, 0.15)`).

### Selection Controls (Checkboxes & Radios)
- **Checkboxes**: Smooth rounded corners (`rounded-lg`), turning into `#10B981` upon selection with an animated white checkmark.
- **Radio Buttons**: Concentric circles featuring a gentle inward pop transition when selected.

### Well-being Specific Components
- **Daily Streak & Energy Spark**: Sun-yellow accent (`#FEF08A` surface, `#F59E0B` icon) encapsulated inside a compact tactile pill.
- **Mindful Bottom Sheet**: Soft-drag sheet surfaced at `rounded-t-[32px]` containing soothing guided check-in journeys.