'use client';

import { useState, KeyboardEvent } from 'react';

interface NumericFieldProps {
  id: string;
  /** Value in the unit currently shown to the user. `undefined` means the field is empty. */
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  unitLabel: string;
  step?: number;
  min?: number;
  max?: number;
  placeholder?: string;
  error?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  size?: 'md' | 'sm';
  ariaLabel?: string;
}

// Accept digits with at most one decimal separator. A comma is treated as a dot so
// European keyboards work too.
const PARTIAL_NUMBER = /^\d*([.,]\d*)?$/;

/**
 * Text-based numeric input.
 *
 * A plain `<input type="number">` bound to a number state has two problems this
 * component fixes: clearing the field coerces '' to 0 (so the box snaps back to 0
 * and can never be emptied), and the browser's spinner arrows sit on top of the
 * absolutely positioned unit label. Here the raw text is kept as a draft while the
 * user types, the parent only ever receives a real number or `undefined`, and the
 * unit label gets its own padded slot.
 */
export default function NumericField({
  id,
  value,
  onChange,
  unitLabel,
  step = 1,
  min,
  max,
  placeholder,
  error,
  onFocus,
  onBlur,
  size = 'md',
  ariaLabel,
}: NumericFieldProps) {
  // null = not editing, show the formatted value from props.
  const [draft, setDraft] = useState<string | null>(null);
  // If the unit switches (cm -> in) while the field is focused, drop the draft so
  // the converted value shows instead of the old text being read in the new unit.
  const [draftUnit, setDraftUnit] = useState(unitLabel);
  if (draftUnit !== unitLabel) {
    setDraftUnit(unitLabel);
    setDraft(null);
  }

  const formatted = value === undefined || !Number.isFinite(value) ? '' : String(value);
  const displayValue = draft ?? formatted;

  const commit = (raw: string) => {
    const normalized = raw.replace(',', '.');
    if (normalized === '' || normalized === '.') {
      onChange(undefined);
      return;
    }
    const n = Number(normalized);
    if (Number.isFinite(n)) onChange(n);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
    e.preventDefault();
    // From an empty field, start at the bottom of the allowed range rather than 0.
    let next = value === undefined ? min ?? 0 : e.key === 'ArrowUp' ? value + step : value - step;
    if (min !== undefined) next = Math.max(min, next);
    if (max !== undefined) next = Math.min(max, next);
    next = Math.round(next * 10) / 10;
    setDraft(String(next));
    onChange(next);
  };

  const padding = size === 'sm' ? 'pl-3.5 py-2.5' : 'pl-4 py-3';

  return (
    <div>
      <div className="relative">
        <input
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          aria-label={ariaLabel}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          value={displayValue}
          placeholder={placeholder}
          onChange={(e) => {
            const raw = e.target.value.trim();
            if (!PARTIAL_NUMBER.test(raw)) return; // ignore letters and stray symbols
            setDraft(raw);
            commit(raw);
          }}
          onKeyDown={handleKeyDown}
          onFocus={(e) => {
            setDraft(formatted);
            e.target.select();
            onFocus?.();
          }}
          onBlur={() => {
            setDraft(null);
            onBlur?.();
          }}
          className={`w-full bg-white border ${
            error ? 'border-rose-500 focus:border-rose-600' : 'border-[#D8D6CF] focus:border-[#121212]'
          } ${padding} pr-14 text-sm font-mono outline-hidden transition-colors`}
        />
        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs uppercase text-[#6E6D68] font-mono pointer-events-none select-none">
          {unitLabel}
        </span>
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="text-[11px] text-rose-700 mt-1.5">
          {error}
        </p>
      )}
    </div>
  );
}
