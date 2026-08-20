import { useEffect, useMemo, useState } from 'react';
import {
  BOOK_INTRO_CALIBRATION_PAIRS,
  BOOK_INTRO_SCENE_CALIBRATION,
} from '@/data/bookIntroCalibration';
import styles from './BookIntroCalibration.module.css';

type CalibrationValues = {
  scale: number;
  translateX: number;
  translateY: number;
  objectPositionX: number;
  objectPositionY: number;
  opacity: number;
};

const pairs = BOOK_INTRO_CALIBRATION_PAIRS;

const initialValues = (pairId: string): CalibrationValues => {
  const pair = pairs.find(candidate => candidate.id === pairId) ?? pairs[0];
  const calibratedScene = BOOK_INTRO_SCENE_CALIBRATION[pair.calibrated];

  return {
    scale: calibratedScene.scale,
    translateX: calibratedScene.x,
    translateY: calibratedScene.y,
    objectPositionX: calibratedScene.objectPositionX,
    objectPositionY: calibratedScene.objectPositionY,
    opacity: 0.5,
  };
};

const BookIntroCalibration = () => {
  const [selectedPairId, setSelectedPairId] = useState<string>(pairs[0].id);
  const [valuesByPair, setValuesByPair] = useState<Record<string, CalibrationValues>>(
    () => Object.fromEntries(pairs.map(pair => [pair.id, initialValues(pair.id)])),
  );
  const [copied, setCopied] = useState(false);

  const selectedPair = pairs.find(pair => pair.id === selectedPairId) ?? pairs[0];
  const values = valuesByPair[selectedPair.id];

  useEffect(() => {
    const hiddenElements = Array.from(
      document.querySelectorAll<HTMLElement>('nav, .site-sticky-book-button'),
    ).map(element => ({ element, hidden: element.hidden, inert: element.inert }));

    hiddenElements.forEach(({ element }) => {
      element.hidden = true;
      element.inert = true;
    });

    return () => {
      hiddenElements.forEach(({ element, hidden, inert }) => {
        element.hidden = hidden;
        element.inert = inert;
      });
    };
  }, []);

  const updateValue = (key: keyof CalibrationValues, value: number) => {
    setCopied(false);
    setValuesByPair(current => ({
      ...current,
      [selectedPair.id]: {
        ...current[selectedPair.id],
        [key]: value,
      },
    }));
  };

  const configuration = useMemo(
    () => Object.fromEntries(
      pairs.map(pair => [
        pair.id,
        {
          reference: pair.reference,
          calibrated: pair.calibrated,
          ...valuesByPair[pair.id],
        },
      ]),
    ),
    [valuesByPair],
  );

  const configurationText = `export const BOOK_INTRO_CALIBRATION = ${JSON.stringify(configuration, null, 2)} as const;`;

  const copyConfiguration = async () => {
    await navigator.clipboard.writeText(configurationText);
    setCopied(true);
  };

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.kicker}>Temporary developer tool</p>
          <h1>BookIntro frame calibration</h1>
          <p>Align each cinematic keyframe against the image immediately before it.</p>
        </div>

        <label className={styles.pairSelect}>
          Image pair
          <select value={selectedPairId} onChange={event => setSelectedPairId(event.target.value)}>
            {pairs.map((pair, index) => (
              <option key={pair.id} value={pair.id}>
                {index + 1}. {BOOK_INTRO_SCENE_CALIBRATION[pair.reference].src.split('/').at(-1)} →{' '}
                {BOOK_INTRO_SCENE_CALIBRATION[pair.calibrated].src.split('/').at(-1)}
              </option>
            ))}
          </select>
        </label>
      </header>

      <section className={styles.workspace} aria-label="Image calibration workspace">
        <div className={styles.viewport}>
          <img
            className={styles.referenceImage}
            src={BOOK_INTRO_SCENE_CALIBRATION[selectedPair.reference].src}
            alt={`Reference frame: ${BOOK_INTRO_SCENE_CALIBRATION[selectedPair.reference].src}`}
          />
          <img
            className={styles.calibratedImage}
            src={BOOK_INTRO_SCENE_CALIBRATION[selectedPair.calibrated].src}
            alt={`Frame being calibrated: ${BOOK_INTRO_SCENE_CALIBRATION[selectedPair.calibrated].src}`}
            style={{
              opacity: values.opacity,
              objectPosition: `${values.objectPositionX}% ${values.objectPositionY}%`,
              transform: `translate3d(${values.translateX}px, ${values.translateY}px, 0) scale(${values.scale})`,
            }}
          />
          <div className={styles.crosshair} aria-hidden="true" />
          <div className={styles.frameLabels} aria-hidden="true">
            <span>Reference: {BOOK_INTRO_SCENE_CALIBRATION[selectedPair.reference].src.split('/').at(-1)}</span>
            <span>Calibrating: {BOOK_INTRO_SCENE_CALIBRATION[selectedPair.calibrated].src.split('/').at(-1)}</span>
          </div>
        </div>

        <aside className={styles.controls} aria-label="Calibration controls">
          <CalibrationControl
            label="Scale"
            value={values.scale}
            min={0.5}
            max={1.5}
            step={0.001}
            onChange={value => updateValue('scale', value)}
          />
          <CalibrationControl
            label="Translate X"
            value={values.translateX}
            min={-400}
            max={400}
            step={1}
            suffix="px"
            onChange={value => updateValue('translateX', value)}
          />
          <CalibrationControl
            label="Translate Y"
            value={values.translateY}
            min={-300}
            max={300}
            step={1}
            suffix="px"
            onChange={value => updateValue('translateY', value)}
          />
          <CalibrationControl
            label="Object-position X"
            value={values.objectPositionX}
            min={0}
            max={100}
            step={0.1}
            suffix="%"
            onChange={value => updateValue('objectPositionX', value)}
          />
          <CalibrationControl
            label="Object-position Y"
            value={values.objectPositionY}
            min={0}
            max={100}
            step={0.1}
            suffix="%"
            onChange={value => updateValue('objectPositionY', value)}
          />
          <CalibrationControl
            label="Opacity"
            value={values.opacity}
            min={0}
            max={1}
            step={0.01}
            onChange={value => updateValue('opacity', value)}
          />
          <button
            type="button"
            className={styles.resetButton}
            onClick={() => {
              setCopied(false);
              setValuesByPair(current => ({ ...current, [selectedPair.id]: initialValues(selectedPair.id) }));
            }}
          >
            Reset selected pair
          </button>
        </aside>
      </section>

      <section className={styles.output} aria-labelledby="calibration-output-title">
        <div className={styles.outputHeader}>
          <h2 id="calibration-output-title">Configuration</h2>
          <button type="button" onClick={copyConfiguration}>
            {copied ? 'Copied' : 'Copy configuration'}
          </button>
        </div>
        <textarea readOnly spellCheck={false} value={configurationText} aria-label="Calibration configuration object" />
      </section>
    </main>
  );
};

type CalibrationControlProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  onChange: (value: number) => void;
};

const CalibrationControl = ({
  label,
  value,
  min,
  max,
  step,
  suffix = '',
  onChange,
}: CalibrationControlProps) => {
  const id = `calibration-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={styles.control}>
      <label htmlFor={id}>{label}</label>
      <output htmlFor={id}>{value}{suffix}</output>
      <input
        id={id}
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={event => onChange(Number(event.target.value))}
      />
      <input
        type="number"
        aria-label={`${label} numeric value`}
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={event => onChange(Number(event.target.value))}
      />
    </div>
  );
};

export default BookIntroCalibration;
