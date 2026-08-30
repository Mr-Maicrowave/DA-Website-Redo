import { type ReactNode } from "react";

import { JourneyLayer } from "./JourneyLayer";
import { journeyAssets } from "./journeyAssets";
import "./learning-journey.css";

const decorativeImageProps = {
  alt: "",
  "aria-hidden": true,
} as const;

interface JourneyWorldProps {
  academicEncounter: ReactNode;
  confidenceEncounter: ReactNode;
  learningHabitsEncounter: ReactNode;
  motivationEncounter: ReactNode;
  goalsEncounter: ReactNode;
  completion: ReactNode;
  recommendationJourney?: ReactNode;
}

export const JourneyWorld = ({
  academicEncounter,
  confidenceEncounter,
  learningHabitsEncounter,
  motivationEncounter,
  goalsEncounter,
  completion,
  recommendationJourney,
}: JourneyWorldProps) => (
  <div
    className="journey-world"
    data-journey-world
    data-journey-reduced-flow
  >
    <div className="journey-world__track" data-journey-world-track>
      <div className="journey-world__ground-line" aria-hidden="true" />

      <JourneyLayer
        depth={0.72}
        className="journey-world__layer journey-world__layer--distance"
        data-journey-layer="distance"
      >
        <img
          {...decorativeImageProps}
          src={journeyAssets.distance[0]}
          className="journey-art journey-art--academy"
        />
      </JourneyLayer>

      <JourneyLayer
        depth={0.9}
        className="journey-world__layer journey-world__layer--middle"
        data-journey-layer="middle"
      >
        <img
          {...decorativeImageProps}
          src={journeyAssets.trees[0]}
          className="journey-art journey-art--oak"
        />
        <img
          {...decorativeImageProps}
          src={journeyAssets.trees[1]}
          className="journey-art journey-art--daisy-tree"
        />
        <img
          {...decorativeImageProps}
          src={journeyAssets.trees[2]}
          className="journey-art journey-art--cypress"
        />
      </JourneyLayer>

      <JourneyLayer
        depth={1}
        className="journey-world__layer journey-world__layer--path"
        data-journey-layer="path"
      >
        <img
          {...decorativeImageProps}
          src={journeyAssets.path[0]}
          className="journey-art journey-art--path journey-art--path-1"
        />
        <img
          {...decorativeImageProps}
          src={journeyAssets.path[1]}
          className="journey-art journey-art--path journey-art--path-2"
        />
        <img
          {...decorativeImageProps}
          src={journeyAssets.path[2]}
          className="journey-art journey-art--path journey-art--path-3"
        />
        <img
          {...decorativeImageProps}
          src={journeyAssets.path[0]}
          className="journey-art journey-art--path journey-art--path-4"
        />
        <img
          {...decorativeImageProps}
          src={journeyAssets.path[1]}
          className="journey-art journey-art--path journey-art--path-5"
        />
        <img
          {...decorativeImageProps}
          src={journeyAssets.path[2]}
          className="journey-art journey-art--path journey-art--path-6"
        />
        <img {...decorativeImageProps} src={journeyAssets.path[0]} className="journey-art journey-art--path journey-art--path-7" />
        <img {...decorativeImageProps} src={journeyAssets.path[1]} className="journey-art journey-art--path journey-art--path-8" />
        <img {...decorativeImageProps} src={journeyAssets.path[2]} className="journey-art journey-art--path journey-art--path-9" />
      </JourneyLayer>

      <JourneyLayer
        depth={1}
        className="journey-world__layer journey-world__layer--detail"
        data-journey-layer="detail"
      >
        <img
          {...decorativeImageProps}
          src={journeyAssets.objects[1]}
          className="journey-art journey-art--books"
        />
        <img
          {...decorativeImageProps}
          src={journeyAssets.objects[0]}
          className="journey-art journey-art--signpost"
          data-journey-signpost
        />
        <img
          {...decorativeImageProps}
          src={journeyAssets.objects[2]}
          className="journey-art journey-art--open-book"
        />
      </JourneyLayer>

      <JourneyLayer
        depth={1.08}
        className="journey-world__layer journey-world__layer--foreground"
        data-journey-layer="foreground"
      >
        <img
          {...decorativeImageProps}
          src={journeyAssets.flora[0]}
          className="journey-art journey-art--wildflowers"
        />
        <img
          {...decorativeImageProps}
          src={journeyAssets.flora[1]}
          className="journey-art journey-art--lavender"
        />
        <img
          {...decorativeImageProps}
          src={journeyAssets.flora[2]}
          className="journey-art journey-art--rocks"
        />
      </JourneyLayer>

      {academicEncounter}
      {confidenceEncounter}
      {learningHabitsEncounter}
      {motivationEncounter}
      {goalsEncounter}
      {completion}
      {recommendationJourney}
    </div>
  </div>
);
