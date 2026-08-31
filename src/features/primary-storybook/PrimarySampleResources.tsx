import { useEffect, useRef, useState } from 'react';
import { ExternalLink, ShieldCheck, X } from 'lucide-react';
import './primary-sample-resources.css';

const studentBookletPdf: string | null = null;
const parentReportPdf: string | null = null;

type ResourceKey = 'work' | 'report';

const resources = {
  work: {
    modalTitle: 'Sample Student Work',
    label: 'SAMPLE STUDENT WORK',
    pdf: studentBookletPdf,
  },
  report: {
    modalTitle: 'Sample Parent Report',
    label: 'SAMPLE PARENT REPORT',
    pdf: parentReportPdf,
  },
} satisfies Record<ResourceKey, { modalTitle: string; label: string; pdf: string | null }>;

const PrimarySampleResources = () => {
  const [activeResource, setActiveResource] = useState<ResourceKey | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const returnFocusRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (activeResource && !dialog.open) dialog.showModal();
    if (!activeResource && dialog.open) dialog.close();
  }, [activeResource]);

  const openResource = (resource: ResourceKey, trigger: HTMLButtonElement) => {
    returnFocusRef.current = trigger;
    setActiveResource(resource);
  };

  const closeResource = () => {
    setActiveResource(null);
    window.requestAnimationFrame(() => returnFocusRef.current?.focus());
  };

  const trapFocus = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeResource();
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], iframe, [tabindex]:not([tabindex="-1"])',
    );
    if (!focusable?.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const active = activeResource ? resources[activeResource] : null;

  return (
    <section className="primary-samples" aria-labelledby="primary-samples-title">
      <div className="primary-samples__inner">
        <header className="primary-samples__header">
          <p className="primary-samples__eyebrow">A CLOSER LOOK</p>
          <h2 id="primary-samples-title">
            Don’t just take our word for it.
            <span>See what learning looks like.</span>
          </h2>
          <div className="primary-samples__rule" aria-hidden="true" />
          <p>From the work your child completes to the feedback you receive along the way.</p>
        </header>

        <div className="primary-samples__showcases">
          <article className="primary-samples__showcase primary-samples__showcase--work">
            <div className="primary-samples__copy">
              <p className="primary-samples__kicker"><span>01</span> WHAT THEY WORK THROUGH</p>
              <h3>Their learning.</h3>
              <p>Explore a sample of the theory, examples, practice and questions students work through.</p>
              <button type="button" onClick={(event) => openResource('work', event.currentTarget)}>
                VIEW SAMPLE WORK <ExternalLink aria-hidden="true" />
              </button>
            </div>
            <div className="primary-samples__booklet" aria-label="Sample student work placeholder">
              <div className="primary-samples__page primary-samples__page--back" aria-hidden="true" />
              <div className="primary-samples__page primary-samples__page--middle" aria-hidden="true" />
              <div className="primary-samples__page primary-samples__page--front">
                <span>SAMPLE STUDENT WORK</span>
                <small>PDF preview coming soon</small>
                <i aria-hidden="true" />
              </div>
            </div>
          </article>

          <article className="primary-samples__showcase primary-samples__showcase--report">
            <div className="primary-samples__copy">
              <p className="primary-samples__kicker"><span>02</span> WHAT YOU CAN SEE</p>
              <h3>Their progress.</h3>
              <p>See how learning and progress can be communicated back to parents.</p>
              <button type="button" onClick={(event) => openResource('report', event.currentTarget)}>
                VIEW SAMPLE REPORT <ExternalLink aria-hidden="true" />
              </button>
            </div>
            <div className="primary-samples__report" aria-label="Sample parent report placeholder">
              <div className="primary-samples__report-heading">
                <span>SAMPLE PARENT REPORT</span>
                <small>PDF preview coming soon</small>
              </div>
              <div className="primary-samples__report-line" aria-hidden="true" />
              <div className="primary-samples__report-fields" aria-hidden="true">
                <i /><i /><i /><i />
              </div>
              <span className="primary-samples__tick" aria-hidden="true">✓</span>
            </div>
          </article>
        </div>

        <p className="primary-samples__promise">
          <ShieldCheck aria-hidden="true" />
          <span>Learning you can see.</span> <em>Progress you can follow.</em>
        </p>
      </div>

      <dialog
        ref={dialogRef}
        className="primary-samples__dialog"
        aria-modal="true"
        aria-labelledby="primary-samples-dialog-title"
        onCancel={(event) => {
          event.preventDefault();
          closeResource();
        }}
        onClick={(event) => {
          if (event.target === dialogRef.current) closeResource();
        }}
        onKeyDown={trapFocus}
      >
        {active && (
          <div className="primary-samples__dialog-panel">
            <button className="primary-samples__dialog-close" type="button" onClick={closeResource} aria-label="Close preview">
              <X aria-hidden="true" />
            </button>
            <p>A CLOSER LOOK</p>
            <h2 id="primary-samples-dialog-title">{active.modalTitle}</h2>
            {active.pdf ? (
              <iframe title={active.modalTitle} src={active.pdf} />
            ) : (
              <div className="primary-samples__dialog-placeholder">
                <span>{active.label}</span>
                <strong>PDF coming soon</strong>
                <p>We’re preparing a clear example for families to explore.</p>
              </div>
            )}
            <button type="button" className="primary-samples__dialog-dismiss" onClick={closeResource}>CLOSE</button>
          </div>
        )}
      </dialog>
    </section>
  );
};

export default PrimarySampleResources;
