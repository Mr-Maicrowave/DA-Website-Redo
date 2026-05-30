# DA Tuition Style Guide

## Visual Language

Our visual language combines professionalism with warmth, creating an environment where families feel confident and welcomed.

## Color System

### Brand Colors

#### Primary Palette
```css
/* Blues - Trust & Stability */
--brand-blue-light: #3B82F6;
--brand-blue-dark: #1E40AF;

/* Orange - Energy & Creativity */
--brand-orange: #FFA500;
--brand-orange-light: #FFB84D;

/* Green - Growth & Success */
--brand-green: #10B981;
--brand-green-light: #34D399;
```

#### Pastel Palette (Student Content)
```css
/* Soft, approachable colors for student-facing content */
--pastel-blue: #e0e7ff;     /* Main containers */
--pastel-yellow: #fff1c9;    /* Appreciation, warmth */
--pastel-pink: #f9e3e6;      /* Advice, guidance */
--pastel-green: #dcfce7;     /* Success, achievement */

/* Subject-Specific Pastels */
--english-lilac: #f3e8ff;
--science-mint: #e8fff3;
--math-ivory: #fffaf0;
--parenting-blush: #fde2e4;
```

#### Neutral Scale
```css
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;
--gray-200: #E5E7EB;
--gray-300: #D1D5DB;
--gray-400: #9CA3AF;
--gray-500: #6B7280;
--gray-600: #4B5563;
--gray-700: #374151;
--gray-800: #1F2937;
--gray-900: #111827;
```

### Color Usage

#### Text Colors
- **Headings**: `text-gray-900` (dark) or `gradient-text` (blue gradient)
- **Body**: `text-gray-600` or `text-gray-700`
- **Muted**: `text-gray-500`
- **Links**: `text-brand-blue-dark hover:text-brand-blue-light`

#### Background Colors
- **Page**: White or subtle gradient
- **Sections**: Gradient transitions (see Section Transitions)
- **Cards**: White with `shadow-sm` or pastel backgrounds
- **Hover**: Slight elevation with `shadow-lg`

## Typography

### Font Family
```css
font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
```

### Type Scale
| Level | Class | Size | Usage |
|-------|-------|------|-------|
| Hero | `text-4xl lg:text-6xl` | 36-60px | Main headlines |
| H1 | `text-3xl lg:text-4xl` | 30-36px | Page titles |
| H2 | `text-2xl lg:text-3xl` | 24-30px | Section headers |
| H3 | `text-xl lg:text-2xl` | 20-24px | Subsections |
| H4 | `text-lg` | 18px | Card titles |
| Body | `text-base` | 16px | Main content |
| Small | `text-sm` | 14px | Secondary info |
| Tiny | `text-xs` | 12px | Meta data |

### Font Weights
- **Regular**: `font-normal` (400) - Body text
- **Medium**: `font-medium` (500) - Emphasis
- **Semibold**: `font-semibold` (600) - Subheadings
- **Bold**: `font-bold` (700) - Headers

### Line Height
- **Tight**: `leading-tight` - Headlines
- **Normal**: `leading-normal` - UI elements
- **Relaxed**: `leading-relaxed` - Body text

## Spacing System

### Base Unit: 8px

```css
/* Spacing Scale */
p-0: 0px
p-1: 0.25rem (4px)
p-2: 0.5rem (8px)
p-3: 0.75rem (12px)
p-4: 1rem (16px)
p-5: 1.25rem (20px)
p-6: 1.5rem (24px)
p-8: 2rem (32px)
p-10: 2.5rem (40px)
p-12: 3rem (48px)
p-16: 4rem (64px)
p-20: 5rem (80px)
```

### Component Spacing
- **Card padding**: `p-6` to `p-8`
- **Section padding**: `py-16` to `py-20`
- **Button padding**: `px-6 py-3`
- **Form field spacing**: `space-y-6`
- **Grid gaps**: `gap-4` to `gap-8`

## Component Library

### Buttons

#### Primary Button
```html
<button class="btn-primary">
  Book Interview
</button>
```
Style: Gradient blue background, white text, hover lift effect

#### Secondary Button
```html
<button class="btn-secondary">
  Learn More
</button>
```
Style: Outlined, blue border, transparent background

#### Button Sizes
- **Small**: `px-4 py-2 text-sm`
- **Default**: `px-6 py-3`
- **Large**: `px-8 py-4 text-lg`

### Cards

#### Basic Card
```html
<div class="bg-white rounded-2xl shadow-sm p-6 card-hover">
  <!-- Content -->
</div>
```

#### Pastel Card
```html
<div class="pastel-card pastel-blue">
  <!-- Content -->
</div>
```

#### Feature Card
```html
<div class="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
  <div class="text-brand-blue-dark mb-4">
    <!-- Icon -->
  </div>
  <h3 class="text-xl font-bold mb-2">Title</h3>
  <p class="text-gray-600">Description</p>
</div>
```

### Forms

#### Input Field
```html
<div class="space-y-2">
  <label class="text-sm font-medium text-gray-700">
    Label
  </label>
  <input class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-light focus:border-transparent">
</div>
```

#### Textarea
```html
<textarea class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-light" rows="4">
</textarea>
```

### Navigation

#### Header Navigation
```html
<nav class="bg-white shadow-sm">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Navigation items -->
  </div>
</nav>
```

#### Mobile Menu
- Hamburger icon for mobile
- Full-screen overlay
- Smooth slide-in animation

## Layout Patterns

### Container Widths
```css
/* Max widths */
max-w-sm: 24rem (384px)
max-w-md: 28rem (448px)
max-w-lg: 32rem (512px)
max-w-xl: 36rem (576px)
max-w-2xl: 42rem (672px)
max-w-3xl: 48rem (768px)
max-w-4xl: 56rem (896px)
max-w-5xl: 64rem (1024px)
max-w-6xl: 72rem (1152px)
max-w-7xl: 80rem (1280px)
```

### Grid Systems

#### Two Column
```html
<div class="grid md:grid-cols-2 gap-8">
  <!-- Items -->
</div>
```

#### Three Column
```html
<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
  <!-- Items -->
</div>
```

#### Responsive Grid
```html
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  <!-- Items -->
</div>
```

## Animation & Transitions

### Standard Transitions
```css
/* Default transition */
transition-all duration-300 ease-out

/* Fast transition */
transition-all duration-200 ease-out

/* Slow transition */
transition-all duration-500 ease-out
```

### Hover Effects
```css
/* Card hover */
.card-hover {
  @apply transition-all duration-300 hover:shadow-xl hover:-translate-y-2;
}

/* Button hover */
.btn-hover {
  @apply transition-all duration-300 hover:scale-105;
}
```

### Animation Classes
```css
/* Fade in */
.animate-fade-in {
  animation: fadeIn 0.6s ease-out;
}

/* Slide up */
.animate-slide-up {
  animation: slideUp 0.5s ease-out;
}

/* Float */
.animate-float {
  animation: float 6s ease-in-out infinite;
}
```

## Icons

### Icon Library: Lucide React

Common icons:
- `Star` - Ratings, favorites
- `Check` - Success, completion
- `ArrowRight` - Navigation, CTAs
- `Menu` - Mobile navigation
- `X` - Close, dismiss
- `Phone` - Contact
- `Mail` - Email
- `MapPin` - Location
- `Clock` - Time, schedule
- `User` - Profile, account

### Icon Sizes
- **Small**: `size={16}`
- **Default**: `size={20}`
- **Large**: `size={24}`
- **XLarge**: `size={32}`

## Section Transitions

### Gradient Flow Pattern
Each section flows smoothly into the next using gradient backgrounds:

```html
<div style="background: linear-gradient(180deg, START_COLOR 0%, END_COLOR 100%)">
  <section class="transparent-section">
    <!-- Content -->
  </section>
</div>
```

### Color Progression
1. Hero: Light gray → Blue
2. Reviews: Blue → Teal
3. Features: Teal → Green
4. Programs: Green → Yellow
5. Contact: Yellow → Warm
6. Footer: Warm fade

## Responsive Design

### Breakpoints
```css
/* Tailwind default breakpoints */
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

### Mobile-First Approach
```html
<!-- Stack on mobile, side-by-side on desktop -->
<div class="flex flex-col lg:flex-row">
  <!-- Content -->
</div>
```

### Touch Targets
- Minimum size: 44x44px
- Spacing between targets: 8px minimum
- Clear visual feedback on tap

## Accessibility

### Focus States
```css
/* Focus ring */
focus:ring-2 focus:ring-brand-blue-light focus:ring-offset-2

/* Focus visible only */
focus-visible:ring-2 focus-visible:ring-brand-blue-light
```

### Screen Reader Support
- Use semantic HTML
- Add `aria-label` for icons
- Include `alt` text for images
- Proper heading hierarchy

### Color Contrast
- Normal text: 4.5:1 minimum
- Large text: 3:1 minimum
- Interactive elements: 3:1 minimum

## Image Guidelines

### Formats
- **Photos**: JPEG with 85% quality
- **Graphics**: PNG with transparency
- **Icons**: SVG when possible

### Sizes
- **Hero images**: 1920x1080 max
- **Card images**: 400x300
- **Thumbnails**: 150x150
- **Avatar**: 64x64

### Performance
- Lazy loading for below-fold images
- Responsive images with srcset
- WebP format with fallbacks

## Do's and Don'ts

### Do's ✅
- Use consistent spacing (8px grid)
- Follow color palette strictly
- Maintain visual hierarchy
- Test on real devices
- Ensure keyboard accessibility
- Optimize for performance
- Write semantic HTML
- Use existing components

### Don'ts ❌
- Mix different shadow styles
- Use inline styles
- Create one-off colors
- Ignore mobile experience
- Skip loading states
- Forget error handling
- Use px for font sizes
- Neglect accessibility

## Quick Reference

### Common Utility Classes
```css
/* Layout */
.container
.mx-auto
.flex
.grid
.hidden
.block

/* Spacing */
.p-6
.m-4
.space-y-4
.gap-6

/* Typography */
.text-lg
.font-bold
.text-gray-600
.leading-relaxed

/* Background */
.bg-white
.bg-gray-50
.bg-gradient-to-r

/* Borders */
.border
.rounded-lg
.rounded-2xl
.shadow-sm

/* Interaction */
.hover:shadow-lg
.transition-all
.cursor-pointer
.duration-300
```

This style guide is a living document. Update it as the design system evolves to maintain consistency across the DA Tuition platform.