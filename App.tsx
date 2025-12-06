import React, { useState, useCallback, useEffect } from 'react';
import { LissajousCanvas } from './components/LissajousCanvas';
import { ControlPanel } from './components/ControlPanel';
import { SimulationParams, DEFAULT_PARAMS } from './types';

const App: React.FC = () => {
  const [params, setParams] = useState<SimulationParams>(DEFAULT_PARAMS);
  const [isPaused, setIsPaused] = useState(false);
  const [clearTrigger, setClearTrigger] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [isAutoRandomize, setIsAutoRandomize] = useState(true);

  const handleClear = () => {
    setClearTrigger(prev => prev + 1);
  };

  const handleTogglePause = () => {
    setIsPaused(prev => !prev);
  };

  const handleAmplitudeUpdate = useCallback((ampX: number, ampY: number) => {
    setParams(prev => ({ ...prev, ampX, ampY }));
  }, []);

  useEffect(() => {
    let interval: number;
    if (isAutoRandomize) {
      interval = window.setInterval(() => {
        const newParams: SimulationParams = {
          freqX: Number((Math.random() * 12 + 1).toFixed(2)),
          freqY: Number((Math.random() * 12 + 1).toFixed(2)),
          // Biased to higher values
          speed: Number((Math.random() * 0.2 + 0.05).toFixed(3)), // 0.05 to 0.25
          lineWidth: Number((Math.random() * 12 + 4).toFixed(1)), // 4 to 16
          opacity: Number((Math.random() * 0.4 + 0.6).toFixed(2)), // 0.6 to 1.0
          colorSpeed: Number((Math.random() * 4 + 0.5).toFixed(1)),
          damping: Number(((Math.random() - 0.5) * 0.02).toFixed(4)),
          ampX: Number((Math.random() * 0.4 + 0.6).toFixed(2)),
          ampY: Number((Math.random() * 0.4 + 0.6).toFixed(2)),
          substeps: Math.floor(Math.random() * 40 + 5), // Random substeps between 5 and 45
        };
        setParams(newParams);
        handleClear();
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoRandomize]);

  return (
    <div className="w-full h-screen bg-black overflow-hidden relative font-sans text-white selection:bg-blue-500/30">
      <LissajousCanvas 
        params={params} 
        isPaused={isPaused} 
        clearTrigger={clearTrigger}
        onUpdateAmplitudes={handleAmplitudeUpdate}
      />
      
      {!showControls && (
        <button
          onClick={() => setShowControls(true)}
          className="fixed top-4 right-4 z-40 p-2 bg-gray-800/50 hover:bg-gray-700/80 backdrop-blur-md text-white rounded-lg border border-white/10 transition-all shadow-lg"
          title="Show Controls"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
        </button>
      )}

      <ControlPanel 
        params={params} 
        setParams={setParams} 
        onClear={handleClear}
        isPaused={isPaused}
        onTogglePause={handleTogglePause}
        isVisible={showControls}
        onClose={() => setShowControls(false)}
        isAutoRandomize={isAutoRandomize}
        setIsAutoRandomize={setIsAutoRandomize}
      />
    </div>
  );
};

export default App;