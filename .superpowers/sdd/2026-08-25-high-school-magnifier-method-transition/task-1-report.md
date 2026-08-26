# Task 1 — Watercolor animation assets report

## Status

Complete. Built-in ImageGen was used (not the CLI fallback). Eight calls were made: the six required concepts plus two lower-density regenerations for Diagnose and Review; the lower-density versions were selected for those two finals.

## Generated sources and selected workspace assets

| Layer | Generated source selected | Final workspace path |
| --- | --- | --- |
| Centre | `/Users/lethanhhuyen/.codex/generated_images/01a037a4-83c0-7012-bb26-09f78c2ce681/exec-35308112-46c2-43db-a9f7-baf1f0b6f9b7.png` | `public/images/programs/high-school-method-transition/method-bloom-center-green-v1.png` |
| Diagnose | `/Users/lethanhhuyen/.codex/generated_images/01a037a4-83c0-7012-bb26-09f78c2ce681/exec-f68823a2-0d1e-42a5-97b3-c4230903158b.png` | `public/images/programs/high-school-method-transition/method-bloom-diagnose-teal-v1.png` |
| Explain | `/Users/lethanhhuyen/.codex/generated_images/01a037a4-83c0-7012-bb26-09f78c2ce681/exec-48c8db18-f76a-4417-8aa0-aa1666fac73b.png` | `public/images/programs/high-school-method-transition/method-bloom-explain-green-v1.png` |
| Practise | `/Users/lethanhhuyen/.codex/generated_images/01a037a4-83c0-7012-bb26-09f78c2ce681/exec-90981cc3-fb0c-4706-b0fe-6185815cfe01.png` | `public/images/programs/high-school-method-transition/method-bloom-practise-lavender-v1.png` |
| Apply | `/Users/lethanhhuyen/.codex/generated_images/01a037a4-83c0-7012-bb26-09f78c2ce681/exec-537d8065-a654-4c38-ae36-5a6520a4cb57.png` | `public/images/programs/high-school-method-transition/method-bloom-apply-peach-v1.png` |
| Review | `/Users/lethanhhuyen/.codex/generated_images/01a037a4-83c0-7012-bb26-09f78c2ce681/exec-c87b28a4-40ff-4463-8bd8-58f98a39a8b5.png` | `public/images/programs/high-school-method-transition/method-bloom-review-gold-v1.png` |

Unselected first-pass sources:

- Diagnose: `/Users/lethanhhuyen/.codex/generated_images/01a037a4-83c0-7012-bb26-09f78c2ce681/exec-cb7120c2-c4fc-484b-bdcc-5f0fb3895684.png`
- Review: `/Users/lethanhhuyen/.codex/generated_images/01a037a4-83c0-7012-bb26-09f78c2ce681/exec-c7079dfb-4d34-4c26-9c79-538da952aa59.png`

## Exact prompt set

The shared selector template was used with only its colour/shape wording changed for each initial selector call.

```text
Use case: stylized-concept
Asset type: transparent website animation layer
Primary request: a broad, extremely subtle pale sage-green watercolor pigment bloom for the visual centre of a premium tutoring website scroll animation
Style/medium: realistic watercolor pigment with soft irregular feathered edges and restrained paper granulation
Composition/framing: isolated circular-oval bloom centred on a square transparent canvas, ample transparent margin, no hard edge
Color palette: pale sage green with a few extremely faint antique-gold specks
Constraints: genuinely transparent background; no text; no icon; no object; no border; no frame; no shadow; no watermark
Avoid: neon, glow, portal, dense particles, opaque cream background, sharp geometry
```

```text
Use case: stylized-concept
Asset type: transparent website animation layer
Primary request: a broad, extremely subtle [COLOUR/SHAPE] watercolor pigment bloom, irregular round bloom, for a premium tutoring website scroll animation
Style/medium: realistic watercolor pigment with soft irregular feathered edges and restrained paper granulation
Composition/framing: isolated circular-oval bloom centred on a square transparent canvas, ample transparent margin, no hard edge
Color palette: [COLOUR/SHAPE]
Constraints: genuinely transparent background; no text; no icon; no object; no border; no frame; no shadow; no watermark
Avoid: neon, glow, portal, dense particles, opaque cream background, sharp geometry
```

`[COLOUR/SHAPE]` was substituted verbatim as:

- `restrained teal and green-blue` (Diagnose)
- `soft leaf-green` (Explain)
- `muted lavender and pale violet` (Practise)
- `warm peach and restrained orange` (Apply)
- `muted DA gold and soft yellow-ochre` (Review)

The two rejected first passes were regenerated with the same full respective prompt plus this one targeted line:

```text
Pigment density: exceptionally light, washed-out and airy; keep all colour low-saturation with no dark teal regions
```

```text
Pigment density: exceptionally light, washed-out and airy; keep all colour low-saturation with no dense ochre or bright yellow regions
```

## Inspection and alpha verification

Each generated source was inspected with `view_image`. Selected layers are isolated, icon-free, text-free, border-free watercolor blooms with no opaque canvas background. The heavier initial teal and gold renders were rejected in favour of their lower-density rerenders.

`file` confirmed every final is a 1254 × 1254, 8-bit RGBA PNG. `sips` reported `hasAlpha: yes` for all six. A `sharp` raw-pixel alpha scan confirmed transparent pixels in every asset:

| Asset | Alpha min/max | Fully transparent pixels | Partial-alpha pixels | Fully opaque pixels |
| --- | --- | ---: | ---: | ---: |
| Apply | 0 / 253 | 563,739 | 1,008,777 | 0 |
| Centre | 0 / 254 | 580,390 | 992,126 | 0 |
| Diagnose | 0 / 253 | 541,141 | 1,031,375 | 0 |
| Explain | 0 / 254 | 635,796 | 936,720 | 0 |
| Practise | 0 / 254 | 569,179 | 1,003,337 | 0 |
| Review | 0 / 252 | 659,371 | 913,145 | 0 |

## Commands and results

```bash
file public/images/programs/high-school-method-transition/*.png
```

Result: six PNG files, each `1254 x 1254, 8-bit/color RGBA, non-interlaced`.

```bash
sips -g pixelWidth -g pixelHeight -g hasAlpha public/images/programs/high-school-method-transition/*.png
```

Result: each file reported 1254 × 1254 and `hasAlpha: yes`.

```bash
node -e 'const sharp=require("sharp"); /* raw alpha scan */' public/images/programs/high-school-method-transition/*.png
```

Result: each file has alpha min `0`, nonzero fully transparent pixels, and no fully opaque pixels (full counts above).

## Commit

Assets: `75bbcedc548e6f5b381a93ec8dcc8573a4a8cb1f` — `assets: add watercolor method transition blooms`.

## Self-review

- Exact six requested filenames are present and versioned as specified.
- The selected variants are distinct enough by palette for the upcoming selector states while retaining a common restrained watercolor treatment.
- No application source files or unrelated dirty-tree files were altered.

## Concerns

None blocking. The generated blooms intentionally retain soft, partially transparent pigment edges; the animation implementation should control their final opacity and scale against the page background.
