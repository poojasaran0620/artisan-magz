# Artisan Magz — Luxury Gifting Studio Design System

A warm, romantic, pastel luxury e-commerce design system for a personalized gifting studio. The aesthetic is boutique editorial meets cozy celebration — soft cream backgrounds, rose-gold accents, elegant serif headings, and clean modern body text. Mobile-first (90%+ traffic from Instagram bio links). Built with React + Tailwind CSS + Framer Motion.

---

## Design Principles

1. **Luxury Without Distance** — Premium feel that still feels personal and approachable. Never cold or sterile.
2. **Editorial Polish** — Every page should feel like opening a high-end magazine. Generous whitespace, intentional typography hierarchy.
3. **Celebration-First** — The UI celebrates the customer's milestones. Warm tones, gentle animations, joyful micro-interactions.
4. **Mobile-Native** — Design for thumbs first. Sticky CTAs, bottom-sheet drawers, swipe-friendly carousels.
5. **Consistency Over Cleverness** — Use the defined system. No one-off fonts, no rogue colors. Every element earns its place.

---

## Colors

### Primary Palette

| Token | Hex | Role |
|---|---|---|
| **Rose Gold** (Primary Brand Accent) | `#B76E79` | Primary buttons, active states, brand highlights, badges |
| **Rose Gold Light** | `#E8CCD1` | Hover states, scrollbar thumb, decorative borders |
| **Rose Gold Dark** | `#8C4D56` | Pressed states, dark accent variant |
| **Charcoal** (Primary Text) | `#333333` | All body text, headings, primary typography |
| **Charcoal Light** | `#4A4A4A` | Secondary text, captions |
| **Charcoal Dark** | `#1F1F1F` | Emphasized text, footer backgrounds |

### Cream / Background Scale

| Token | Hex | Role |
|---|---|---|
| **Cream 50** | `#FDFCF5` | Page background (base) |
| **Cream 100** | `#F9F7EC` | Elevated surface background, card hover |
| **Cream 200** | `#F2EEDB` | Input backgrounds, divider lines |
| **Cream 300** | `#E6DFCA` | Disabled backgrounds, muted borders |
| **Cream 400** | `#D4C9B0` | Placeholder text, inactive icons |
| **Cream 500** | `#B8AB8F` | Muted labels |
| **Cream 600–900** | `#9C8E73` → `#3A3327` | Dark mode scale (reserved) |

### Blush / Highlight Scale

| Token | Hex | Role |
|---|---|---|
| **Blush 50** | `#FFF7F9` | Subtle highlight background |
| **Blush 100** | `#FFDBE5` | Selection highlight, soft badges, notification dots |
| **Blush 200–400** | `#F7C4D0` → `#D97C90` | Progressive accent intensity |
| **Blush 500** | `#B76E79` | Equivalent to Rose Gold primary |
| **Blush 600–900** | `#9E5862` → `#4D2026` | Dark accent scale |

### Supporting Accents

| Token | Hex | Role |
|---|---|---|
| **Sage** | `#98C0A9` | Success states, botanical accents, "in stock" badges |
| **Sage 100** | `#E4F0E9` | Success background |
| **Taupe** | `#A69480` | Muted supporting tone, secondary borders, subtle grain overlay |
| **Taupe 100** | `#F2EFEA` | Neutral card surface, shimmer animation base |

### Semantic Colors

- **Success**: Sage `#98C0A9` on Sage 100 `#E4F0E9`
- **Warning**: `#F59E0B` on `#FFFBEB`
- **Error / Destructive**: `#EF4444` on `#FEF2F2`
- **Info**: Blush 500 `#B76E79` on Blush 50 `#FFF7F9`
- **Selection**: Blush 100 `#FFDBE5` background with Charcoal `#333333` text
- **Theme Color** (mobile browser chrome): `#FDFCF5`

---

## Typography

### Font Stack

Three font families only. No exceptions.

| Role | Family | Weights | Tailwind Class |
|---|---|---|---|
| **Editorial Serif** | [Cormorant Garamond](https://fonts.google.com/specimen/Cormorant+Garamond) | 400, 500, 600, 700 (roman + italic) | `font-serif` |
| **Modern Interface** | [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) | 300, 400, 500, 600, 700 | `font-sans` |
| **Precision Monospace** | [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) | 400, 500, 600 | `font-mono` |

### Typography Roles

| Element | Font | Size | Weight | Notes |
|---|---|---|---|---|
| **Hero / Page Title** | Cormorant Garamond | 36–48px (`text-4xl`–`text-5xl`) | 700 (Bold) | Tight letter-spacing `-0.02em` |
| **Section Heading (H2)** | Cormorant Garamond | 28–32px (`text-3xl`) | 600 (SemiBold) | |
| **Card Title (H3)** | Cormorant Garamond | 22–24px (`text-xl`–`text-2xl`) | 600 | |
| **Subheading (H4)** | Cormorant Garamond | 18–20px (`text-lg`–`text-xl`) | 500 | |
| **Body Text** | Plus Jakarta Sans | 14–16px (`text-sm`–`text-base`) | 400 | Line-height 1.6–1.75 |
| **UI Labels / Nav** | Plus Jakarta Sans | 13–14px (`text-xs`–`text-sm`) | 500–600 | Uppercase tracking `tracking-wider` for nav |
| **Button Text** | Plus Jakarta Sans | 14–15px (`text-sm`) | 600 | |
| **Captions / Meta** | Plus Jakarta Sans | 12px (`text-xs`) | 400–500 | Color: Charcoal Light `#4A4A4A` |
| **Prices & Numbers** | Plus Jakarta Sans | varies | 600–700 | Always use `tabular-nums` for alignment |
| **Romantic Accents** | Cormorant Garamond *Italic* | varies | 400–500 | Dedication cards, love notes, quotes, founder stories |
| **Order IDs / Codes** | JetBrains Mono | 12–13px (`text-xs`–`text-sm`) | 500 | Order numbers, payment hashes, coupon codes |
| **Phone Inputs** | JetBrains Mono | 14px (`text-sm`) | 400 | Numeric input clarity |

### Typography Rules

- **Headings** (`h1`–`h4` and `.font-serif`) automatically use Cormorant Garamond via base CSS layer.
- **Body** defaults to Plus Jakarta Sans on the `<body>` element.
- **Never use** Caveat, Playfair Display, Allura, Alex Brush, Courier Prime, or any font outside the three approved families.
- **Newspaper Card** headings use `.newspaper-font-headline` (Cormorant Garamond, `letter-spacing: -0.02em`).
- **Newspaper Card** body uses `.newspaper-font-body` (Plus Jakarta Sans).

---

## Spacing

### Base Unit

`4px` (Tailwind default). All spacing derives from this base.

### Scale

| Token | Value | Common Use |
|---|---|---|
| `p-1` / `gap-1` | 4px | Tight icon gaps |
| `p-2` / `gap-2` | 8px | Inline element spacing, badge padding |
| `p-3` / `gap-3` | 12px | Compact card padding, list item gaps |
| `p-4` / `gap-4` | 16px | Standard card padding, form field spacing |
| `p-6` / `gap-6` | 24px | Section inner padding, card body |
| `p-8` / `gap-8` | 32px | Section vertical spacing |
| `py-12` / `gap-12` | 48px | Major section gaps |
| `py-16` / `gap-16` | 64px | Page section separators |
| `py-20` | 80px | Hero section top/bottom padding |

### Layout

- **Max content width**: `max-w-7xl` (1280px) centered with `mx-auto`
- **Page horizontal padding**: `px-4` mobile, `px-6` tablet, `px-8` desktop
- **Card grid**: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` with `gap-6`
- **Mobile bottom safe area**: 80px clearance for sticky CTAs

---

## Components

### Buttons

#### Primary Button
```
bg-blush-500 hover:bg-blush-600 active:bg-blush-700
text-white font-sans font-semibold text-sm
rounded-full px-8 py-3
shadow-soft hover:shadow-soft-lg
transition-all duration-300
```
- Always `rounded-full` (pill shape) for primary actions
- Minimum touch target: 44px height on mobile

#### Secondary / Outline Button
```
border-2 border-blush-500 text-blush-500
hover:bg-blush-500 hover:text-white
rounded-full px-6 py-2.5
transition-all duration-300
```

#### Ghost Button
```
text-charcoal hover:text-blush-500
font-sans font-medium text-sm
transition-colors duration-200
```

#### WhatsApp CTA
```
bg-[#25D366] hover:bg-[#128C7E] text-white
rounded-full px-6 py-3
flex items-center gap-2
```

### Cards

#### Product Card
```
bg-white rounded-2xl overflow-hidden
shadow-soft hover:shadow-soft-lg
transition-all duration-300 hover:-translate-y-1
border border-cream-200/50
```
- Image ratio: `aspect-[4/5]` with `object-cover`
- Content padding: `p-4`
- Price uses `font-sans font-bold tabular-nums`
- Badge: Blush 100 background, Blush 700 text, `rounded-full px-3 py-1 text-xs font-medium`

#### Feature / Info Card
```
bg-cream-50 rounded-xl p-6
border border-cream-200
```

### Inputs

#### Text Input
```
w-full bg-cream-100 border border-cream-200
rounded-xl px-4 py-3
font-sans text-sm text-charcoal
placeholder:text-cream-400
focus:outline-none focus:ring-2 focus:ring-blush-500/30 focus:border-blush-500
transition-all duration-200
```

#### File Upload Zone
```
border-2 border-dashed border-cream-300
rounded-xl p-6 text-center
bg-cream-50 hover:bg-cream-100 hover:border-blush-300
transition-all duration-200 cursor-pointer
```

### Modals / Drawers

#### Overlay
```
fixed inset-0 bg-black/40 backdrop-blur-sm z-50
```

#### Bottom Sheet (Mobile)
```
fixed bottom-0 left-0 right-0
bg-white rounded-t-3xl
max-h-[85vh] overflow-y-auto
shadow-luxury
```
- Drag handle: `w-12 h-1 bg-cream-300 rounded-full mx-auto mt-3`

#### Side Drawer (Cart)
```
fixed right-0 top-0 bottom-0
w-full sm:w-[420px]
bg-cream-50 shadow-luxury
```

### Badges / Chips

#### Product Badge
```
bg-blush-100 text-blush-700
rounded-full px-3 py-1
font-sans text-xs font-medium
```

#### Status Badge (Admin)
```
// Pending:  bg-amber-50 text-amber-700 border-amber-200
// Confirmed: bg-blue-50 text-blue-700 border-blue-200
// Shipped: bg-sage-100 text-sage-700 border-sage-200
// Delivered: bg-green-50 text-green-700 border-green-200
// Cancelled: bg-red-50 text-red-700 border-red-200
rounded-full px-3 py-1 text-xs font-medium border
```

### Sticky Add-to-Cart Bar (Mobile)
```
fixed bottom-0 left-0 right-0
bg-white/95 backdrop-blur-md
border-t border-cream-200
px-4 py-3 z-40
flex items-center justify-between gap-3
```
- Price on left: `font-sans font-bold text-lg tabular-nums`
- CTA on right: Full primary button

### Accordion / Expandable Sections
```
border-b border-cream-200 py-4
// Header: flex justify-between items-center cursor-pointer
// Icon: ChevronDown with rotate-180 transition
// Content: overflow-hidden transition-all duration-300
```

---

## Elevation & Depth

| Level | Shadow | Use |
|---|---|---|
| **Soft** | `0 4px 20px -2px rgba(51,51,51,0.05), 0 2px 6px -1px rgba(183,110,121,0.06)` | Cards at rest, input focus |
| **Soft LG** | `0 10px 25px -3px rgba(51,51,51,0.08), 0 4px 10px -2px rgba(183,110,121,0.08)` | Card hover, dropdown menus |
| **Luxury** | `0 20px 35px -5px rgba(51,51,51,0.10), 0 10px 15px -5px rgba(166,148,128,0.08)` | Modals, drawers, hero overlays |

- Shadows use a dual-shadow technique: a neutral charcoal shadow for depth + a warm rose-gold or taupe tint for luxury warmth.
- Use `backdrop-blur-sm` to `backdrop-blur-md` on overlays and sticky bars.

---

## Animations & Micro-interactions

### Framer Motion Defaults

```js
// Standard enter
{ opacity: 0, y: 20 } → { opacity: 1, y: 0 }
transition: { duration: 0.5, ease: "easeOut" }

// Stagger children
staggerChildren: 0.1

// Scale on tap
whileTap: { scale: 0.97 }

// Hover lift
whileHover: { y: -4, transition: { duration: 0.2 } }
```

### CSS Animations & Utility Tokens

| Class Name | Keyframe | Duration | Easing | Use Case |
|---|---|---|---|---|
| `animate-fade-in` | `fadeIn` | 0.25s | cubic-bezier(0.16, 1, 0.3, 1) | Page transitions, backdrop overlays, toasts |
| `animate-modal-pop` | `modalPop` | 0.28s | cubic-bezier(0.16, 1, 0.3, 1) | Dialog modals (Auth, Wishlist, Orders, Inspect) |
| `animate-slide-in-right` | `slideInRight` | 0.32s | cubic-bezier(0.16, 1, 0.3, 1) | Slide-out cart drawer entrance |
| `animate-slide-up` | `slideUp` | 0.30s | cubic-bezier(0.16, 1, 0.3, 1) | Quick view cards, mobile action trays |
| `animate-heart-pop` | `heartPop` | 0.40s | cubic-bezier(0.175, 0.885, 0.32, 1.275) | Wishlist heart elastic favorite pop |
| `animate-badge-bump` | `badgeBump` | 0.35s | cubic-bezier(0.175, 0.885, 0.32, 1.275) | Cart bag count increment badge bump |
| `animate-shake` | `shake` | 0.35s | ease-in-out | Invalid coupon / pincode error wobble |
| `tap-active` | N/A | 0.12s | cubic-bezier(0.16, 1, 0.3, 1) | Tactile button press compression (`scale(0.97)`) |
| `accordion-content-grid` | N/A | 0.28s | cubic-bezier(0.16, 1, 0.3, 1) | Smooth CSS grid accordion expansion (0fr -> 1fr) |
| `animate-float-gentle` | `floatGentle` | 3.5s infinite | ease-in-out | Floating illustrations & hamper orbit items |
| `animate-shimmer` | `shimmer` | 1.5s infinite | linear | Photo skeleton loading shimmer |
| `animate-drop-into-box` | `dropIntoBox` | 0.4s forwards | cubic-bezier(0.34, 1.56, 0.64, 1) | Hamper builder item drop |
| `animate-box-bounce` | `boxBounce` | 0.4s | ease-out | Hamper box landing reaction |

### Framer Motion Centralized System (`src/styles/motion.ts`)

All dynamic animations across Artisan Magz use physics-based spring simulations and standardized motion variants for 60fps luxury performance:

#### Spring Profiles (`springs`)
| Token | Stiffness | Damping | Mass | Role |
|---|---|---|---|---|
| `springs.snappy` | 400 | 30 | 0.8 | Micro-interactions, tab pills, button presses, heart pops |
| `springs.smooth` | 260 | 26 | 1.0 | Drawers, modals, bottom sheets, accordion reveals |
| `springs.bouncy` | 320 | 18 | 1.0 | Floating toast notifications, celebratory badges |
| `springs.gentle` | 180 | 24 | 1.2 | Page view transitions, background aura float, hero parallax |

#### Standardized Variants
- **`modalBackdropVariants`**: Fade backdrop from `opacity: 0` to `opacity: 1` on open, smoothly fade to 0 on exit.
- **`modalDialogVariants`**: Scale and lift dialog from `scale: 0.95, y: 16, opacity: 0` to `scale: 1, y: 0, opacity: 1` on enter; exits cleanly to `scale: 0.95, y: 12, opacity: 0`.
- **`drawerSlideRightVariants`**: Slide-out cart drawer smoothly slides from `x: "100%"` to `x: 0` on open, and cleanly slides back to `x: "100%"` on close with `<AnimatePresence>`.
- **`fadeInUp`**: Gentle scroll-reveal (`y: 20 -> 0`, `opacity: 0 -> 1`) with staggered children via `staggerContainer`.
- **`cardHoverSpring`**: `whileHover={{ y: -6, scale: 1.02 }}` and `whileTap={{ scale: 0.98 }}` for tactile cards.
- **`buttonTapSpring`**: `whileTap={{ scale: 0.96 }}` for primary CTA buttons.
- **`layoutId` Highlight Pills**: Shared layout spring highlight pill (`layoutId="activeTabPill"`, `layoutId="activeFrameFilterPill"`) for seamless Apple-style tab switching.

### Accessibility: Reduced Motion
All animations and transitions automatically clamp to `0.01ms` when `@media (prefers-reduced-motion: reduce)` is enabled by user system preferences.

### Transition Defaults

- Micro-taps / presses (`tap-active` / `buttonTapSpring`): `duration-120` or spring stiffness 400
- Color/opacity transitions: `duration-200`
- Transform/shadow transitions: `duration-300`
- Accordion expansion: `AnimatePresence` with `height: 0 -> auto`, `duration: 0.28`
- Modal enter & exit: `AnimatePresence` with `modalBackdropVariants` & `modalDialogVariants` (0.22s–0.28s)

---

## Textures & Decorative

### Subtle Grain Overlay
```css
.bg-subtle-grain {
  background-image: radial-gradient(rgba(166, 148, 128, 0.04) 1px, transparent 0);
  background-size: 24px 24px;
}
```
Use on hero sections and feature backgrounds for a tactile, paper-like texture.

### Shimmer Loading
```css
background: linear-gradient(90deg, #FDFCF5 25%, #F2EFEA 50%, #FDFCF5 75%);
background-size: 200% 100%;
animation: shimmer 1.5s infinite;
```
Use for image placeholders and skeleton screens.

### Custom Scrollbar
- Track: Cream 50 `#FDFCF5`
- Thumb: Rose Gold Light `#E8CCD1`, `border-radius: 9999px`
- Thumb hover: Rose Gold `#B76E79`
- Width: 6px

---

## Iconography

- **Icon library**: [Lucide React](https://lucide.dev/) — clean, consistent 24×24 stroke icons.
- **Default stroke width**: 1.5–2
- **Icon sizes**: 16px (inline/small), 20px (buttons/nav), 24px (feature cards), 32px (empty states)
- **Icon color**: Inherit from parent text color. Never use arbitrary icon colors.

---

## Responsive Breakpoints

| Breakpoint | Width | Target |
|---|---|---|
| Default (mobile-first) | 0–639px | Phone (primary audience) |
| `sm` | 640px+ | Large phone / small tablet |
| `md` | 768px+ | Tablet |
| `lg` | 1024px+ | Desktop |
| `xl` | 1280px+ | Wide desktop |

### Mobile-First Patterns

- **Navigation**: Bottom sheet hamburger menu with full-screen overlay
- **Product grid**: Single column on mobile, 2 columns on `sm`, 3 on `lg`
- **CTAs**: Sticky bottom bar on mobile, inline on desktop
- **Images**: Full-bleed on mobile, constrained with rounded corners on desktop
- **Typography**: Scale down headings by ~20% on mobile (e.g., `text-3xl md:text-5xl`)

---

## Do's and Don'ts

### Do

- ✅ Use `font-serif` (Cormorant Garamond) for all headings and editorial moments
- ✅ Use `font-sans` (Plus Jakarta Sans) for body, UI, navigation, prices, and buttons
- ✅ Use `font-mono` (JetBrains Mono) for order IDs, payment codes, coupon codes
- ✅ Use `tabular-nums` on all price displays for aligned digits
- ✅ Use `rounded-full` (pill) for primary CTAs, `rounded-xl` or `rounded-2xl` for cards
- ✅ Maintain cream-50 `#FDFCF5` as the base page background everywhere
- ✅ Use rose-gold / blush-500 `#B76E79` as the singular brand accent
- ✅ Apply Framer Motion `whileInView` for scroll-reveal animations
- ✅ Provide generous whitespace — when in doubt, add more breathing room
- ✅ Use the dual-shadow technique (charcoal depth + warm tint)

### Don't

- ❌ Never use fonts outside the three approved families
- ❌ Never use pure black `#000000` for text — always use Charcoal `#333333`
- ❌ Never use pure white `#FFFFFF` for page backgrounds — use Cream 50 `#FDFCF5`
- ❌ Never use sharp corners (`rounded-none`) on interactive elements
- ❌ Never put serif fonts on prices, buttons, or navigation
- ❌ Never use more than one accent color in a single UI section
- ❌ Never skip the loading skeleton / shimmer for async content
- ❌ Never make touch targets smaller than 44×44px on mobile
- ❌ Never use inline styles for fonts — always use Tailwind's `font-serif`, `font-sans`, `font-mono`

---

## Tech Stack

- **Framework**: Vite + React 18 + TypeScript
- **Styling**: Tailwind CSS 3 + custom config
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **State**: Zustand + React Context
- **Payments**: Razorpay
- **Backend**: Supabase (Auth + Database)
- **Fonts**: Google Fonts (preconnected, swap display)
