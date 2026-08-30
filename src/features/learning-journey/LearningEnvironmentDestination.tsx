import { environmentConfig } from "./recommendationConfig";
import { journeyAssets } from "./journeyAssets";
import type { EnvironmentId } from "./recommendationTypes";

export type DestinationState = "distant" | "primary" | "secondary";

interface LearningEnvironmentDestinationProps {
  environment: EnvironmentId;
  state: DestinationState;
}

const assetKeys: Record<EnvironmentId, keyof typeof journeyAssets.results> = {
  private: "private",
  "small-group": "smallGroup",
  class: "classEnvironment",
};

export const LearningEnvironmentDestination = ({
  environment,
  state,
}: LearningEnvironmentDestinationProps) => {
  const definition = environmentConfig[environment];
  const asset = journeyAssets.results[assetKeys[environment]];

  return (
    <figure
      className={`learning-destination learning-destination--${environment}`}
      data-environment-destination
      data-destination-id={environment}
      data-destination-state={state}
      aria-label={`${definition.label}${state === "primary" ? ", suggested starting point" : ""}`}
    >
      <span className="learning-destination__route-target" data-destination-route-target aria-hidden="true" />
      <div className="learning-destination__art">
        <span className="learning-destination__warmth" aria-hidden="true" />
        <picture>
          <source type="image/avif" srcSet={asset.avif} sizes="(max-width: 640px) 82vw, 34vw" />
          <source type="image/webp" srcSet={asset.webp} sizes="(max-width: 640px) 82vw, 34vw" />
          <img
            src={asset.src}
            alt={definition.illustrationAlt}
            width={asset.width}
            height={asset.height}
            loading="lazy"
            decoding="async"
          />
        </picture>
        <span className="learning-destination__foliage" aria-hidden="true" />
        <span className="learning-destination__book" aria-hidden="true" />
      </div>
      <figcaption>
        <span>{definition.shortLabel}</span>
        <strong>{definition.label}</strong>
      </figcaption>
    </figure>
  );
};
