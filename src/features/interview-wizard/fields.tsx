import type { ChangeEvent, HTMLInputTypeAttribute } from 'react';
import type { Option } from './types.ts';

type CommonProps = { id: string; label: string; error?: string; hint?: string };

export function TextInput({ id, label, value, onChange, error, hint, type = 'text', placeholder }: CommonProps & {
  value: string;
  onChange: (value: string) => void;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
}) {
  const describedBy = [error ? `${id}-error` : '', hint ? `${id}-hint` : ''].filter(Boolean).join(' ') || undefined;
  return <div className="interview-wizard-field">
    <label htmlFor={id}>{label}</label>
    <input id={id} type={type} value={value} placeholder={placeholder} onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)} aria-invalid={Boolean(error)} aria-describedby={describedBy} />
    {hint ? <p id={`${id}-hint`} className="interview-wizard-hint">{hint}</p> : null}
    <FieldError id={`${id}-error`} error={error} />
  </div>;
}

export function TextArea({ id, label, value, onChange, error, hint, placeholder }: CommonProps & {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const describedBy = [error ? `${id}-error` : '', hint ? `${id}-hint` : ''].filter(Boolean).join(' ') || undefined;
  return <div className="interview-wizard-field interview-wizard-field--wide">
    <label htmlFor={id}>{label}</label>
    <textarea id={id} value={value} placeholder={placeholder} onChange={event => onChange(event.target.value)} aria-invalid={Boolean(error)} aria-describedby={describedBy} />
    {hint ? <p id={`${id}-hint`} className="interview-wizard-hint">{hint}</p> : null}
    <FieldError id={`${id}-error`} error={error} />
  </div>;
}

export function SelectInput({ id, label, value, onChange, options, error, placeholder = 'Select…' }: CommonProps & {
  value: string;
  onChange: (value: string) => void;
  options: readonly Option[];
  placeholder?: string;
}) {
  return <div className="interview-wizard-field">
    <label htmlFor={id}>{label}</label>
    <select id={id} value={value} onChange={event => onChange(event.target.value)} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined}>
      <option value="">{placeholder}</option>
      {options.map(option => <option value={option.value} key={option.value}>{option.label}</option>)}
    </select>
    <FieldError id={`${id}-error`} error={error} />
  </div>;
}

export function MultiChoice({ id, label, options, values, onToggle, error, hint }: CommonProps & {
  options: readonly Option[];
  values: readonly string[];
  onToggle: (value: string) => void;
}) {
  return <fieldset className="interview-wizard-choice-group" aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}>
    <legend>{label}</legend>
    {hint ? <p id={`${id}-hint`} className="interview-wizard-hint">{hint}</p> : null}
    <div className="interview-wizard-choices">
      {options.map(option => <button type="button" key={option.value} aria-pressed={values.includes(option.value)} onClick={() => onToggle(option.value)}>{option.label}</button>)}
    </div>
    <FieldError id={`${id}-error`} error={error} />
  </fieldset>;
}

export function SingleChoice({ id, label, options, value, onChange, error }: CommonProps & {
  options: readonly Option[];
  value?: string;
  onChange: (value: string) => void;
}) {
  return <fieldset className="interview-wizard-choice-group" aria-describedby={error ? `${id}-error` : undefined}>
    <legend>{label}</legend>
    <div className="interview-wizard-choices">
      {options.map(option => <button type="button" key={option.value} aria-pressed={value === option.value} onClick={() => onChange(option.value)}>{option.label}</button>)}
    </div>
    <FieldError id={`${id}-error`} error={error} />
  </fieldset>;
}

export function FieldError({ id, error }: { id: string; error?: string }) {
  return error ? <p id={id} className="interview-wizard-error" role="alert">{error}</p> : null;
}
