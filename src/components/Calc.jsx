import React, { useState } from 'react';
import { create, all } from 'mathjs';
import { motion } from 'framer-motion';

const math = create(all);

const CasioCalculator = () => {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');

  const handlePress = (val) => {
    if (val === 'AC') {
      setExpression('');
      setResult('');
    } else if (val === 'DEL') {
      setExpression((prev) => prev.slice(0, -1));
    } else if (val === '=') {
      try {
        // تجهيز المعادلة عشان محرك mathjs يفهمها
        let cleanExpr = expression
          .replace(/×/g, '*')
          .replace(/÷/g, '/')
          .replace(/π/g, 'pi')
          .replace(/√\(/g, 'sqrt(')
          .replace(/x10\^/g, '*10^');
        
        const res = math.evaluate(cleanExpr);
        setResult(Number.isInteger(res) ? res : Number(res.toFixed(8)).toString());
      } catch (err) {
        setResult('Syntax ERROR');
      }
    } else {
      setExpression((prev) => prev + val);
    }
  };

  // 1. أزرار التحكم العلوية (البيضاوية)
  const ControlBtn = ({ label, subY, subP, onClick }) => (
    <div className="flex flex-col items-center w-10">
      <div className="flex justify-center w-full gap-1 text-[7px] font-bold h-2.5 mb-0.5 whitespace-nowrap">
        {subY && <span className="text-[#c89222]">{subY}</span>}
        {subP && <span className="text-[#a53b49]">{subP}</span>}
      </div>
      <motion.button
        whileTap={{ scale: 0.9, y: 1 }}
        onClick={() => onClick(label)}
        className="w-8 h-4 bg-[#7a7b8c] rounded-[10px] shadow-[0_2px_0_#505160] active:shadow-none text-[6px] text-white font-bold border-t border-white/20"
      >
        {label}
      </motion.button>
    </div>
  );

  // 2. أزرار الوظائف العلمية (السوداء)
  const SciBtn = ({ label, subY, subP, onClick }) => (
    <div className="flex flex-col items-center">
      <div className="flex justify-center w-full gap-1 text-[7px] font-bold h-2.5 mb-0.5 whitespace-nowrap">
        {subY && <span className="text-[#c89222]">{subY}</span>}
        {subP && <span className="text-[#a53b49]">{subP}</span>}
      </div>
      <motion.button
        whileTap={{ scale: 0.9, y: 1 }}
        onClick={() => onClick(label)}
        className="w-[38px] h-[22px] bg-[#222] rounded-[3px] shadow-[0_2px_0_#111] active:shadow-none text-[9px] text-white font-medium border-t border-white/10"
      >
        {label}
      </motion.button>
    </div>
  );

  // 3. أزرار الأرقام والعمليات
  const NumBtn = ({ label, type = "num", subY, onClick }) => {
    let bg = "bg-[#f4f4f4]";
    let shadow = "shadow-[0_3px_0_#ccc]";
    let text = "text-[#111]";
    
    if (type === "orange") {
      bg = "bg-[#f17127]";
      shadow = "shadow-[0_3px_0_#c0581f]";
      text = "text-white";
    }

    return (
      <div className="flex flex-col items-center">
        <div className="h-3 mb-0.5 text-[7px] font-bold text-[#c89222]">{subY}</div>
        <motion.button
          whileTap={{ scale: 0.92, y: 2 }}
          onClick={() => onClick(label)}
          className={`w-12 h-9 ${bg} ${text} ${shadow} rounded-md text-sm font-bold active:shadow-none border-t border-white/60 flex items-center justify-center`}
        >
          {label}
        </motion.button>
      </div>
    );
  };

  return (
    <div className=" flex items-center justify-center p-4 font-sans select-none">
      {/* الغلاف الخارجي الداكن */}
      <div className="bg-[#484a5c] w-[350px] p-1.5 rounded-[45px] shadow-[0_25px_50px_rgba(0,0,0,0.8)] relative">
        
        {/* الجسم الفضي الداخلي */}
        <div className="bg-gradient-to-b from-[#f2f4f7] via-[#cfd3d8] to-[#a2a6ae] w-full h-full rounded-[40px] px-5 py-6 inner-shadow">
          
          {/* الشعار والطاقة الشمسية */}
          <div className="flex justify-between items-start mb-3 px-1">
            <div>
              <h1 className="text-[#222] font-black text-xl tracking-tighter leading-none">CASIO</h1>
              <div className="text-[9px] text-emerald-800 font-bold italic mt-1 font-serif tracking-tight">NATURAL-V.P.A.M.</div>
            </div>
            <div className="flex flex-col items-end">
              <div className="w-16 h-7 bg-[#4d3328] rounded-sm shadow-inner flex p-0.5 gap-0.5 border border-[#888]">
                {[1, 2, 3, 4].map(i => <div key={i} className="flex-1 bg-[#2a1b15] opacity-80"></div>)}
              </div>
              <span className="text-[6px] text-gray-700 font-bold mt-1 tracking-widest">TWO WAY POWER</span>
            </div>
          </div>

          <div className="px-1 flex justify-between text-[7px] text-[#222] font-bold mb-1 opacity-80">
            <span>fx-991ES PLUS</span>
          </div>

          {/* الشاشة */}
          <div className="bg-[#c2ceb9] w-full h-24 rounded shadow-[inset_0_4px_10px_rgba(0,0,0,0.3)] border-[3px] border-[#333] mb-6 flex flex-col p-2 relative overflow-hidden font-mono">
             {/* أيقونات الشاشة */}
             <div className="text-[8px] text-[#222] font-sans flex gap-3 mb-1 opacity-70">
                <span>S</span> <span>A</span> <span className="ml-auto">Math ▲</span>
             </div>
             
             {/* المعادلة */}
             <div className="text-[#111] text-base h-1/2 break-all overflow-hidden leading-tight">
                {expression}
             </div>
             {/* النتيجة */}
             <div className="text-[#111] text-3xl font-bold text-right self-end mt-auto h-1/2">
                {result}
             </div>
          </div>

          {/* ----- منطقة الأزرار العلوية المعقدة ----- */}
          <div className="relative h-24 mb-3">
             {/* العمودين على الشمال */}
             <div className="absolute left-0 top-0 flex gap-2">
                <ControlBtn label="SHIFT" onClick={() => {}} />
                <ControlBtn label="ALPHA" onClick={() => {}} />
             </div>
             <div className="absolute left-0 top-12 flex gap-2">
                <SciBtn label="CALC" subY="SOLVE" subP="=" onClick={() => {}} />
                <SciBtn label="∫dx" subY="d/dx" subP=":" onClick={() => handlePress('∫(')} />
             </div>

             {/* D-Pad في النص */}
             <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[74px] h-[84px] bg-[#6e7084] rounded-[40%] shadow-[0_4px_0_#4a4c5e,inset_0_2px_5px_rgba(255,255,255,0.3)] border-2 border-[#5a5c6e] flex items-center justify-center z-10 cursor-pointer">
                <div className="absolute top-2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[5px] border-b-[#c4c5d6]"></div>
                <div className="absolute bottom-2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-[#c4c5d6]"></div>
                <div className="absolute left-2 w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-r-[5px] border-r-[#c4c5d6]"></div>
                <div className="absolute right-2 w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[5px] border-l-[#c4c5d6]"></div>
                <div className="w-10 h-10 bg-[#7a7c90] rounded-full shadow-inner flex items-center justify-center">
                    <span className="text-[7px] font-bold text-[#333]">REPLAY</span>
                </div>
             </div>

             {/* العمودين على اليمين */}
             <div className="absolute right-0 top-0 flex gap-2">
                <ControlBtn label="MODE" subY="SETUP" onClick={() => {}} />
                <ControlBtn label="ON" onClick={() => handlePress('AC')} />
             </div>
             <div className="absolute right-0 top-12 flex gap-2">
                <SciBtn label="x⁻¹" subY="x!" onClick={() => handlePress('^-1')} />
                <SciBtn label="log□" subY="Σ" onClick={() => handlePress('log(')} />
             </div>
          </div>

          {/* ----- الأزرار العلمية (3 صفوف) ----- */}
          <div className="grid grid-cols-6 gap-x-[7px] gap-y-1 mb-5">
            <SciBtn label="■/□" subY="a b/c" onClick={() => handlePress('/')} />
            <SciBtn label="√□" subY="∛" onClick={() => handlePress('√(')} />
            <SciBtn label="x²" subY="x³" onClick={() => handlePress('^2')} />
            <SciBtn label="x^□" subY="ⁿ√" onClick={() => handlePress('^')} />
            <SciBtn label="log" subY="10^x" onClick={() => handlePress('log10(')} />
            <SciBtn label="ln" subY="e^x" onClick={() => handlePress('ln(')} />

            <SciBtn label="(-)" subY="A" onClick={() => handlePress('-')} />
            <SciBtn label="°'\" subY="B" onClick={() => {}} />
            <SciBtn label="hyp" subP="C" onClick={() => {}} />
            <SciBtn label="sin" subY="sin⁻¹" subP="D" onClick={() => handlePress('sin(')} />
            <SciBtn label="cos" subY="cos⁻¹" subP="E" onClick={() => handlePress('cos(')} />
            <SciBtn label="tan" subY="tan⁻¹" subP="F" onClick={() => handlePress('tan(')} />

            <SciBtn label="RCL" subY="STO" onClick={() => {}} />
            <SciBtn label="ENG" subY="←" onClick={() => {}} />
            <SciBtn label="(" subP="X" onClick={() => handlePress('(')} />
            <SciBtn label=")" subP="Y" onClick={() => handlePress(')')} />
            <SciBtn label="S⇔D" onClick={() => {}} />
            <SciBtn label="M+" subY="M-" subP="M" onClick={() => {}} />
          </div>

          {/* فاصل */}
          <div className="w-full border-b border-[#a9adb5] shadow-[0_1px_0_rgba(255,255,255,0.6)] mb-2"></div>

          {/* ----- أزرار الأرقام والعمليات (4 صفوف × 5 أعمدة) ----- */}
          <div className="grid grid-cols-5 gap-x-2.5 gap-y-0.5">
             <NumBtn label="7" subY="CONST" onClick={handlePress} />
             <NumBtn label="8" subY="CONV" onClick={handlePress} />
             <NumBtn label="9" subY="CLR" onClick={handlePress} />
             <NumBtn label="DEL" type="orange" subY="INS" onClick={handlePress} />
             <NumBtn label="AC" type="orange" subY="OFF" onClick={handlePress} />

             <NumBtn label="4" subY="MATRIX" onClick={handlePress} />
             <NumBtn label="5" subY="VECTOR" onClick={handlePress} />
             <NumBtn label="6" onClick={handlePress} />
             <NumBtn label="×" onClick={handlePress} />
             <NumBtn label="÷" onClick={handlePress} />

             <NumBtn label="1" subY="STAT" onClick={handlePress} />
             <NumBtn label="2" subY="CMPLX" onClick={handlePress} />
             <NumBtn label="3" subY="BASE" onClick={handlePress} />
             <NumBtn label="+" onClick={handlePress} />
             <NumBtn label="-" onClick={handlePress} />

             <NumBtn label="0" subY="Rnd" onClick={handlePress} />
             <NumBtn label="." subY="Ran#" onClick={handlePress} />
             <NumBtn label="x10ˣ" subY="π" onClick={() => handlePress('x10^')} />
             <NumBtn label="Ans" subY="DRG" onClick={() => handlePress(result)} />
             <NumBtn label="=" onClick={handlePress} />
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default CasioCalculator;