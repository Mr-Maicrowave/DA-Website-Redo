import { forwardRef, type ComponentPropsWithoutRef } from "react";

export interface JourneyLayerProps
  extends ComponentPropsWithoutRef<"div"> {
  depth: string | number;
}

export const JourneyLayer = forwardRef<HTMLDivElement, JourneyLayerProps>(
  ({ depth, ...props }, ref) => <div ref={ref} {...props} data-depth={depth} />,
);

JourneyLayer.displayName = "JourneyLayer";
