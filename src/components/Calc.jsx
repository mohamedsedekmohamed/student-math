import React, { useState } from "react";
import { Calculator, X, Delete, RotateCcw } from "lucide-react";

const Calc = ({ onClose }) => {
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");

  const factorial = (n) => {
    if (n < 0) return NaN;
    let r = 1;
    for (let i = 2; i <= n; i++) r *= i;
    return r;
  };

  const handleInput = (value) => {
    if (value === "=") {
      try {
        let expr = expression
          .replace(/π/g, String(Math.PI))
          .replace(/e(?![a-z])/g, String(Math.E))
          .replace(/sin\(/g, "Math.sin(")
          .replace(/cos\(/g, "Math.cos(")
          .replace(/tan\(/g, "Math.tan(")
          .replace(/asin\(/g, "Math.asin(")
          .replace(/acos\(/g, "Math.acos(")
          .replace(/atan\(/g, "Math.atan(")
          .replace(/log\(/g, "Math.log10(")
          .replace(/ln\(/g, "Math.log(")
          .replace(/sqrt\(/g, "Math.sqrt(")
          .replace(/abs\(/g, "Math.abs(")
          .replace(/\^/g, "**");

        expr = expr.replace(/(\d+)!/g, (_, n) => factorial(parseInt(n)));

        const result = eval(expr);

        setDisplay(String(result));
        setExpression(String(result));
      } catch {
        setDisplay("Error");
      }
    } else if (value === "AC") {
      setExpression("");
      setDisplay("0");
    } else if (value === "DEL") {
      const newExpr = expression.slice(0, -1);
      setExpression(newExpr);
      setDisplay(newExpr || "0");
    } else {
      const newExpr = expression + value;
      setExpression(newExpr);
      setDisplay(newExpr);
    }
  };

  const scientific = [
    "sin(", "cos(", "tan(",
    "asin(", "acos(", "atan(",
    "log(", "ln(", "sqrt(",
    "abs(", "π", "e",
    "^", "!"
  ];

  const numbers = [
    "7","8","9",
    "4","5","6",
    "1","2","3",
    "0",".","="
  ];

  const operators = ["(",")","/","*","-","+"];

  const btnBase =
    "h-14 rounded-xl font-semibold transition-all duration-150 active:scale-95";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-[9999]">

      <div className="w-full max-w-4xl bg-slate-900 rounded-[32px] p-8 shadow-2xl text-white">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Calculator size={28} className="text-indigo-400" />
            <h1 className="text-xl font-bold">MathStudio</h1>
          </div>

          <button onClick={onClose} className="hover:bg-red-600 p-2 rounded-full">
            <X size={22}/>
          </button>
        </div>

        {/* Display */}
        <div className="bg-black rounded-xl p-5 mb-6 text-right">
          <div className="text-indigo-400 text-sm h-6 overflow-x-auto">
            {expression || "0"}
          </div>
          <div className="text-5xl font-bold break-all">
            {display}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">

          {/* Scientific */}
          <div>
            <p className="text-xs text-indigo-400 mb-2">Scientific</p>

            <div className="grid grid-cols-3 gap-2">
              {scientific.map((b) => (
                <button
                  key={b}
                  onClick={() => handleInput(b)}
                  className={`${btnBase} bg-indigo-600/30 hover:bg-indigo-600`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Numbers */}
          <div>
            <p className="text-xs text-indigo-400 mb-2">Numbers</p>

            <div className="grid grid-cols-3 gap-2">
              {numbers.map((b) => (
                <button
                  key={b}
                  onClick={() => handleInput(b)}
                  className={`${btnBase} ${
                    b === "="
                      ? "bg-indigo-600 hover:bg-indigo-500"
                      : "bg-slate-800 hover:bg-slate-700"
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Operators */}
          <div>
            <p className="text-xs text-indigo-400 mb-2">Operators</p>

            <div className="grid grid-cols-2 gap-2">
              {operators.map((b) => (
                <button
                  key={b}
                  onClick={() => handleInput(b)}
                  className={`${btnBase} bg-orange-500/30 hover:bg-orange-500`}
                >
                  {b}
                </button>
              ))}
            </div>

            {/* Controls */}
            <div className="grid grid-cols-1 gap-2 mt-2">
              <button
                onClick={() => handleInput("DEL")}
                className={`${btnBase} bg-red-500/40 hover:bg-red-500 flex items-center justify-center gap-2`}
              >
                <Delete size={18}/> DEL
              </button>

              <button
                onClick={() => handleInput("AC")}
                className={`${btnBase} bg-slate-700 hover:bg-slate-600 flex items-center justify-center gap-2`}
              >
                <RotateCcw size={18}/> AC
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Calc;