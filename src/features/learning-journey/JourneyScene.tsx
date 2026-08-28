import { type ComponentPropsWithoutRef, type ReactNode } from "react";

export interface JourneySceneProps
  extends ComponentPropsWithoutRef<"section"> {
  id: string;
  children: ReactNode;
}

export const JourneyScene = ({
  id,
  className,
  children,
  ...props
}: JourneySceneProps) => (
  <section id={id} className={className} {...props}>
    {children}
  </section>
);
