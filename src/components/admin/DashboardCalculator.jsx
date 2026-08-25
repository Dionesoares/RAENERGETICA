import React, { useState } from "react";

const KEYS = [
  ["C", "⌫", "%", "÷"],
  ["7", "8", "9", "×"],
  ["4", "5", "6", "−"],
  ["1", "2", "3", "+"],
  ["0", ".", "="],
];

function formatNumber(value) {
  if (!Number.isFinite(value)) return "0";
  return String(value);
}

export default function DashboardCalculator() {
  const [display, setDisplay] = useState("0");
  const [stored, setStored] = useState(null);
  const [operator, setOperator] = useState(null);
  const [fresh, setFresh] = useState(true);

  const applyOperator = (nextOp) => {
    const current = Number(display.replace(",", "."));
    if (stored === null || operator === null) {
      setStored(current);
    } else {
      const result = compute(stored, current, operator);
      setStored(result);
      setDisplay(formatNumber(result));
    }
    setOperator(nextOp);
    setFresh(true);
  };

  const compute = (left, right, op) => {
    if (op === "+") return left + right;
    if (op === "−") return left - right;
    if (op === "×") return left * right;
    if (op === "÷") return right === 0 ? 0 : left / right;
    return right;
  };

  const press = (key) => {
    if (key === "C") {
      setDisplay("0");
      setStored(null);
      setOperator(null);
      setFresh(true);
      return;
    }
    if (key === "⌫") {
      setDisplay((value) => (value.length <= 1 ? "0" : value.slice(0, -1)));
      setFresh(false);
      return;
    }
    if (key === "%") {
      setDisplay((value) => formatNumber(Number(value.replace(",", ".")) / 100));
      setFresh(true);
      return;
    }
    if (key === "=") {
      if (operator === null || stored === null) return;
      const result = compute(stored, Number(display.replace(",", ".")), operator);
      setDisplay(formatNumber(result));
      setStored(null);
      setOperator(null);
      setFresh(true);
      return;
    }
    if (["+", "−", "×", "÷"].includes(key)) {
      applyOperator(key);
      return;
    }
    if (key === ".") {
      if (fresh) {
        setDisplay("0.");
        setFresh(false);
        return;
      }
      if (!display.includes(".")) setDisplay((value) => `${value}.`);
      return;
    }
    setDisplay((value) => (fresh || value === "0" ? key : `${value}${key}`));
    setFresh(false);
  };

  return (
    <div className="max-w-sm rounded-2xl border border-border bg-white p-4 shadow-sm">
      <p className="mb-3 text-sm font-semibold text-primary">Calculadora</p>
      <div className="mb-3 rounded-xl bg-secondary px-4 py-3 text-right font-mono text-2xl font-semibold text-primary">
        {display}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {KEYS.flat().map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => press(key)}
            className={`h-12 rounded-lg text-sm font-semibold ${
              key === "="
                ? "col-span-2 bg-primary text-white"
                : ["+", "−", "×", "÷", "%", "C", "⌫"].includes(key)
                  ? "bg-secondary text-primary"
                  : "bg-slate-100 text-foreground hover:bg-slate-200"
            }`}
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  );
}
