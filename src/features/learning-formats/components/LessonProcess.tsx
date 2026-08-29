/**
 * SECTION 01 — "How learning works at DA"
 *
 * Educational only. Self-contained local state; does NOT touch the assessment.
 * Includes a functional representation of the private "understanding loop".
 */

import { useState } from "react";

import { cn } from "@/lib/utils";
import { LESSON_PROCESSES, PRIVATE_LOOP } from "../config/lessonProcess";
import type { Environment } from "../logic/types";
import LessonFormatToggle from "./LessonFormatToggle";
import { WF } from "./wireframe";

const PrivateLoop = () => {
  const [understood, setUnderstood] = useState<boolean | null>(null);

  return (
    <div className={cn(WF.card, "mt-4 border-brand-navy/10 bg-brand-ivory")}>
      <p className={WF.sectionKicker}>The understanding loop</p>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm font-medium text-brand-navy">
        {PRIVATE_LOOP.cycle.map((node, i) => (
          <span key={node} className="flex items-center gap-2">
            <span className="rounded-md border border-brand-navy/20 bg-white px-2.5 py-1">
              {node}
            </span>
            {i < PRIVATE_LOOP.cycle.length - 1 && (
              <span aria-hidden className="text-brand-navy/40">
                →
              </span>
            )}
          </span>
        ))}
      </div>

      <p className={cn(WF.body, "mt-4")}>
        At the <strong>Check</strong> step, did the student actually understand?
      </p>
      <div className="mt-2 flex gap-2" role="radiogroup" aria-label="Check outcome">
        <button
          type="button"
          role="radio"
          aria-checked={understood === true}
          className={cn(
            WF.toggle,
            understood === true ? WF.toggleOn : WF.toggleOff,
          )}
          onClick={() => setUnderstood(true)}
        >
          {PRIVATE_LOOP.understood.label}
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={understood === false}
          className={cn(
            WF.toggle,
            understood === false ? WF.toggleOn : WF.toggleOff,
          )}
          onClick={() => setUnderstood(false)}
        >
          {PRIVATE_LOOP.notUnderstood.label}
        </button>
      </div>

      {understood !== null && (
        <p className={cn(WF.body, "mt-3 font-medium text-brand-navy")}>
          {understood
            ? PRIVATE_LOOP.understood.outcome
            : PRIVATE_LOOP.notUnderstood.outcome}
        </p>
      )}
    </div>
  );
};

const LessonProcess = () => {
  const [format, setFormat] = useState<Environment>("private");
  const content = LESSON_PROCESSES[format];

  return (
    <div>
      <LessonFormatToggle value={format} onChange={setFormat} />
      <p className={cn(WF.body, "mt-3")}>{content.intro}</p>

      <ol className="mt-4 grid gap-2 sm:grid-cols-2">
        {content.steps.map((step) => (
          <li
            key={step.number}
            className="rounded-md border border-brand-navy/15 bg-white p-3"
          >
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-lg font-semibold text-brand-gold">
                {step.number}
              </span>
              <span className="font-semibold text-brand-navy">
                {step.title}
              </span>
            </div>
            <p className="mt-1 text-sm text-brand-navy/70">{step.detail}</p>
          </li>
        ))}
      </ol>

      {format === "private" && <PrivateLoop />}
    </div>
  );
};

export default LessonProcess;
