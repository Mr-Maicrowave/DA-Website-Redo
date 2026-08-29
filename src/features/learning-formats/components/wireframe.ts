/**
 * TEMPORARY WIREFRAME STYLING TOKENS
 *
 * Neutral DA look: cream/white background, navy text, muted-gold accents,
 * simple borders. Deliberately plain — visual polish comes later and should
 * not require touching logic/state/config.
 *
 * Palette (from tailwind.config.ts brand.*):
 *   navy   #0A1B34    gold #D4AF37    ivory #F7F4EE
 */

export const WF = {
  page: "bg-brand-ivory text-brand-navy font-sans",
  container: "mx-auto w-full max-w-3xl px-4 sm:px-6",
  wideContainer: "mx-auto w-full max-w-5xl px-4 sm:px-6",
  card: "rounded-lg border border-brand-navy/15 bg-white p-5 sm:p-6",
  sectionKicker:
    "text-xs font-semibold uppercase tracking-[0.2em] text-brand-navy/50",
  sectionTitle: "font-heading text-2xl sm:text-3xl font-semibold text-brand-navy",
  h3: "font-heading text-xl font-semibold text-brand-navy",
  body: "text-sm sm:text-base text-brand-navy/75 leading-relaxed",
  // Selectable option (radio / checkbox row)
  option:
    "flex w-full items-start gap-3 rounded-md border p-3 text-left text-sm transition-colors cursor-pointer",
  optionIdle:
    "border-brand-navy/15 bg-white hover:border-brand-navy/40 hover:bg-brand-ivory",
  optionSelected: "border-brand-gold bg-brand-gold/10 ring-1 ring-brand-gold",
  // Buttons
  btnPrimary:
    "inline-flex items-center justify-center rounded-md bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-navy/90 disabled:cursor-not-allowed disabled:opacity-40",
  btnGhost:
    "inline-flex items-center justify-center rounded-md border border-brand-navy/25 px-4 py-2 text-sm font-medium text-brand-navy transition-colors hover:bg-brand-navy/5 disabled:cursor-not-allowed disabled:opacity-40",
  toggle:
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition-colors",
  toggleOn: "bg-brand-navy text-white",
  toggleOff: "bg-white text-brand-navy border border-brand-navy/20 hover:bg-brand-navy/5",
  chip: "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
} as const;
