/**
 * The walking student. Always faces right. `data-state` switches between the
 * walking cycle and idle — toggled imperatively by the motion hook (never via
 * React state, to keep it off the render path).
 *
 * Positioning + path-following is done by GSAP MotionPathPlugin on the wrapper
 * in useJourneyMotion; this component only draws the figure and its gait.
 */

import { forwardRef } from "react";

import { cn } from "@/lib/utils";

interface WalkingCharacterProps {
  className?: string;
}

const WalkingCharacter = forwardRef<HTMLDivElement, WalkingCharacterProps>(
  ({ className }, ref) => (
    <div
      ref={ref}
      className={cn("lf-character", className)}
      data-state="idle"
      aria-hidden="true"
    >
      <svg viewBox="0 0 48 64" width="44" height="60">
        {/* backpack */}
        <rect x="9" y="24" width="10" height="16" rx="3" className="lf-ch-pack" />
        {/* back leg */}
        <g className="lf-ch-leg lf-ch-leg--back">
          <rect x="20" y="40" width="5" height="18" rx="2.5" />
        </g>
        {/* front leg */}
        <g className="lf-ch-leg lf-ch-leg--front">
          <rect x="23" y="40" width="5" height="18" rx="2.5" />
        </g>
        {/* body */}
        <path
          d="M17 22h9a6 6 0 0 1 6 6v10a4 4 0 0 1-4 4h-9a4 4 0 0 1-4-4V28a6 6 0 0 1 6-6Z"
          className="lf-ch-body"
        />
        {/* swinging arm */}
        <g className="lf-ch-arm">
          <rect x="26" y="24" width="4.5" height="15" rx="2.25" />
        </g>
        {/* head */}
        <circle cx="27" cy="13" r="8" className="lf-ch-head" />
        {/* nose / facing cue (points right) */}
        <circle cx="34" cy="13" r="1.6" className="lf-ch-face" />
      </svg>
    </div>
  ),
);

WalkingCharacter.displayName = "WalkingCharacter";

export default WalkingCharacter;
