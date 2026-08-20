import { useState } from 'react';
import { expressionToLatex } from './equation-format';
import { LatexEquation } from './LatexEquation';

type ExpressionEditorProps = {
  id: string;
  value: string;
  invalid: boolean;
  describedBy?: string;
  label: string;
  onChange: (value: string) => void;
  displayLatex?: string;
  readOnly?: boolean;
};

export const ExpressionEditor = ({
  id,
  value,
  invalid,
  describedBy,
  label,
  onChange,
  displayLatex,
  readOnly = false,
}: ExpressionEditorProps) => {
  const [editing, setEditing] = useState(false);

  if (readOnly) {
    return (
      <div
        id={id}
        aria-label={label}
        className="flex h-11 min-w-0 flex-1 items-center overflow-x-auto rounded-lg border border-[#071629]/20 bg-white px-3 text-sm text-[#172033] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <LatexEquation latex={displayLatex ?? expressionToLatex(value)} className="whitespace-nowrap [&_.katex]:text-inherit" />
      </div>
    );
  }

  if (editing) {
    return (
      <div className="min-w-0 flex-1">
        <input
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={() => setEditing(false)}
          aria-label={label}
          aria-describedby={describedBy}
          aria-invalid={invalid}
          autoFocus
          spellCheck={false}
          className="h-11 w-full rounded-lg border border-[#071629]/20 px-3 font-mono text-sm text-[#172033] outline-none transition-colors focus:border-[#5d568e] focus:ring-2 focus:ring-[#5d568e]/20 aria-[invalid=true]:border-[#a52d43]"
        />
        <div className="mt-1.5 min-h-7 overflow-x-auto rounded-md bg-[#f3f7fb] px-2 py-1 text-sm text-[#40516b]" aria-label="Typeset preview">
          <LatexEquation latex={expressionToLatex(value)} className="whitespace-nowrap [&_.katex]:text-inherit" />
        </div>
      </div>
    );
  }

  return (
    <button
      id={id}
      type="button"
      onClick={() => setEditing(true)}
      aria-label={`${label}. Click to edit.`}
      aria-describedby={describedBy}
      aria-invalid={invalid}
      className="flex h-11 min-w-0 flex-1 items-center overflow-x-auto rounded-lg border border-[#071629]/20 bg-white px-3 text-left text-sm text-[#172033] outline-none transition-colors [scrollbar-width:none] hover:border-[#5d568e] focus-visible:border-[#5d568e] focus-visible:ring-2 focus-visible:ring-[#5d568e]/20 aria-[invalid=true]:border-[#a52d43] [&::-webkit-scrollbar]:hidden"
    >
      <LatexEquation latex={displayLatex ?? expressionToLatex(value)} className="whitespace-nowrap [&_.katex]:text-inherit" />
    </button>
  );
};
