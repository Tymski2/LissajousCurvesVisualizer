import React from 'react';
import { SimulationParams } from '../types';

interface ControlPanelProps {
  params: SimulationParams;
  setParams: React.Dispatch<React.SetStateAction<SimulationParams>>;
  onClear: () => void;
  isPaused: boolean;
  onTogglePause: () => void;
  isVisible: boolean;
  onClose: () => void;
  isAutoRandomize: boolean;
  setIsAutoRandomize: (val: boolean) => void;
}

const Slider: React.FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (val: number) => void;
}> = ({ label, value, min, max, step, onChange }) => (
  <div className="mb-3">
    <div className="flex justify-between items-center mb-1">
      <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">{label}</label>
      <span className="text-[10px] text-blue-300 font-mono">{Number.isInteger(step) ? value : value.toFixed(4)}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-colors"
    />
  </div>
);

export const ControlPanel: React.FC<ControlPanelProps> = ({
  params,
  setParams,
  onClear,
  isPaused,
  onTogglePause,
  isVisible,
  onClose,
  isAutoRandomize,
  setIsAutoRandomize
}) => {
  if (!isVisible) return null;

  const updateParam = (key: keyof SimulationParams, value: number) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="fixed top-4 right-4 z-50 w-72 bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-2xl shadow-blue-900/20 text-white max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-end gap-2 mb-4">
           <button
            onClick={onTogglePause}
            className={`p-1.5 rounded-md transition-colors ${isPaused ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'}`}
            title={isPaused ? "Resume" : "Pause"}
          >
            {isPaused ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
            )}
          </button>
          <button
            onClick={onClear}
            className="p-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-md transition-colors"
            title="Clear Canvas"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
          </button>
          <button
            onClick={onClose}
            className="p-1.5 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 rounded-md transition-colors"
            title="Hide Controls"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
      </div>

      <div className="mb-4 flex items-center justify-between p-2 rounded-lg bg-blue-900/10 border border-blue-500/10">
        <label htmlFor="auto-randomize" className="text-xs font-medium text-blue-200 cursor-pointer select-none">Auto Randomize (5s)</label>
        <div 
          onClick={() => setIsAutoRandomize(!isAutoRandomize)}
          className={`w-9 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${isAutoRandomize ? 'bg-blue-500' : 'bg-gray-700'}`}
        >
          <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-300 ${isAutoRandomize ? 'translate-x-4' : ''}`}></div>
        </div>
      </div>

      <div className="space-y-1">
        <Slider
          label="Amplitude X"
          value={params.ampX}
          min={0}
          max={1}
          step={0.01}
          onChange={(v) => updateParam('ampX', v)}
        />
        <Slider
          label="Amplitude Y"
          value={params.ampY}
          min={0}
          max={1}
          step={0.01}
          onChange={(v) => updateParam('ampY', v)}
        />
        <Slider
          label="Frequency X"
          value={params.freqX}
          min={0}
          max={20}
          step={0.01}
          onChange={(v) => updateParam('freqX', v)}
        />
        <Slider
          label="Frequency Y"
          value={params.freqY}
          min={0}
          max={20}
          step={0.01}
          onChange={(v) => updateParam('freqY', v)}
        />
        <Slider
          label="Speed"
          value={params.speed}
          min={0.01}
          max={3.0}
          step={0.01}
          onChange={(v) => updateParam('speed', v)}
        />
        <Slider
          label="Substeps"
          value={params.substeps}
          min={1}
          max={200}
          step={1}
          onChange={(v) => updateParam('substeps', v)}
        />
        <Slider
          label="Damping"
          value={params.damping}
          min={-0.05}
          max={0.05}
          step={0.0001}
          onChange={(v) => updateParam('damping', v)}
        />
         <Slider
          label="Color Cycle"
          value={params.colorSpeed}
          min={0}
          max={5}
          step={0.1}
          onChange={(v) => updateParam('colorSpeed', v)}
        />
        <Slider
          label="Line Width"
          value={params.lineWidth}
          min={0.5}
          max={20}
          step={0.5}
          onChange={(v) => updateParam('lineWidth', v)}
        />
         <Slider
          label="Opacity"
          value={params.opacity}
          min={0.1}
          max={1}
          step={0.1}
          onChange={(v) => updateParam('opacity', v)}
        />
      </div>
    </div>
  );
};