# HSC Journey Film Design

The existing HSC hero and all detailed program content remain unchanged. Immediately below the hero, `HSCJourneyFilm` replaces the current multi-section vision story with one pinned `100svh` stage driven by one GSAP timeline and one ScrollTrigger.

The stage keeps one graduation-cap element alive for the full journey. Nine environment groups remain mounted as spatial layers inside one camera/world coordinate system; they are revealed by camera travel, object passes, clipping masks, and depth motion rather than full-frame crossfades. A single SVG gold guidance path begins at DA support and remains visible through the future landscape.

Scene assets are mapped by folder: `01-begin` desk objects, `02-workload` calendar/book/papers, `03-pressure` assessment/trials/clock/equations, `04-support` DA planning materials, `05-improvement` marked work/feedback/goal/chart, `06-trials` three-depth exam hall, `07-hsc` paper/pen/texture, `08-release` sky/cloud/splash layers, and `09-future` skyline/university/landscape/paths/clouds. The shared `cap.png` is the only cap element.

Desktop and tablet use the pinned master timeline. Mobile retains the pinned narrative with fewer objects and smaller transforms. `prefers-reduced-motion` replaces the long pin with a semantic vertical sequence of nine static checkpoints. Critical early assets preload and decode before the timeline becomes visible; later images use eager browser loading because they are already part of the pinned stage. GSAP contexts, media queries, and ScrollTrigger instances are reverted on unmount.

