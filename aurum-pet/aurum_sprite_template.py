#!/usr/bin/env python3
"""Create a labelled 4x4 sprite-sheet placement guide for Aurum.

The output is a 1536x1872 RGBA PNG. Its canvas begins fully transparent;
semi-transparent coloured cells and guide marks are drawn on top so the
template can be used as a drawing guide. Remove all guides before shipping.
"""

from __future__ import annotations

import argparse
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError as exc:
    raise SystemExit(
        "Pillow is required. Install it with: python -m pip install Pillow"
    ) from exc


CANVAS_WIDTH = 1536
CANVAS_HEIGHT = 1872
COLUMNS = 4
ROWS = 4
FRAME_WIDTH = CANVAS_WIDTH // COLUMNS   # 384
FRAME_HEIGHT = CANVAS_HEIGHT // ROWS    # 468

SAFE_LEFT = 32
SAFE_TOP = 32
SAFE_RIGHT = 32
SAFE_BOTTOM = 48
ANCHOR_X = 192
BASELINE_Y = 420

STATES = (
    ("IDLE / RESTING", (37, 99, 235, 42), (96, 165, 250, 230)),
    ("THINKING / WORKING", (168, 85, 247, 42), (196, 137, 255, 230)),
    ("NEEDING INPUT", (14, 165, 164, 42), (45, 212, 191, 230)),
    ("SUCCESS / FINISHED", (212, 175, 55, 48), (240, 200, 106, 235)),
)


def load_font(size: int, bold: bool = False) -> ImageFont.ImageFont:
    """Load a widely available font, falling back to Pillow's default."""
    candidates = (
        "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
        if bold
        else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
        if bold
        else "/System/Library/Fonts/Supplemental/Arial.ttf",
    )
    for candidate in candidates:
        if Path(candidate).exists():
            return ImageFont.truetype(candidate, size=size)
    return ImageFont.load_default()


def draw_centered_text(
    draw: ImageDraw.ImageDraw,
    xy: tuple[int, int],
    text: str,
    font: ImageFont.ImageFont,
    fill: tuple[int, int, int, int],
) -> None:
    """Draw text centred around the given point."""
    box = draw.textbbox((0, 0), text, font=font)
    width = box[2] - box[0]
    height = box[3] - box[1]
    draw.text(
        (xy[0] - width / 2, xy[1] - height / 2),
        text,
        font=font,
        fill=fill,
    )


def build_template() -> Image.Image:
    """Return the complete transparent sprite-sheet guide."""
    if CANVAS_WIDTH % COLUMNS or CANVAS_HEIGHT % ROWS:
        raise ValueError("Canvas dimensions must divide evenly by the grid.")

    image = Image.new("RGBA", (CANVAS_WIDTH, CANVAS_HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image, "RGBA")

    state_font = load_font(26, bold=True)
    frame_font = load_font(20, bold=True)
    detail_font = load_font(16)

    for row, (state_name, cell_fill, accent) in enumerate(STATES):
        for column in range(COLUMNS):
            left = column * FRAME_WIDTH
            top = row * FRAME_HEIGHT
            right = left + FRAME_WIDTH - 1
            bottom = top + FRAME_HEIGHT - 1

            safe_left = left + SAFE_LEFT
            safe_top = top + SAFE_TOP
            safe_right = left + FRAME_WIDTH - SAFE_RIGHT - 1
            safe_bottom = top + FRAME_HEIGHT - SAFE_BOTTOM - 1
            centre_x = left + ANCHOR_X
            baseline_y = top + BASELINE_Y

            # Keep the cell background transparent. Tint only the safe art box.
            draw.rectangle(
                (safe_left, safe_top, safe_right, safe_bottom),
                fill=cell_fill,
            )
            opaque_accent = (accent[0], accent[1], accent[2], 255)
            draw.rectangle(
                (left, top, right, bottom),
                outline=opaque_accent,
                width=4,
            )

            # Safe art rectangle, centreline, and shared character baseline.
            draw.rectangle(
                (safe_left, safe_top, safe_right, safe_bottom),
                outline=(255, 255, 255, 150),
                width=2,
            )
            draw.line(
                (centre_x, safe_top, centre_x, safe_bottom),
                fill=(255, 255, 255, 75),
                width=2,
            )
            draw.line(
                (safe_left, baseline_y, safe_right, baseline_y),
                fill=accent,
                width=3,
            )

            # Anchor crosshair.
            draw.line(
                (centre_x - 9, baseline_y, centre_x + 9, baseline_y),
                fill=(255, 255, 255, 230),
                width=2,
            )
            draw.line(
                (centre_x, baseline_y - 9, centre_x, baseline_y + 9),
                fill=(255, 255, 255, 230),
                width=2,
            )

            draw_centered_text(
                draw,
                (centre_x, top + 67),
                state_name,
                state_font,
                (255, 255, 255, 245),
            )
            draw_centered_text(
                draw,
                (centre_x, top + 105),
                f"FRAME {column + 1}",
                frame_font,
                accent,
            )
            draw_centered_text(
                draw,
                (centre_x, top + 142),
                "ART SAFE AREA",
                detail_font,
                (255, 255, 255, 190),
            )

            coordinate_label = f"origin ({left}, {top})  |  384 x 468 px"
            draw_centered_text(
                draw,
                (centre_x, top + FRAME_HEIGHT - 22),
                coordinate_label,
                detail_font,
                (255, 255, 255, 220),
            )

    return image


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Generate Aurum's 1536x1872 transparent sprite template."
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=Path(__file__).with_name("aurum_sprite_template.png"),
        help="Output PNG path (default: beside this script).",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    args.output.parent.mkdir(parents=True, exist_ok=True)

    image = build_template()
    image.save(args.output, format="PNG", optimize=True)

    # Reopen and verify the saved artifact rather than trusting in-memory state.
    with Image.open(args.output) as verified:
        if verified.size != (CANVAS_WIDTH, CANVAS_HEIGHT):
            raise RuntimeError(f"Unexpected output size: {verified.size}")
        if verified.mode != "RGBA":
            raise RuntimeError(f"Unexpected output mode: {verified.mode}")
        alpha_min, alpha_max = verified.getchannel("A").getextrema()
        if alpha_min != 0 or alpha_max != 255:
            raise RuntimeError(
                "Template must contain both fully transparent and opaque pixels."
            )

    print(f"Created {args.output.resolve()}")
    print(f"Canvas: {CANVAS_WIDTH} x {CANVAS_HEIGHT} RGBA")
    print(f"Grid: {COLUMNS} x {ROWS}; frame: {FRAME_WIDTH} x {FRAME_HEIGHT}")


if __name__ == "__main__":
    main()
