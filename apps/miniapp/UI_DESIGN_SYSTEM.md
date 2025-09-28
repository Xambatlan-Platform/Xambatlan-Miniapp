# Xambatlán UI Design System
## Jade-Pastel Aztec/Maya Pixel-Art Theme

### Overview
This document outlines the complete UI design system for Xambatlán Mini App, featuring a jade-pastel Aztec/Maya pixel-art theme optimized for mobile-first experiences and users aged 18-55.

---

## 🎨 Color Palette

### Primary Colors
- **Jade 300 (#7EC9A3)**: Primary pastel jade - main brand color
- **Jade 700 (#15803d)**: Deeper jade for primary buttons and text
- **Obsidian 800 (#292524)**: High contrast dark text
- **Obsidian 900 (#1c1917)**: Darkest text for headings

### Accent Colors
- **Teal 600 (#0d9488)**: Medium teal for secondary elements
- **Gold 500 (#f59e0b)**: Muted gold for highlights and badges
- **Coral 500 (#ef4444)**: Coral red for destructive actions
- **Stone 500 (#78716c)**: Medium grey for secondary buttons

### Background Colors
- **Jade 50 (#f0fdf4)**: Light jade background
- **Temple Gradient**: Linear gradient from jade-50 to jade-100
- **Marketplace Gradient**: Gradient from jade-50 via teal-50 to gold-50

---

## 🔤 Typography

### Font Families
1. **Orbitron** (`font-pixel`): Pixel/retro style for titles and headers
   - Usage: All h1-h6, button text, section titles
   - Style: Bold, uppercase, wide letter spacing

2. **Inter** (`font-sans`): Clear sans-serif for body text
   - Usage: Paragraphs, form labels, descriptions
   - Minimum size: 16px for accessibility

3. **JetBrains Mono** (`font-mono`): Monospace for code/technical elements

### Typography Scale
- **Text base (16px)**: Minimum body text size
- **Text lg (18px)**: Preferred body text size
- **Text xl-6xl**: Various heading sizes with proper line heights

---

## 🔘 Buttons

### Variants
1. **Primary**: Solid dark jade background, white text
2. **Secondary**: Medium grey background, white text
3. **Destructive**: Coral red background, white text
4. **Ghost**: Transparent background, jade text
5. **Outline**: Transparent background, jade border

### Sizes
- **Small**: 36px min height
- **Medium**: 44px min height (default touch target)
- **Large**: 56px min height
- **XL**: 72px min height

### Features
- Pixel-art shadow effects
- Aztec-inspired border radius (4px, 8px, 12px)
- Touch-friendly sizing (44px+ minimum)
- Loading states and disabled states
- Icon support (left/right)

---

## 🃏 Cards

### Variants
1. **Default**: White background, jade border
2. **Temple**: Jade gradient background, pixel shadows
3. **Marketplace**: Teal accents, hover effects
4. **Profile**: Gold accents, gradient backgrounds

### Composition
- CardHeader: Optional border, title/description
- CardTitle: Can use Aztec styling (pixel font)
- CardContent: Main content area
- CardFooter: Actions and metadata

---

## 🖼️ Icons

### Style
- Pixel-art aesthetic with crisp edges
- Large sizes for mobile accessibility
- Aztec/Maya inspired designs

### Icon Set
- **PyramidIcon**: Xambatlán logo/brand
- **ArtisanIcon**: Service providers/craftspeople
- **ShieldIcon**: Trust/security/verification
- **CoinIcon**: Payments/transactions
- **StarIcon**: Ratings/reviews (filled/outline)
- **ToolsIcon**: Services/work
- **EyeIcon**: Reveal functionality
- **LockIcon**: Security/encryption
- **UserIcon**: Profiles/people
- **BadgeIcon**: Achievements/reputation

---

## 📱 Layout Components

### Layout
- Mobile-first responsive design
- Maximum width: 448px (max-w-md)
- Centered on larger screens
- Variants: default, centered, marketplace

### Section
- Consistent spacing and organization
- Optional titles with pixel font styling
- Variants for different content types

### Grid
- Responsive grid system (1-3 columns)
- Configurable gaps (sm, md, lg)
- Auto-responsive on mobile

---

## 🎯 Accessibility Features

### Touch Targets
- Minimum 44px height for all interactive elements
- Adequate spacing between touch targets
- Large, easy-to-tap buttons

### Typography
- 16px minimum body text size
- High contrast ratios (dark text on light backgrounds)
- Clear font hierarchy

### Focus States
- 2px solid jade outline
- 2px offset for visibility
- Consistent across all interactive elements

---

## 🎨 Visual Effects

### Shadows
- **Pixel Shadow**: 2px 2px 0px rgba(0, 0, 0, 0.2)
- **Pixel Large**: 4px 4px 0px rgba(0, 0, 0, 0.2)
- **Temple Shadow**: Layered box shadows for depth

### Border Radius
- **Aztec**: 4px - small elements
- **Temple**: 8px - medium elements
- **Pyramid**: 12px - large elements

### Animations
- Smooth transitions (0.2s ease)
- Fade-in and slide-up animations
- Soft pulse for loading states
- Active scale transform (0.98) for buttons

---

## 🏗️ Component Architecture

### File Structure
```
src/components/ui/
├── Button.tsx          # Primary button component
├── Card.tsx            # Card system with compositions
├── Icons.tsx           # Complete icon set
├── Layout.tsx          # Layout, Section, Grid, badges
└── index.ts            # Barrel exports
```

### Usage Patterns
```tsx
// Example button usage
<Button variant="primary" size="lg" leftIcon={<CoinIcon />}>
  Pagar y Revelar
</Button>

// Example card usage
<Card variant="temple" padding="lg">
  <CardHeader withBorder>
    <CardTitle aztec>Sistema Activo</CardTitle>
    <CardDescription>Plataforma verificada</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

---

## 🌍 Internationalization

### Language
- Primary: Spanish (es)
- Terminology: Mexico-focused (e.g., "artesanos", "Xambatlán")
- Cultural references: Aztec/Maya themes

### Text Content
- Clear, direct communication
- Mobile-optimized text lengths
- Accessibility-friendly descriptions

---

## 📋 Implementation Status

### ✅ Completed
- [x] Color palette and design tokens
- [x] Typography system with Google Fonts
- [x] Complete button component with variants
- [x] Card system with compositions
- [x] Pixel-art icon set (10+ icons)
- [x] Layout components (Layout, Section, Grid)
- [x] Utility components (Badge, ProgressBar, StatusIndicator)
- [x] Tailwind configuration
- [x] Global CSS with theme variables
- [x] Home page redesign
- [x] Profile page redesign with create/edit forms

### 🔄 Next Steps
- [ ] Complete marketplace/services listing redesign
- [ ] Pay-to-reveal flow redesign
- [ ] Review & ranking screen redesign
- [ ] Navigation component updates
- [ ] Responsive testing across devices
- [ ] Performance optimization
- [ ] Accessibility audit

---

## 🎯 Design Goals Achievement

### ✅ Mobile-First
- Touch-friendly 44px+ buttons
- Optimized spacing and typography
- Single-column layouts for mobile

### ✅ High Contrast
- Dark text on light backgrounds
- Clear visual hierarchy
- Accessible color combinations

### ✅ Jade-Pastel Aztec/Maya Theme
- Jade (#7EC9A3) as primary color
- Pyramid-inspired border radius
- Pixel-art icons with cultural motifs
- Temple and obsidian color references

### ✅ Visual Distinction
- Unique pixel-art aesthetic
- Cultural theming sets apart from generic apps
- Professional yet playful appearance

### ✅ Age Group 18-55 Optimization
- Clear, readable fonts
- Intuitive navigation
- Professional appearance for business use
- Accessible design principles

---

This design system creates a cohesive, visually distinct, and highly usable interface that embodies the spirit of a "digital Tenochtitlán of trust" while maintaining modern usability standards.