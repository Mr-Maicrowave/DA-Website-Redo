import type { EquationFamily, ParameterKey } from './equation-presets';
import { LatexEquation } from './LatexEquation';

type ParameterInspectorProps = {
  family: EquationFamily;
  formId: string;
  values: Record<ParameterKey, number>;
  onFormChange: (formId: string) => void;
  onParameterChange: (key: ParameterKey, value: number) => void;
  compact?: boolean;
  parameterKeys?: ParameterKey[];
  guidedTitle?: string;
  emptyParameterMessage?: string;
};

const formatParameter = (value: number) => Number(value.toFixed(4)).toString();

export const ParameterInspector = ({
  family,
  formId,
  values,
  onFormChange,
  onParameterChange,
  compact = false,
  parameterKeys,
  guidedTitle,
  emptyParameterMessage,
}: ParameterInspectorProps) => {
  const form = family.forms.find((candidate) => candidate.id === formId) ?? family.forms[0];

  return (
    <section className={compact ? '' : 'mt-5 border-t border-[#071629]/10 pt-5'} aria-labelledby="equation-inspector-heading">
      <div className={compact ? 'flex flex-col gap-4' : 'flex flex-col gap-4 md:flex-row md:items-start md:justify-between'}>
        <div className="max-w-2xl">
          <p className="text-sm font-black text-[#7a5709]">{guidedTitle ?? 'Explore the general form'}</p>
          <h2 id="equation-inspector-heading" className="mt-1 text-xl font-black text-[#071629]">{family.label}</h2>
          <LatexEquation latex={form.generalForm} className="mt-2 block text-lg font-bold text-[#5d568e] [&_.katex]:text-inherit" />
          <p className="mt-2 max-w-[68ch] text-sm leading-6 text-[#40516b]">{form.explanation}</p>
        </div>

        {family.forms.length > 1 && !parameterKeys ? (
          <label className="text-xs font-bold text-[#536077]">
            Equation form
            <select
              value={form.id}
              onChange={(event) => onFormChange(event.target.value)}
              className="mt-1 block h-11 w-full min-w-0 rounded-lg border border-[#071629]/20 bg-white px-3 text-sm font-bold text-[#172033] outline-none focus:border-[#5d568e] focus:ring-2 focus:ring-[#5d568e]/20"
            >
              {family.forms.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
            </select>
          </label>
        ) : null}
      </div>

      <div className={`mt-5 grid gap-x-6 gap-y-5 ${compact ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
        {form.parameters.filter((parameter) => !parameterKeys || parameterKeys.includes(parameter.key)).map((parameter) => {
          const value = values[parameter.key] ?? parameter.defaultValue;
          const inputId = `parameter-${family.id}-${form.id}-${parameter.key}`;
          return (
            <div key={parameter.key}>
              <div className="flex items-start justify-between gap-4">
                <label htmlFor={inputId} className="text-sm font-black text-[#071629]">
                  {parameter.label}
                  <span className="ml-2 font-normal text-[#536077]">{parameter.meaning}</span>
                </label>
                <output htmlFor={inputId} className="min-w-12 rounded-md bg-[#f3f7fb] px-2 py-1 text-center font-mono text-xs font-bold text-[#172033]">
                  {formatParameter(value)}
                </output>
              </div>
              <input
                id={inputId}
                type="range"
                min={parameter.min}
                max={parameter.max}
                step={parameter.step}
                value={value}
                onInput={(event) => onParameterChange(parameter.key, Number(event.currentTarget.value))}
                className="mt-3 h-3 w-full cursor-pointer accent-[#5d568e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5d568e] focus-visible:ring-offset-4"
              />
              <div className="mt-1 flex justify-between font-mono text-[10px] text-[#68758b]" aria-hidden="true">
                <span>{parameter.min}</span><span>{parameter.max}</span>
              </div>
            </div>
          );
        })}
      </div>
      {parameterKeys?.length === 0 && emptyParameterMessage ? (
        <p className="mt-5 rounded-lg bg-[#f3f0f8] px-3 py-3 text-sm leading-6 text-[#392e59]">{emptyParameterMessage}</p>
      ) : null}
    </section>
  );
};
