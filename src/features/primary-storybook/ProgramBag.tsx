import { useState } from 'react';
import { primaryAssetManifest } from './primaryAssetManifest';
import { programChoices } from './referenceStoryData';
import { selectProgram, type ProgramId } from './programSelection';

const programNumbers = ['01', '02', '03'] as const;

const ProgramBag = () => {
  const [selectedProgram, setSelectedProgram] = useState<ProgramId>('small-group');

  const chooseProgram = (nextProgram: ProgramId) => {
    setSelectedProgram((currentProgram) => selectProgram(currentProgram, nextProgram));
  };

  return (
    <section
      id="programs"
      className="primary-program-bag"
      aria-labelledby="programs-title"
      data-primary-reference-section="programs"
    >
      <div className="primary-program-bag__intro">
        <p className="primary-program-bag__chapter">A place to belong</p>
        <h2 id="programs-title">Find their place.</h2>
        <p className="primary-program-bag__lead">
          Every child can find the support that suits how they learn best.
        </p>

        <div className="primary-program-bag__guide" aria-labelledby="program-guide-title">
          <h3 id="program-guide-title">What kind of support would help most right now?</h3>
          <ul>
            {programChoices.map((program, index) => (
              <li key={program.id} data-selected={selectedProgram === program.id}>
                <span aria-hidden="true">{programNumbers[index]}</span>
                <div>
                  <h4>{program.title}</h4>
                  <p>{program.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="primary-program-bag__stage">
        <div className="primary-program-bag__bag">
          <img
            className="primary-program-bag__bag-image"
            src={primaryAssetManifest.schoolbag}
            alt="A large blue and gold schoolbag"
            loading="lazy"
            decoding="async"
          />
          <img
            className="primary-program-bag__crest"
            src="/images/da-logo.png"
            alt="DA Tuition crest"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div
          className="primary-program-bag__controls"
          role="group"
          aria-label="Choose a primary tuition program"
        >
          {programChoices.map((program) => {
            const isSelected = selectedProgram === program.id;

            return (
              <button
                key={program.id}
                className={`primary-program-bag__control primary-program-bag__control--${program.id}`}
                type="button"
                aria-label={`${program.title}: ${program.description}`}
                aria-pressed={isSelected}
                onClick={() => chooseProgram(program.id)}
                onFocus={() => chooseProgram(program.id)}
                onPointerEnter={() => chooseProgram(program.id)}
              >
                <img
                  className="primary-program-bag__object"
                  src={program.asset}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
                <span>{program.title}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProgramBag;
