# Artisan Magz | Bespoke Personalized Keepsakes & Gifting Studio 🎀

A modern, high-converting, mobile-first e-commerce web application crafted for an Instagram-based boutique gifting studio. Built with React 18, TypeScript, Vite, Tailwind CSS, and Supabase.

---

## 🎨 Brand Identity & Design System

- **Vibe:** Warm, romantic, pastel, celebratory boutique gifting aesthetic.
- **Color Palette:**
  - **Cream Canvas:** `#FDFCF5` (Warm luxury textured parchment background)
  - **Rose Gold:** `#B76E79` (Primary Brand Accent & CTAs)
  - **Blush:** `#FFDBE5` (Soft highlight tags & text selection)
  - **Charcoal:** `#333333` (Soft high-contrast readable typography)
  - **Warm Taupe:** `#A69480` (Muted supporting tone)
  - **Sage Green:** `#98C0A9` (Botanical badges & verified trust signals)
- **Typography:**
  - Headings: `Playfair Display` (High-fashion editorial serif)
  - Body: `Plus Jakarta Sans` (Clean, contemporary sans-serif)
  - Handwritten Notes: `Caveat` & `Dancing Script` (Calligraphy wax-sealed cards)
  - Editorial Vintage: `Courier Prime` (Typewriter newspaper text)
- **Mobile-First UX:** 2-column touch grids, sticky bottom checkout bar, expandable accordion product detail drawers, and 1-tap WhatsApp checkout.

---

## 📦 Keepsake Products & Customizers

### 1. Custom Magazines & Mini-Magazines
- **Variants:** 8, 12, 16, and 20 Pages with dynamic price calculations.
- **Features:** 
  - Photo upload with capacity tracking matching page counts.
  - Front cover headlines, occasion dates, and personal dedication letter.
  - Interactive **3D Flipbook Magazine Preview** with page-turn animations.
  - Custom Spotify QR code dedication plaque.

### 2. Personalized Photo Frames Collection
- **Curated Styles:**
  - 🃏 **Playing Card Collage** (*"How Lucky Are We?" 9-card heart layout*)
  - ✈️ **Paper Plane Love Note** (*3-tier photo strip with doodles on notepad parchment*)
  - 🎀 **Favorite Person Scrapbook** (*Vintage kraft collage with 35mm filmstrip & stickers*)
  - 📰 **The Daily Slay Newspaper** (*Editorial broadsheet milestone frame*)
  - 💖 **Cutout Grid Collage** (*3x3 Polaroid grid with raised 3D couple cutout*)
  - ✨ **Chaos Polaroid Mosaic** (*Overlapping memories frame*)
  - 🎵 **Spotify Soundwave Code Frame**
  - 🌸 **Desktop Mini Frame** (*Compact 4x4 Tabletop Keepsake*)
- **Frame Finishes:** Classic Black Gallery, Minimalist Natural Oak, Nordic White Wood, Frameless Clear Acrylic.
- **Sizes:** 4x4 Mini, 6x8 Keepsake, 8x10 Gallery, A4 Statement, A3 Exhibition.

### 3. Interactive "Build Your Own Hamper"
- **Step 1:** Select Hamper Box style (Pastel Gift Box, Vintage Wooden Crate, Ribbon Hamper).
- **Step 2:** Add curated boutique goodies (Silk scrunchie, Kashmiri silver jhumkas, press-on nails, mini frame, hair clips) with real-time price tallying.
- **Step 3:** Handwritten greeting card note with authentic wax seal stamp selection.
- **Step 4:** Live visual unboxing preview showing items inside the hamper box!

### 4. The Daily Love Newspaper Frame Card
- Vintage broadsheet masthead, personalized headline, custom article story, milestone date badges, and couple photography.

---

## 🔐 Authentication & Supabase Cloud Integration

- **1-Click Google OAuth**: Streamlined Google Sign-In with instant session hydration.
- **Database Architecture (PostgreSQL on Supabase)**:
  - `profiles`: Synced directly from Google Auth via database triggers.
  - `saved_addresses`: Customer delivery addresses with default selector.
  - `orders`: Streamlined 4-stage tracking (`Placed` → `Printing` → `Dispatched` → `Delivered`).
  - Row Level Security (RLS) policies ensuring complete customer privacy.
- **1-Tap Checkout Auto-fill**: Saved addresses auto-populate during checkout.

---

## 🛠️ Tech Stack

- **Framework:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS + PostCSS + Autoprefixer
- **Icons:** Lucide React
- **Animations:** Framer Motion + Canvas Confetti
- **Backend & Auth:** Supabase (`@supabase/supabase-js`)
- **State Management:** React Context (`AuthContext`, `CartContext`, `WishlistContext`)

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/twoplustwofive/artisan-magz.git
cd artisan-magz
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory (refer to `.env.example`):
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-publishable-key
```

### 3. Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 4. Run Unit Tests
```bash
npm test
```

### 5. Build for Production
```bash
npm run build
```
Production assets are generated in `dist/`.
