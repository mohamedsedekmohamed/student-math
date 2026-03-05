import React, { useState, useRef, useEffect } from 'react';
import * as math from 'mathjs';

// ==========================================
// 0. القوالب الجاهزة للمعادلات
// ==========================================
const EQUATION_PRESETS = [
  { group: "Linear & Quadratic", options: [
    { label: "Linear with slope (a, b)", value: "a*x + b" },
    { label: "Quadratic (a, b, c)", value: "a*x^2 + b*x + c" }
  ]},
  { group: "Trigonometric", options: [
    { label: "Amplitude & Frequency", value: "a * sin(b*x)" },
    { label: "Tangent", value: "tan(x)" }
  ]},
  { group: "Advanced", options: [
    { label: "Exponential (a, k)", value: "a * e^(k*x)" },
    { label: "Circle (Upper half)", value: "sqrt(r^2 - x^2)" }
  ]}
];

// ==========================================
// 1. GraphCanvas Component (محرك الرسم)
// ==========================================
const GraphCanvas = ({ equations, variables }) => {
  const canvasRef = useRef(null);
  const [scale, setScale] = useState(50);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
      draw();
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function draw() {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);
      
      const mathToScreenX = (mathX) => (mathX * scale) + (width / 2) + offset.x;
      const mathToScreenY = (mathY) => (height / 2) + offset.y - (mathY * scale);
      const screenToMathX = (screenX) => (screenX - (width / 2) - offset.x) / scale;

      let step = 1;
      if (scale < 10) step = 10;
      else if (scale < 25) step = 5;
      else if (scale < 40) step = 2;
      else if (scale > 150) step = 0.5;
      else if (scale > 300) step = 0.1;

      const leftMathX = screenToMathX(0);
      const rightMathX = screenToMathX(width);
      const topMathY = ((height / 2) + offset.y) / scale;
      const bottomMathY = ((height / 2) + offset.y - height) / scale;

      const xAxisScreenY = Math.max(20, Math.min(height - 20, mathToScreenY(0)));
      const yAxisScreenX = Math.max(20, Math.min(width - 30, mathToScreenX(0)));

      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.font = '12px sans-serif';

      for (let i = Math.floor(leftMathX / step) * step; i <= Math.ceil(rightMathX / step) * step; i += step) {
        let val = Number(i.toFixed(2));
        const screenX = mathToScreenX(val);
        ctx.beginPath();
        ctx.strokeStyle = val === 0 ? '#9ca3af' : '#e5e7eb';
        ctx.lineWidth = val === 0 ? 2 : 1;
        ctx.moveTo(screenX, 0);
        ctx.lineTo(screenX, height);
        ctx.stroke();
        if (val !== 0) {
          ctx.fillStyle = '#6b7280';
          ctx.fillText(val, screenX, xAxisScreenY + 6);
        }
      }

      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      for (let i = Math.floor(bottomMathY / step) * step; i <= Math.ceil(topMathY / step) * step; i += step) {
        let val = Number(i.toFixed(2));
        const screenY = mathToScreenY(val);
        ctx.beginPath();
        ctx.strokeStyle = val === 0 ? '#9ca3af' : '#e5e7eb';
        ctx.lineWidth = val === 0 ? 2 : 1;
        ctx.moveTo(0, screenY);
        ctx.lineTo(width, screenY);
        ctx.stroke();
        if (val !== 0) {
          ctx.fillStyle = '#6b7280';
          ctx.fillText(val, yAxisScreenX - 6, screenY);
        }
      }

      ctx.fillStyle = '#4b5563';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'top';
      ctx.fillText('0', yAxisScreenX - 6, xAxisScreenY + 6);

      equations.forEach(eq => {
        if (!eq.visible || !eq.text.trim()) return;
        let compiledExpr;
        try {
          let safeText = eq.text.replace(/(\d)([a-zA-Z])/g, '$1*$2');
          compiledExpr = math.compile(safeText);
        } catch (e) { return; }

        ctx.beginPath();
        ctx.strokeStyle = eq.color;
        ctx.lineWidth = 2.5;
        
        let firstPoint = true;
        let lastPy = 0;

        for (let px = 0; px < width; px++) {
          const mathX = screenToMathX(px);
          try {
            const mathY = compiledExpr.evaluate({ x: mathX, e: Math.E, pi: Math.PI, ...variables });
            if (typeof mathY === 'number' && !isNaN(mathY) && Math.abs(mathY) < 10000) {
              const py = mathToScreenY(mathY);
              if (firstPoint) {
                ctx.moveTo(px, py);
                firstPoint = false;
              } else {
                if (Math.abs(py - lastPy) > height) ctx.moveTo(px, py); 
                else ctx.lineTo(px, py);
              }
              lastPy = py;
            } else { firstPoint = true; }
          } catch (e) { firstPoint = true; }
        }
        ctx.stroke();
      });
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [equations, scale, offset, variables]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = 1.1;
    const direction = e.deltaY > 0 ? -1 : 1;
    setScale(prevScale => Math.min(Math.max(direction > 0 ? prevScale * zoomFactor : prevScale / zoomFactor, 5), 500));
  };

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full bg-white ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    />
  );
};

// ==========================================
// 2. Sidebar Component
// ==========================================
const Sidebar = ({ equations, variables, onVarChange, onAddBlank, onAddPreset, onUpdate, onRemove, onToggle }) => {
  return (
    <div className="w-64 md:w-72 bg-white border-r border-gray-200 flex flex-col shadow-sm z-10">
      <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
        {equations.map((eq) => (
          <div key={eq.id} className="flex items-center bg-gray-50 border border-gray-200 rounded-lg p-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-400">
            <button onClick={() => onToggle(eq.id)} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200">
              <div className="w-3.5 h-3.5 rounded-full border-2" style={{ borderColor: eq.color, backgroundColor: eq.visible ? eq.color : 'transparent' }} />
            </button>
            <div className="flex-1 flex items-center mx-2 font-mono text-sm">
              <span className="text-gray-500 italic mr-1">f(x)=</span>
              <input
                type="text"
                value={eq.text}
                onChange={(e) => onUpdate(eq.id, e.target.value)}
                placeholder="ex: a*x + b"
                className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-300 min-w-0"
              />
            </div>
            <button onClick={() => onRemove(eq.id)} className="text-gray-400 hover:text-red-500 px-1 font-bold text-lg">×</button>
          </div>
        ))}
      </div>

      {Object.keys(variables).length > 0 && (
        <div className="p-3 bg-blue-50/50 border-t border-blue-100 flex flex-col gap-3 max-h-48 overflow-y-auto">
          <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wider">Sliders (Variables)</h4>
          {Object.entries(variables).map(([varName, value]) => (
            <div key={varName} className="flex flex-col gap-1">
              <div className="flex justify-between text-sm font-mono text-gray-700">
                <span>{varName}</span>
                <span className="bg-white px-2 rounded border text-xs leading-5">{Number(value).toFixed(1)}</span>
              </div>
              <input 
                type="range" 
                min="-10" max="10" step="0.1" 
                value={value} 
                onChange={(e) => onVarChange(varName, parseFloat(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>
          ))}
        </div>
      )}
      
      <div className="p-3 border-t border-gray-200 bg-gray-50 flex flex-col gap-2">
        <select 
          onChange={(e) => { if (e.target.value) { onAddPreset(e.target.value); e.target.value = ""; } }}
          className="w-full py-1.5 px-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">📋 Select a Template...</option>
          {EQUATION_PRESETS.map((group, idx) => (
            <optgroup key={idx} label={group.group}>
              {group.options.map((opt, i) => (
                <option key={i} value={opt.value}>{opt.label}</option>
              ))}
            </optgroup>
          ))}
        </select>
        <button onClick={onAddBlank} className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium text-sm transition shadow-sm">
          + Add Empty Equation
        </button>
      </div>
    </div>
  );
};

// ==========================================
// 3. Main GraphViewer Component (محدث ليدعم التبويبات)
// ==========================================
const GraphViewer = ({ onClose }) => {
  // إنشاء هيكل يضم عدة تبويبات (Workspaces)
  const [tabs, setTabs] = useState([
    { 
      id: 1, 
      title: 'Graph 1', 
      equations: [{ id: Date.now(), text: 'x^2', color: '#ef4444', visible: true }],
      variables: {} 
    }
  ]);
  const [activeTabId, setActiveTabId] = useState(1);

  // الحصول على التبويب النشط حالياً
  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  // دالة مساعدة لتحديث التبويب النشط فقط
  const updateActiveTab = (updates) => {
    setTabs(tabs.map(tab => tab.id === activeTabId ? { ...tab, ...updates } : tab));
  };

  // استخراج المجاهيل برمجياً كلما تغيرت معادلات التبويب النشط
  useEffect(() => {
    const newVars = { ...activeTab.variables };
    let activeVars = new Set();

    activeTab.equations.forEach(eq => {
      if (!eq.visible || !eq.text.trim()) return;
      try {
        let safeText = eq.text.replace(/(\d)([a-zA-Z])/g, '$1*$2');
        const node = math.parse(safeText);
        
        node.filter(n => n.isSymbolNode).forEach(n => {
          const name = n.name;
          const builtIns = ['x', 'y', 'e', 'pi', 'sin', 'cos', 'tan', 'log', 'sqrt', 'abs'];
          if (!builtIns.includes(name) && typeof math[name] !== 'function') {
            activeVars.add(name);
            if (newVars[name] === undefined) newVars[name] = 1;
          }
        });
      } catch (e) {}
    });

    Object.keys(newVars).forEach(key => {
      if (!activeVars.has(key)) delete newVars[key];
    });

    if (JSON.stringify(newVars) !== JSON.stringify(activeTab.variables)) {
      updateActiveTab({ variables: newVars });
    }
  }, [activeTab.equations]);

  const getRandomColor = () => {
    const colors = ['#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // دوال التعامل مع التبويبات (Tabs)
  const addNewTab = () => {
    const newId = Date.now();
    setTabs([...tabs, { 
      id: newId, 
      title: `Graph ${tabs.length + 1}`, 
      equations: [{ id: Date.now() + 1, text: '', color: getRandomColor(), visible: true }],
      variables: {}
    }]);
    setActiveTabId(newId);
  };

  const removeTab = (e, tabId) => {
    e.stopPropagation(); // منع تفعيل التبويب عند الضغط على زر الحذف
    if (tabs.length === 1) return; // منع حذف التبويب الأخير
    const filteredTabs = tabs.filter(t => t.id !== tabId);
    setTabs(filteredTabs);
    if (activeTabId === tabId) setActiveTabId(filteredTabs[0].id);
  };

  // دوال التعامل مع المعادلات داخل التبويب النشط
  const updateVariable = (name, value) => updateActiveTab({ variables: { ...activeTab.variables, [name]: value } });
  const addBlankEquation = () => updateActiveTab({ equations: [...activeTab.equations, { id: Date.now(), text: '', color: getRandomColor(), visible: true }] });
  const addPresetEquation = (val) => updateActiveTab({ equations: [...activeTab.equations, { id: Date.now(), text: val, color: getRandomColor(), visible: true }] });
  const updateEquation = (id, newText) => updateActiveTab({ equations: activeTab.equations.map(eq => eq.id === id ? { ...eq, text: newText } : eq) });
  const removeEquation = (id) => updateActiveTab({ equations: activeTab.equations.filter(eq => eq.id !== id) });
  const toggleVisibility = (id) => updateActiveTab({ equations: activeTab.equations.map(eq => eq.id === id ? { ...eq, visible: !eq.visible } : eq) });

  return (
    <div className="flex flex-col w-full h-full bg-gray-50 font-sans rounded-lg overflow-hidden border border-gray-200 shadow-lg">
      
      {/* شريط التبويبات العلوي */}
      <div className="flex items-center bg-gray-100 border-b border-gray-200 overflow-x-auto px-2 py-1.5 custom-scrollbar min-h-[44px]">
        {tabs.map((tab) => (
          <div 
            key={tab.id}
            onClick={() => setActiveTabId(tab.id)}
            className={`flex items-center gap-2 px-4 py-1.5 mx-1 rounded-md cursor-pointer text-sm font-medium transition-all select-none border whitespace-nowrap
              ${activeTabId === tab.id 
                ? 'bg-white border-gray-300 text-blue-600 shadow-sm' 
                : 'bg-transparent border-transparent text-gray-600 hover:bg-gray-200'}`}
          >
            {tab.title}
            {tabs.length > 1 && (
              <button 
                onClick={(e) => removeTab(e, tab.id)}
                className="w-4 h-4 flex items-center justify-center rounded-full text-gray-400 hover:bg-red-100 hover:text-red-500 transition-colors"
                title="Close Tab"
              >
                ×
              </button>
            )}
          </div>
        ))}
        
        <button 
          onClick={addNewTab}
          className="ml-2 px-3 py-1.5 bg-white border border-gray-300 text-gray-600 rounded-md hover:bg-gray-50 font-bold text-sm shadow-sm transition-colors flex-shrink-0"
          title="New Graph"
        >
          + New Tab
        </button>
      </div>

      {/* منطقة العمل (القائمة + الرسم) للتبويب النشط */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          equations={activeTab.equations}
          variables={activeTab.variables}
          onVarChange={updateVariable}
          onAddBlank={addBlankEquation} 
          onAddPreset={addPresetEquation}
          onUpdate={updateEquation} 
          onRemove={removeEquation} 
          onToggle={toggleVisibility}
        />
        <main className="flex-1 relative bg-white overflow-hidden">
          {/* نستخدم key لإعادة تهيئة الكانفاس عند تغيير التبويب لتجنب التداخل البصري */}
          <GraphCanvas key={activeTab.id} equations={activeTab.equations} variables={activeTab.variables} />
        </main>
      </div>
      
    </div>
  );
};

export default GraphViewer;