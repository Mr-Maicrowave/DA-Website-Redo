import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, isAbsolute, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { journeyAssets, walkingFrames } from "./journeyAssets.ts";
import {
  getCharacterScreenProgress,
  getJourneyPhase,
  getWorldTravelProgress,
} from "./journeyModel.ts";

const publicDirectory = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../../../public",
);
const featureDirectory = dirname(fileURLToPath(import.meta.url));

test("journey manifest exposes replaceable character states and independent layers", () => {
  assert.ok(journeyAssets.character.idle);
  assert.ok(walkingFrames.length >= 6);

  for (const key of ["path", "flora", "objects", "trees", "distance"] as const) {
    assert.ok(journeyAssets[key].length > 0, `${key} must not be flattened away`);
  }

  assert.deepEqual(journeyAssets.classroom, [
    "/learning-journey/classroom/seated-student.webp",
    "/learning-journey/classroom/bench.webp",
    "/learning-journey/classroom/lamp.webp",
    "/learning-journey/classroom/books.webp",
  ]);
});

test("every journey manifest URL resolves to a generated public asset", () => {
  const urls = [
    journeyAssets.character.idle,
    ...walkingFrames,
    ...journeyAssets.path,
    ...journeyAssets.flora,
    ...journeyAssets.objects,
    ...journeyAssets.trees,
    ...journeyAssets.distance,
    ...journeyAssets.classroom,
  ];

  for (const url of urls) {
    assert.ok(
      url.startsWith("/learning-journey/"),
      `${url} must be a root-relative learning journey URL`,
    );

    const assetPath = resolve(publicDirectory, url.slice(1));
    const pathInsidePublic = relative(publicDirectory, assetPath);
    assert.ok(!isAbsolute(pathInsidePublic) && !pathInsidePublic.startsWith(".."), `${url} must resolve inside public/`);
    assert.ok(existsSync(assetPath), `${url} must exist under public/`);
  }
});

test("recommendation destinations expose three independent optimized scenes", () => {
  assert.deepEqual(Object.keys(journeyAssets.results), [
    "private",
    "smallGroup",
    "classEnvironment",
  ]);

  for (const destination of Object.values(journeyAssets.results)) {
    for (const srcSet of [destination.webp, destination.avif]) {
      const sources = srcSet.split(",").map((source) => source.trim());
      assert.equal(sources.length, 2);
      assert.ok(sources.some((source) => source.endsWith("768w")));
      assert.ok(sources.some((source) => source.endsWith("1536w")));
      for (const source of sources) {
        const url = source.split(" ")[0];
        assert.ok(
          existsSync(resolve(publicDirectory, url.slice(1))),
          `${url} must exist under public/`,
        );
      }
    }
  }
});

test("journey phases use the defined timing boundaries", () => {
  assert.equal(getJourneyPhase(0), "opening");
  assert.equal(getJourneyPhase(0.05), "opening");
  assert.equal(getJourneyPhase(0.1), "departure");
  assert.equal(getJourneyPhase(0.15), "departure");
  assert.equal(getJourneyPhase(0.2), "travel");
  assert.equal(getJourneyPhase(0.5), "travel");
  assert.equal(getJourneyPhase(0.65), "approach");
  assert.equal(getJourneyPhase(0.75), "approach");
  assert.equal(getJourneyPhase(0.85), "arrival");
  assert.equal(getJourneyPhase(0.92), "arrival");
  assert.equal(getJourneyPhase(1), "arrival");
});

test("journey timing clamps progress outside its range", () => {
  assert.equal(getJourneyPhase(-1), "opening");
  assert.equal(getJourneyPhase(2), "arrival");
  assert.equal(getCharacterScreenProgress(-1), 0);
  assert.equal(getCharacterScreenProgress(2), 1);
  assert.equal(getWorldTravelProgress(-1), 0);
  assert.equal(getWorldTravelProgress(2), 1);
});

test("character completes its screen movement at departure", () => {
  assert.equal(getCharacterScreenProgress(0), 0);
  assert.equal(getCharacterScreenProgress(0.1), 0.5);
  assert.equal(getCharacterScreenProgress(0.2), 1);
  assert.equal(getCharacterScreenProgress(0.7), 1);
});

test("world travel begins after departure and completes at arrival", () => {
  assert.equal(getWorldTravelProgress(0), 0);
  assert.equal(getWorldTravelProgress(0.2), 0);
  assert.ok(Math.abs(getWorldTravelProgress(0.6) - 0.5) < 1e-12);
  assert.equal(getWorldTravelProgress(1), 1);
});

test("journey component primitives preserve their rendering boundaries", () => {
  const layerPath = resolve(featureDirectory, "JourneyLayer.tsx");
  const characterPath = resolve(featureDirectory, "WalkingCharacter.tsx");
  const scenePath = resolve(featureDirectory, "JourneyScene.tsx");

  for (const filePath of [layerPath, characterPath, scenePath]) {
    assert.ok(existsSync(filePath), `${filePath} must exist`);
  }

  const layerSource = readFileSync(layerPath, "utf8");
  const characterSource = readFileSync(characterPath, "utf8");
  const sceneSource = readFileSync(scenePath, "utf8");

  assert.match(layerSource, /data-depth/);
  assert.match(characterSource, /data-journey-character-idle/);
  assert.match(characterSource, /data-journey-character-walking/);
  assert.match(characterSource, /aria-hidden/);
  assert.match(sceneSource, /id/);
  assert.match(sceneSource, /className/);
  assert.match(sceneSource, /children/);
});

test("journey world preserves every independently animatable composition target", () => {
  const worldPath = resolve(featureDirectory, "JourneyWorld.tsx");

  assert.ok(existsSync(worldPath), `${worldPath} must exist`);

  const worldSource = readFileSync(worldPath, "utf8");

  for (const target of [
    "distance",
    "middle",
    "path",
    "detail",
    "foreground",
  ]) {
    assert.match(
      worldSource,
      new RegExp(`data-journey-layer=[\\"']${target}[\\"']`),
      `${target} must remain an independently addressable journey layer`,
    );
  }

  assert.match(worldSource, /data-journey-signpost/);
  assert.match(worldSource, /\{academicEncounter\}/);
  assert.match(worldSource, /\{confidenceEncounter\}/);
  assert.match(worldSource, /\{learningHabitsEncounter\}/);
  assert.match(worldSource, /goalsEncounter/);
  assert.match(worldSource, /completion/);
});

test("academic level arrival is exact, semantic, and non-interactive", () => {
  const arrivalPath = resolve(featureDirectory, "AcademicLevelArrival.tsx");

  assert.ok(existsSync(arrivalPath), `${arrivalPath} must exist`);

  const arrivalSource = readFileSync(arrivalPath, "utf8");

  for (const copy of [
    "01 — ACADEMIC LEVEL",
    "Where is your child academically right now?",
    "Rebuilding foundations",
    "Around their year level",
    "Above their year level",
  ]) {
    assert.ok(arrivalSource.includes(copy), `missing required copy: ${copy}`);
  }

  assert.match(arrivalSource, /data-journey-academic-arrival/);
  assert.match(arrivalSource, /<article\b/);
  assert.match(arrivalSource, /<h2\b/);
  assert.match(arrivalSource, /<ul\b/);
  assert.equal((arrivalSource.match(/<li\b/g) ?? []).length, 3);
  assert.doesNotMatch(arrivalSource, /<button\b/);
  assert.doesNotMatch(arrivalSource, /on(?:Click|Change|KeyDown|PointerDown)=/);
});

test("journey styles provide a non-pinned reduced-motion document flow", () => {
  const stylesPath = resolve(featureDirectory, "learning-journey.css");

  assert.ok(existsSync(stylesPath), `${stylesPath} must exist`);

  const stylesSource = readFileSync(stylesPath, "utf8");

  assert.match(stylesSource, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(stylesSource, /data-journey-reduced-flow/);
  assert.match(stylesSource, /journey-world__track[\s\S]*max-width:\s*none/);
  assert.match(stylesSource, /position:\s*static/);
  assert.match(stylesSource, /transform:\s*none\s*!important/);
  assert.match(stylesSource, /transition:\s*none\s*!important/);
});

test("learning journey owns one pinned master timeline with the defined phases", () => {
  const componentPath = resolve(featureDirectory, "LearningJourney.tsx");

  assert.ok(existsSync(componentPath), `${componentPath} must exist`);

  const componentSource = readFileSync(componentPath, "utf8");

  assert.match(componentSource, /gsap\.registerPlugin\(ScrollTrigger\)/);
  assert.equal(
    (componentSource.match(/gsap\.timeline\s*\(\s*\{\s*scrollTrigger\s*:/gs) ?? []).length,
    1,
    "the feature must create exactly one scroll-controlled master timeline",
  );
  assert.match(componentSource, /gsap\.timeline\s*\(\s*\{\s*scrollTrigger\s*:/s);
  assert.match(componentSource, /pin:\s*(?:viewportRef\.current|true)/);
  assert.match(componentSource, /anticipatePin:\s*1/);
  assert.match(componentSource, /invalidateOnRefresh:\s*true/);
  assert.match(componentSource, /gsap\.matchMedia\(\)/);

  for (const [label, position] of [
    ["opening", "0"],
    ["departure", "0.05"],
    ["travel", "0.1"],
    ["approach", "0.25"],
    ["arrival", "0.28"],
    ["continuation-start", "0.34"],
    ["confidence-arrival", "0.48"],
    ["learning-habits-continuation", "0.54"],
    ["learning-habits-arrival", "0.65"],
    ["motivation-continuation", "0.74"],
    ["complete", "1"],
  ]) {
    assert.match(
      componentSource,
      new RegExp(`addLabel\\([\\"']${label}[\\"'],\\s*${position}\\)`),
      `missing ${label} phase label at ${position}`,
    );
  }
  assert.match(componentSource, /goals-hold/);
  assert.match(componentSource, /journey-completion/);
});

test("walking playback stays separate from outer camera movement and scroll-frame React state", () => {
  const componentPath = resolve(featureDirectory, "LearningJourney.tsx");
  const componentSource = readFileSync(componentPath, "utf8");

  assert.match(componentSource, /characterRef/);
  assert.match(componentSource, /walkFramesRef/);
  assert.match(componentSource, /x:\s*\(\)\s*=>\s*window\.innerWidth\s*\*\s*0\.28/);
  assert.match(componentSource, /steps\(/);
  assert.match(componentSource, /data-frame-index/);
  assert.match(componentSource, /onUpdate:\s*renderWalkFrame/);
  assert.doesNotMatch(componentSource, /onUpdate:\s*(?:\([^)]*\)|\w+)\s*=>[^}]*setEncounterPhase/s);
});

test("journey keeps semantic copy present and fully cleans up animation lifecycle", () => {
  const componentPath = resolve(featureDirectory, "LearningJourney.tsx");
  const componentSource = readFileSync(componentPath, "utf8");

  for (const copy of [
    "Every student learns differently.",
    "Let&apos;s find where your child thrives.",
    "A short journey. Thoughtful questions. A pathway that&apos;s uniquely theirs.",
    "Begin the journey →",
    "Scroll to begin ↓",
  ]) {
    assert.ok(componentSource.includes(copy), `missing required copy: ${copy}`);
  }

  assert.match(componentSource, /href=["']#journey-movement["']/);
  assert.match(componentSource, /\.decode\(\)/);
  assert.match(componentSource, /ScrollTrigger\.refresh\(\)/);
  assert.match(componentSource, /context\.revert\(\)/);
  assert.match(componentSource, /media\.revert\(\)/);
});

test("learning formats route composes the journey within its SEO and shared chrome", () => {
  const pagePath = resolve(featureDirectory, "../../pages/LearningFormats.tsx");

  assert.ok(existsSync(pagePath), `${pagePath} must exist`);

  const pageSource = readFileSync(pagePath, "utf8");

  assert.match(pageSource, /import LearningJourney from ["']@\/features\/learning-journey\/LearningJourney["'];/);
  assert.match(pageSource, /canonicalUrl=["']\/learning-formats["']/);
  assert.match(pageSource, /<NavigationNew\s*\/>/);
  assert.match(pageSource, /<LearningJourney\s*\/>/);
  assert.match(pageSource, /<FooterNew\s*\/>/);

  for (const retiredPageBody of [
    "MatchingEngine",
    "CaseStudiesSlider",
    "ComparisonTable",
    "PlacementAssessment",
  ]) {
    assert.doesNotMatch(
      pageSource,
      new RegExp(`\\b${retiredPageBody}\\b`),
      `${retiredPageBody} must not remain mounted on the learning formats route`,
    );
  }
});

test("Step 7 keeps destination, reasoning and practical result boundaries separate", () => {
  const files = [
    "LearningEnvironmentDestination.tsx",
    "RecommendationJourney.tsx",
    "RecommendationHero.tsx",
    "RecommendationReasons.tsx",
    "RecommendationPractical.tsx",
    "RecommendationResult.tsx",
  ];

  for (const file of files) {
    const path = resolve(featureDirectory, file);
    assert.ok(existsSync(path), `${file} must exist`);
    const source = readFileSync(path, "utf8");
    assert.doesNotMatch(
      source,
      /environment\.scores|direction\.scores|percentage|confidence meter/i,
      `${file} must not expose algorithm weights`,
    );
  }
});

test("recommendation world is spatial, semantic and independently animatable", () => {
  const destination = readFileSync(
    resolve(featureDirectory, "LearningEnvironmentDestination.tsx"),
    "utf8",
  );
  const journey = readFileSync(
    resolve(featureDirectory, "RecommendationJourney.tsx"),
    "utf8",
  );

  assert.match(destination, /<figure/);
  assert.match(destination, /<picture/);
  assert.match(destination, /data-environment-destination/);
  assert.match(destination, /data-destination-state/);
  assert.match(destination, /data-destination-route-target/);
  assert.match(journey, /data-recommendation-journey/);
  assert.match(journey, /data-recommendation-route/);
  assert.match(journey, /data-recommendation-status/);
  assert.match(journey, /environmentOrder\.map/);
  assert.doesNotMatch(journey, /Card|Dialog|Modal/);
});

test("completed answers drive a named, accessible cinematic recommendation reveal", () => {
  const source = readFileSync(
    resolve(featureDirectory, "LearningJourney.tsx"),
    "utf8",
  );

  assert.match(source, /calculateLearningRecommendation\(answers\)/);
  assert.match(source, /isCompleteAssessment\(answers\)/);
  assert.match(source, /RecommendationJourney/);
  assert.match(source, /RecommendationResult/);
  for (const phase of [
    "quiet",
    "memory",
    "path",
    "destinations",
    "resolve",
    "arrived",
    "direction",
    "editorial",
  ]) {
    assert.match(source, new RegExp(`setRevealPhase\\("${phase}"\\)`));
  }
  assert.match(source, /data-recommendation-heading/);
  assert.match(source, /\.focus\(\)/);
  assert.match(source, /prefers-reduced-motion/);
});

test("editorial result explains the pathway and preserves human confirmation", () => {
  const hero = readFileSync(
    resolve(featureDirectory, "RecommendationHero.tsx"),
    "utf8",
  );
  const reasons = readFileSync(
    resolve(featureDirectory, "RecommendationReasons.tsx"),
    "utf8",
  );
  const practical = readFileSync(
    resolve(featureDirectory, "RecommendationPractical.tsx"),
    "utf8",
  );
  const result = readFileSync(
    resolve(featureDirectory, "RecommendationResult.tsx"),
    "utf8",
  );

  assert.match(hero, /YOUR LEARNING ENVIRONMENT/);
  assert.match(hero, /LEARNING DIRECTION/);
  assert.match(hero, /YOUR STARTING PATHWAY/);
  assert.match(hero, /we(?:&apos;|')d explore/);
  assert.match(reasons, /WHY THIS PATH MAY FIT/);
  assert.match(reasons, /data-answer-observation/);
  assert.match(practical, /WHAT THIS COULD LOOK LIKE AT DA/);
  assert.match(practical, /ALSO WORTH EXPLORING/);
  assert.match(practical, /THIS IS A STARTING POINT\./);
  assert.match(practical, /href="\/book-interview"/);
  assert.match(practical, /href="#all-learning-formats"/);
  assert.match(practical, /id="all-learning-formats"/);
  assert.match(result, /id="learning-pathway-result"/);
});
