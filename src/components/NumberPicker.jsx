import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  boundedNumber,
  timeParts,
  fromTimeParts,
} from "../utils/numberPicker.js";

const ROW = 44;
function Wheel({ label, value, min = 0, max, onChange }) {
  const ref = useRef(null);
  const timer = useRef(null);
  const callback = useRef(onChange);
  useEffect(() => {
    callback.current = onChange;
  }, [onChange]);
  useEffect(() => {
    ref.current.scrollTop = (value - min) * ROW;
  }, [value, min]);
  useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <div className="wt-wheel-column">
      <span>{label}</span>
      <div
        className="wt-wheel"
        ref={ref}
        role="spinbutton"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        onKeyDown={(e) => {
          const next = {
            ArrowUp: value - 1,
            ArrowDown: value + 1,
            PageUp: value - 10,
            PageDown: value + 10,
            Home: min,
            End: max,
          }[e.key];
          if (next !== undefined) {
            e.preventDefault();
            callback.current(boundedNumber(next, min, max));
          }
        }}
        onScroll={(e) => {
          const element = e.currentTarget;
          clearTimeout(timer.current);
          timer.current = setTimeout(
            () =>
              callback.current(
                boundedNumber(
                  Math.round(element.scrollTop / ROW) + min,
                  min,
                  max,
                ),
              ),
            100,
          );
        }}
      >
        {Array.from({ length: max - min + 1 }, (_, index) => index + min).map(
          (n) => (
            <div
              className={`wt-wheel-option ${n === value ? "is-selected" : ""}`}
              key={n}
              onClick={() => callback.current(n)}
              aria-hidden="true"
            >
              {String(n).padStart(2, "0")}
            </div>
          ),
        )}
      </div>
    </div>
  );
}

export default function NumberPicker({
  label,
  value,
  onChange,
  min = 0,
  max = 86400,
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const dialog = useRef(null);
  const trigger = useRef(null);
  const id = useId();
  const duration = label.includes("seconds");
  const parts = timeParts(draft);
  useEffect(() => {
    if (!open) return;
    const oldOverflow = document.body.style.overflow;
    const opener = trigger.current;
    document.body.style.overflow = "hidden";
    dialog.current.querySelector("button").focus();
    return () => {
      document.body.style.overflow = oldOverflow;
      opener?.focus();
    };
  }, [open]);
  const changePart = (index, n) =>
    setDraft((v) => {
      const next = timeParts(v);
      next[index] = n;
      return fromTimeParts(next, min, max);
    });
  return (
    <div className="wt-field">
      <label htmlFor={id}>{label}</label>
      <div className="wt-number-entry">
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={value}
          onFocus={(e) => e.target.select()}
          onChange={(e) =>
            onChange(e.target.value === "" ? "" : Number(e.target.value))
          }
          onBlur={(e) => onChange(boundedNumber(e.target.value, min, max))}
        />
        <button
          ref={trigger}
          type="button"
          className="wt-wheel-trigger"
          aria-label={`Choose ${label}`}
          onClick={() => {
            setDraft(boundedNumber(value, min, max));
            setOpen(true);
          }}
        >
          ↕ <span>Wheel</span>
        </button>
      </div>
      {duration && (
        <small>{partsForLabel(value)} · tap to type or use wheel</small>
      )}
      {open &&
        createPortal(
          <div
            className="wt-picker-overlay"
            onClick={(e) => {
              if (e.target === e.currentTarget) setOpen(false);
            }}
          >
            <section
              className="wt-picker"
              role="dialog"
              aria-modal="true"
              aria-labelledby={`${id}-heading`}
              ref={dialog}
              onKeyDown={(e) => {
                e.stopPropagation();
                if (e.key === "Escape") {
                  e.preventDefault();
                  setOpen(false);
                }
                if (e.key === "Tab") {
                  const targets = [
                    ...dialog.current.querySelectorAll('button,[tabindex="0"]'),
                  ];
                  const first = targets[0],
                    last = targets.at(-1);
                  if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                  } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                  }
                }
              }}
            >
              <div className="wt-picker-heading">
                <h2 id={`${id}-heading`}>
                  {label.replace(/ \(seconds.*\)/, "")}
                </h2>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Cancel picker"
                >
                  ×
                </button>
              </div>
              <p>Scroll, swipe or use arrow keys. Tap a number to select.</p>
              <div className="wt-wheels">
                {duration ? (
                  <>
                    {max >= 3600 && (
                      <Wheel
                        label="Hours"
                        value={parts[0]}
                        max={Math.floor(max / 3600)}
                        onChange={(n) => changePart(0, n)}
                      />
                    )}
                    {max >= 60 && (
                      <Wheel
                        label="Minutes"
                        value={parts[1]}
                        max={
                          max < 3600 ? Math.min(59, Math.floor(max / 60)) : 59
                        }
                        onChange={(n) => changePart(1, n)}
                      />
                    )}
                    <Wheel
                      label="Seconds"
                      value={parts[2]}
                      max={Math.min(59, max)}
                      onChange={(n) => changePart(2, n)}
                    />
                  </>
                ) : (
                  <Wheel
                    label="Value"
                    value={Number(draft)}
                    min={min}
                    max={max}
                    onChange={setDraft}
                  />
                )}
              </div>
              <output>{duration ? partsForLabel(draft) : draft}</output>
              {min === 0 && (
                <button className="wt-picker-zero" onClick={() => setDraft(0)}>
                  {label.startsWith("Time cap") ? "No time cap" : "Set to zero"}
                </button>
              )}
              <button
                className="bt-button bt-primary"
                onClick={() => {
                  onChange(boundedNumber(draft, min, max));
                  setOpen(false);
                }}
              >
                Use {duration ? partsForLabel(draft) : draft}
              </button>
            </section>
          </div>,
          document.body,
        )}
    </div>
  );
}
function partsForLabel(value) {
  const [h, m, s] = timeParts(value);
  return `${h ? `${h}h ` : ""}${m}m ${s}s`;
}
