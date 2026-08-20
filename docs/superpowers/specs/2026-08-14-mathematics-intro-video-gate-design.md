# Mathematics Intro Video Gate Design

## Goal

Present the supplied eight-second Mathematics introduction every time a visitor enters `/subjects/mathematics`, before they can interact with the page.

## Experience

- The video is served as `public/math_intro_video.mp4` and rendered in a fixed, full-viewport overlay.
- Playback begins automatically with audio enabled where the browser permits it; browser autoplay restrictions may require a single user gesture to start audio playback.
- While the overlay is present, the Mathematics page cannot be scrolled or interacted with. The overlay remains above site navigation, floating controls, and the page footer.
- A clearly labelled `Skip intro` control is available from the start. Choosing it immediately dismisses the overlay and restores normal page interaction.
- When playback ends normally, the overlay dismisses and restores normal page interaction.
- The video is shown on every fresh visit to the Mathematics route. No completion state is stored in local storage or cookies.

## Safety and Failure Handling

- The browser and operating system controls cannot be blocked; the gate only controls interactions inside the site.
- If the video fails to load or cannot play, the overlay releases the page rather than trapping the visitor.
- Keyboard focus remains within the overlay while it is active. Escape does not dismiss it, because the explicit Skip control is the exit route.
- The component restores the document's original scroll-lock state when it closes or unmounts.

## Implementation Boundary

- Add a focused `MathsIntroVideoGate` feature component and a small test suite for its route-entry, completion, skip, and scroll-lock contracts.
- Mount it only from `src/pages/subjects/Mathematics.tsx`.
- Do not alter existing Mathematics teaching content, routing, or global navigation behaviour.

## Verification

- Automated tests cover the component contract and source integration.
- Run the focused feature tests, TypeScript typecheck, and production build.
- Verify in a browser at `/subjects/mathematics`: the gate appears on each route entry, locks scroll, skip works immediately, and ending the video restores normal interaction.
