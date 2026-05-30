# DA Tuition Color Comparison A/B Testing

## Overview
This feature allows you to compare the current website colors with the new DA Tuition colors based on the physical tutoring center's vibrant interior.

## Access the Comparison
Visit: `/color-comparison`

Example: `http://localhost:5173/color-comparison` (when running dev server)

## Features

### Toggle Views
- **Current Colors**: The existing blue/orange/green brand theme
- **DA Colors**: New vibrant colors based on the tutoring center interior

### New Color System
The new colors are defined in `/src/styles/da-colors.css` and include:

**Primary Colors:**
- `--da-green: #A4D65E` (Lime green walls)
- `--da-teal: #5ECCC5` (Teal/turquoise walls)
- `--da-blue: #6B9AC4` (Blue walls)
- `--da-red: #E94B3C` (Bright red accents)
- `--da-yellow: #FFC914` (Warm yellow/gold)

**Features:**
- Watercolor wash effects
- Gradient combinations
- Light/dark variations
- Pre-built button styles
- Multi-color watercolor backgrounds

### Visual Differences

**Current Theme:**
- Subtle gradients from gray-50 to blue-50
- Muted brand colors
- Traditional web design aesthetic

**DA Colors Theme:**
- Vibrant watercolor multi-color background
- Bold, energetic color combinations
- Reflects the physical space personality
- More engaging and dynamic visual experience

## Usage

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to the comparison page:**
   ```
   http://localhost:5173/color-comparison
   ```

3. **Toggle between views** using the controls at the top of the page

4. **Compare the visual impact** of both color schemes side by side

## Implementation Notes

- The comparison page shows the Hero section in both color themes
- All DA colors are available as CSS custom properties
- Watercolor effects are achieved through multiple radial gradients
- The new theme maintains accessibility while being more vibrant
- Button styles use the gradient combinations for visual appeal

## Decision Making
Use this A/B comparison to:
- Evaluate visual impact
- Test user preference
- Assess brand alignment
- Make informed design decisions

The new DA colors create a more vibrant, engaging experience that better reflects the energy and personality of the physical tutoring center.