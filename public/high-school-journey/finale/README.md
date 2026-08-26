# Finale assets

- `student-watercolour-composite.png` is the supplied combined student and
  multicolour watercolour artwork used by the reveal. It replaces the earlier
  separate student and burst layers.
- The supplied file is an RGB PNG with an opaque white background. The scene
  preserves it unchanged and uses non-destructive compositing. A transparent
  export can replace it at the same path without code changes.

The paint curtains, centre breakup mask, streaks and pigment fragments remain
code-generated in `src/components/programs/high-school-finale/FinaleScene.tsx`.

The final reference-matched Year 7–10 artwork uses ChatGPT Image Generator PNGs:
four bubbles, four year icons, the journey arrow, accent sparkles and the gold
heading underline. Each project asset is stored in this folder with an `-ai`
suffix where applicable and retains its transparent alpha channel.
