import {
  forwardRef,
  type Ref,
  type ComponentPropsWithoutRef,
} from "react";

export interface WalkingCharacterProps
  extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  idleSrc: string;
  walkingFrames: readonly string[];
  walkFramesRef?: Ref<HTMLDivElement>;
  alt?: string;
}

export const WalkingCharacter = forwardRef<
  HTMLDivElement,
  WalkingCharacterProps
>(
  (
    {
      idleSrc,
      walkingFrames,
      walkFramesRef,
      alt = "Student walking along a learning journey",
      ...props
    },
    ref,
  ) => (
    <div ref={ref} {...props} data-journey-character>
      <img src={idleSrc} alt={alt} className="sr-only" />
      <div data-journey-character-idle aria-hidden="true">
        <img src={idleSrc} alt="" />
      </div>
      <div
        ref={walkFramesRef}
        data-journey-character-walking
        aria-hidden="true"
      >
        {walkingFrames.map((src, index) => (
          <img
            key={src}
            src={src}
            alt=""
            aria-hidden="true"
            data-frame-index={index}
          />
        ))}
      </div>
    </div>
  ),
);

WalkingCharacter.displayName = "WalkingCharacter";
