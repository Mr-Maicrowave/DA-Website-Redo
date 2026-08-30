/**
 * DEV-ONLY debug panel. Rendered only when import.meta.env.DEV is true, so it
 * is tree-shaken out of production builds.
 */

import { useState } from "react";

import type { LearningFormatsController } from "../state/useLearningFormatsState";

interface DebugPanelProps {
  controller: LearningFormatsController;
}

const DebugPanel = ({ controller }: DebugPanelProps) => {
  const [open, setOpen] = useState(false);
  const { state, bundle } = controller;

  return (
    <div className="fixed bottom-2 right-2 z-50 max-w-[92vw] font-mono text-xs">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="rounded bg-brand-navy px-3 py-1.5 font-semibold text-white shadow-lg"
      >
        {open ? "Hide" : "Show"} debug
      </button>
      {open && (
        <pre className="mt-2 max-h-[70vh] overflow-auto rounded bg-brand-navy p-3 text-[11px] leading-snug text-lime-300 shadow-xl">
          {JSON.stringify(
            {
              stage: state.stage,
              year: state.year,
              answers: state.answers,
              selectedSubjects: state.selectedSubjects,
              subjectAnswers: state.subjectAnswers,
              privateScore: bundle.signals.privateScore,
              classScore: bundle.signals.classScore,
              signals: bundle.signals,
              recommendation: bundle.recommendation,
            },
            null,
            2,
          )}
        </pre>
      )}
    </div>
  );
};

export default DebugPanel;
