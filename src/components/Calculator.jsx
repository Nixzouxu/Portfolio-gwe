import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Tombol kalkulator ────────────────────────────────────────────
const CalcButton = ({ label, onClick, variant = 'default', wide = false }) => {
  const base =
    'relative z-10 flex items-center justify-center rounded-lg font-mono text-sm font-semibold h-12 transition-all duration-150 active:scale-95 cursor-pointer select-none';

  const variants = {
    default:   'bg-[rgba(7,16,32,0.8)] border border-[rgba(0,255,231,0.15)] text-[rgba(226,235,240,0.8)] hover:border-[rgba(0,255,231,0.4)] hover:text-[#00FFE7]',
    operator:  'bg-[rgba(0,255,231,0.08)] border border-[rgba(0,255,231,0.3)] text-[#00FFE7] hover:bg-[rgba(0,255,231,0.15)]',
    equal:     'bg-gradient-to-br from-[#00FFE7] to-[#00A8A0] text-[#050A0E] hover:opacity-90 border-none',
    clear:     'bg-[rgba(255,80,80,0.1)] border border-[rgba(255,80,80,0.3)] text-red-400 hover:bg-[rgba(255,80,80,0.2)]',
    func:      'bg-[rgba(139,92,246,0.1)] border border-[rgba(139,92,246,0.3)] text-violet-400 hover:bg-[rgba(139,92,246,0.2)]',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${base} ${variants[variant]} ${wide ? 'col-span-2' : ''}`}
    >
      {label}
    </button>
  );
};

// ── Display ──────────────────────────────────────────────────────
const Display = ({ expression, result }) => (
  <div className="bg-[rgba(7,16,32,0.9)] border border-[rgba(0,255,231,0.15)] rounded-lg p-4 mb-4 min-h-[80px] flex flex-col justify-end items-end overflow-hidden">
    <p className="text-[rgba(226,235,240,0.4)] text-xs font-mono truncate w-full text-right mb-1 h-4">
      {expression || ' '}
    </p>
    <p className="text-[#00FFE7] text-2xl font-mono font-bold truncate w-full text-right">
      {result || '0'}
    </p>
  </div>
);

// ════════════════════════════════════════════════════════════════
// K.CASE — Tambah, Kurang, Bagi, Kali
// ════════════════════════════════════════════════════════════════
const KCase = () => {
  const [expr, setExpr]   = useState('');
  const [display, setDisplay] = useState('');

  const press = (val) => {
    setExpr(prev => prev + val);
    setDisplay(prev => prev + val);
  };

  const calculate = () => {
    try {
      // Ganti × ÷ ke * /
      const sanitized = expr.replace(/×/g, '*').replace(/÷/g, '/');
      // eslint-disable-next-line no-new-func
      const result = Function('"use strict"; return (' + sanitized + ')')();
      setDisplay(String(parseFloat(result.toFixed(10))));
      setExpr(String(result));
    } catch {
      setDisplay('Error');
      setExpr('');
    }
  };

  const clear = () => { setExpr(''); setDisplay(''); };
  const del   = () => { setExpr(p => p.slice(0,-1)); setDisplay(p => p.slice(0,-1)); };

  return (
    <div>
      <Display expression={display !== expr ? display : ''} result={display || '0'} />
      <div className="grid grid-cols-4 gap-2">
        <CalcButton label="C"   onClick={clear}        variant="clear" />
        <CalcButton label="⌫"   onClick={del}          variant="clear" />
        <CalcButton label="%"   onClick={() => press('%')} variant="operator" />
        <CalcButton label="÷"   onClick={() => press('÷')} variant="operator" />

        <CalcButton label="7"   onClick={() => press('7')} />
        <CalcButton label="8"   onClick={() => press('8')} />
        <CalcButton label="9"   onClick={() => press('9')} />
        <CalcButton label="×"   onClick={() => press('×')} variant="operator" />

        <CalcButton label="4"   onClick={() => press('4')} />
        <CalcButton label="5"   onClick={() => press('5')} />
        <CalcButton label="6"   onClick={() => press('6')} />
        <CalcButton label="-"   onClick={() => press('-')} variant="operator" />

        <CalcButton label="1"   onClick={() => press('1')} />
        <CalcButton label="2"   onClick={() => press('2')} />
        <CalcButton label="3"   onClick={() => press('3')} />
        <CalcButton label="+"   onClick={() => press('+')} variant="operator" />

        <CalcButton label="±"   onClick={() => { if (expr) { const v = String(-parseFloat(expr)); setExpr(v); setDisplay(v); }}} />
        <CalcButton label="0"   onClick={() => press('0')} />
        <CalcButton label="."   onClick={() => press('.')} />
        <CalcButton label="="   onClick={calculate}    variant="equal" />
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════
// K.STANDAR — Pangkat, Sqrt, Max
// ════════════════════════════════════════════════════════════════
const KStandar = () => {
  const [a, setA]       = useState('');
  const [b, setB]       = useState('');
  const [result, setResult] = useState('');
  const [expr, setExpr] = useState('');

  const calc = (op) => {
    const na = parseFloat(a);
    const nb = parseFloat(b);
    let res, label;

    try {
      switch (op) {
        case 'pow':
          if (isNaN(na) || isNaN(nb)) throw new Error();
          res = Math.pow(na, nb);
          label = `${na} ^ ${nb}`;
          break;
        case 'sqrt':
          if (isNaN(na)) throw new Error();
          res = Math.sqrt(na);
          label = `√${na}`;
          break;
        case 'max':
          if (isNaN(na) || isNaN(nb)) throw new Error();
          res = Math.max(na, nb);
          label = `max(${na}, ${nb})`;
          break;
        default: return;
      }
      setExpr(label + ' =');
      setResult(String(parseFloat(res.toFixed(10))));
    } catch {
      setResult('Error — isi angka dulu');
      setExpr('');
    }
  };

  const inputClass =
    'relative z-10 w-full px-3 py-2 bg-[rgba(7,16,32,0.8)] border border-[rgba(0,255,231,0.2)] rounded-lg text-[rgba(226,235,240,0.8)] placeholder:text-[rgba(226,235,240,0.3)] focus:border-[rgba(0,255,231,0.5)] focus:outline-none font-mono text-sm';

  return (
    <div className="space-y-4">
      <Display expression={expr} result={result || '0'} />

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-[rgba(226,235,240,0.4)] mb-1 block font-mono">Angka A</label>
          <input type="number" value={a} onChange={e => setA(e.target.value)} placeholder="0" className={inputClass} />
        </div>
        <div>
          <label className="text-xs text-[rgba(226,235,240,0.4)] mb-1 block font-mono">Angka B</label>
          <input type="number" value={b} onChange={e => setB(e.target.value)} placeholder="0" className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <CalcButton label="Aˣ (Pangkat)" onClick={() => calc('pow')}  variant="func" />
        <CalcButton label="√A (Sqrt)"    onClick={() => calc('sqrt')} variant="func" />
        <CalcButton label="Max(A,B)"     onClick={() => calc('max')}  variant="func" />
      </div>

      <button
        type="button"
        onClick={() => { setA(''); setB(''); setResult(''); setExpr(''); }}
        className="relative z-10 w-full py-2 rounded-lg text-red-400 text-sm border border-[rgba(255,80,80,0.3)] bg-[rgba(255,80,80,0.05)] hover:bg-[rgba(255,80,80,0.1)] transition-all"
      >
        Reset
      </button>

      <div className="text-xs text-[rgba(226,235,240,0.3)] space-y-1 font-mono border-t border-[rgba(0,255,231,0.1)] pt-3">
        <p>• <span className="text-violet-400">Pangkat</span>: A ^ B &nbsp;→ gunakan kedua angka</p>
        <p>• <span className="text-violet-400">Sqrt</span>: √A &nbsp;→ cukup isi Angka A</p>
        <p>• <span className="text-violet-400">Max</span>: nilai terbesar dari A dan B</p>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════
// K.MATH — Cos, Sin, Tan
// ════════════════════════════════════════════════════════════════
const KMath = () => {
  const [angle, setAngle]   = useState('');
  const [unit, setUnit]     = useState('deg'); // deg | rad
  const [result, setResult] = useState('');
  const [expr, setExpr]     = useState('');

  const toRad = (val) => unit === 'deg' ? (val * Math.PI) / 180 : val;

  const calc = (fn) => {
    const val = parseFloat(angle);
    if (isNaN(val)) {
      setResult('Error — isi sudut dulu');
      setExpr('');
      return;
    }
    const rad = toRad(val);
    let res;
    switch (fn) {
      case 'sin': res = Math.sin(rad); break;
      case 'cos': res = Math.cos(rad); break;
      case 'tan':
        // tan(90°) = undefined
        if (unit === 'deg' && val % 180 === 90) {
          setResult('Undefined');
          setExpr(`tan(${val}°) =`);
          return;
        }
        res = Math.tan(rad);
        break;
      default: return;
    }
    const label = `${fn}(${val}${unit === 'deg' ? '°' : ' rad'})`;
    setExpr(label + ' =');
    setResult(String(parseFloat(res.toFixed(10))));
  };

  const inputClass =
    'relative z-10 w-full px-3 py-2 bg-[rgba(7,16,32,0.8)] border border-[rgba(0,255,231,0.2)] rounded-lg text-[rgba(226,235,240,0.8)] placeholder:text-[rgba(226,235,240,0.3)] focus:border-[rgba(0,255,231,0.5)] focus:outline-none font-mono text-sm';

  return (
    <div className="space-y-4">
      <Display expression={expr} result={result || '0'} />

      {/* Input sudut */}
      <div>
        <label className="text-xs text-[rgba(226,235,240,0.4)] mb-1 block font-mono">Sudut</label>
        <input
          type="number"
          value={angle}
          onChange={e => setAngle(e.target.value)}
          placeholder="Masukkan sudut..."
          className={inputClass}
        />
      </div>

      {/* Toggle Derajat / Radian */}
      <div className="flex gap-2">
        {['deg', 'rad'].map(u => (
          <button
            key={u}
            type="button"
            onClick={() => setUnit(u)}
            className={`relative z-10 flex-1 py-2 rounded-lg text-sm font-mono transition-all ${
              unit === u
                ? 'bg-[rgba(0,255,231,0.15)] border border-[rgba(0,255,231,0.5)] text-[#00FFE7]'
                : 'bg-[rgba(7,16,32,0.8)] border border-[rgba(0,255,231,0.1)] text-[rgba(226,235,240,0.4)]'
            }`}
          >
            {u === 'deg' ? '° Derajat' : 'rad Radian'}
          </button>
        ))}
      </div>

      {/* Tombol fungsi */}
      <div className="grid grid-cols-3 gap-2">
        <CalcButton label="sin" onClick={() => calc('sin')} variant="func" />
        <CalcButton label="cos" onClick={() => calc('cos')} variant="func" />
        <CalcButton label="tan" onClick={() => calc('tan')} variant="func" />
      </div>

      <button
        type="button"
        onClick={() => { setAngle(''); setResult(''); setExpr(''); }}
        className="relative z-10 w-full py-2 rounded-lg text-red-400 text-sm border border-[rgba(255,80,80,0.3)] bg-[rgba(255,80,80,0.05)] hover:bg-[rgba(255,80,80,0.1)] transition-all"
      >
        Reset
      </button>

      <div className="text-xs text-[rgba(226,235,240,0.3)] space-y-1 font-mono border-t border-[rgba(0,255,231,0.1)] pt-3">
        <p>• Pilih satuan <span className="text-violet-400">Derajat</span> atau <span className="text-violet-400">Radian</span></p>
        <p>• <span className="text-violet-400">tan(90°)</span> = Undefined (tidak terdefinisi)</p>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════
const TABS = [
  { id: 'case',    label: 'K.Case',    sub: 'Tambah · Kurang · Kali · Bagi',   score: 70 },
  { id: 'standar', label: 'K.Standar', sub: 'Pangkat · Sqrt · Max',            score: 80 },
  { id: 'math',    label: 'K.Math',    sub: 'Sin · Cos · Tan',                 score: 90 },
];

const Calculator = () => {
  const [active, setActive] = useState('case');

  return (
    <section id="calculator" className="relative z-10 py-20 px-6">
      <div className="max-w-md mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-display font-bold mb-4">
            Java<span className="gradient-text">Script</span> Calculator
          </h2>
          <div className="cyan-divider mx-auto mb-4" />
          <p className="text-[rgba(226,235,240,0.5)] text-sm">
            JavaScript (10) — 3 mode kalkulator
          </p>
        </div>

        {/* Tab switcher */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {TABS.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActive(tab.id)}
              className={`relative z-10 py-2 px-1 rounded-lg text-xs font-mono transition-all duration-200 ${
                active === tab.id
                  ? 'bg-[rgba(0,255,231,0.12)] border border-[rgba(0,255,231,0.5)] text-[#00FFE7]'
                  : 'bg-[rgba(7,16,32,0.6)] border border-[rgba(0,255,231,0.1)] text-[rgba(226,235,240,0.4)] hover:border-[rgba(0,255,231,0.3)]'
              }`}
            >
              <div className="font-bold">{tab.label}</div>
              <div className="text-[10px] opacity-60 mt-0.5">({tab.score})</div>
            </button>
          ))}
        </div>

        {/* Sub label */}
        <p className="text-center text-xs text-[rgba(226,235,240,0.3)] font-mono mb-4">
          {TABS.find(t => t.id === active)?.sub}
        </p>

        {/* Card */}
        <div className="glow-card rounded-xl p-6" style={{ isolation: 'isolate' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              {active === 'case'    && <KCase />}
              {active === 'standar' && <KStandar />}
              {active === 'math'    && <KMath />}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};

export default Calculator;