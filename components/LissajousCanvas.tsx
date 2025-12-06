import React, { useRef, useEffect, useCallback } from 'react';
import { SimulationParams } from '../types';

interface LissajousCanvasProps {
  params: SimulationParams;
  isPaused: boolean;
  clearTrigger: number;
  onUpdateAmplitudes: (ax: number, ay: number) => void;
}

export const LissajousCanvas: React.FC<LissajousCanvasProps> = ({ 
  params, 
  isPaused, 
  clearTrigger,
  onUpdateAmplitudes
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const lastSyncTimeRef = useRef<number>(0);
  
  // Use a ref for params to access them in the loop without closure staleness
  const paramsRef = useRef(params);
  
  // Simulation state
  const stateRef = useRef({
    angleX: 0,
    angleY: 0,
    hue: 0,
    prevX: 0,
    prevY: 0,
    isFirstDraw: true,
    ampX: params.ampX,
    ampY: params.ampY,
  });

  // Update refs when props change
  useEffect(() => {
    paramsRef.current = params;
    // We only force-update the internal amplitude if the props have significantly changed
    // from what we expect. This allows the user to drag the slider without fighting
    // the physics engine too much, but ensures user input wins over damping.
    const diffX = Math.abs(stateRef.current.ampX - params.ampX);
    const diffY = Math.abs(stateRef.current.ampY - params.ampY);
    
    // Threshold to prevent feedback loops where micro-adjustments from damping trigger resets
    if (diffX > 0.001) stateRef.current.ampX = params.ampX;
    if (diffY > 0.001) stateRef.current.ampY = params.ampY;
  }, [params]);

  // Handle Resize
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    
    stateRef.current.isFirstDraw = true;
    // Don't reset amplitude on resize, keep the current flow
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial size
    
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // Handle Clear Trigger
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stateRef.current.isFirstDraw = true;
    // Reset amplitudes to current params (sliders)
    // We use paramsRef here to avoid adding params to the dependency array
    // This prevents the canvas from clearing when we just want to adjust the amplitude sliders
    stateRef.current.ampX = paramsRef.current.ampX;
    stateRef.current.ampY = paramsRef.current.ampY;
  }, [clearTrigger]);

  // Main Animation Loop
  const animate = useCallback(() => {
    if (isPaused) {
        requestRef.current = requestAnimationFrame(animate);
        return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const p = paramsRef.current;
    const s = stateRef.current;

    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;
    
    const maxRadiusX = (width / 2);
    const maxRadiusY = (height / 2);

    ctx.lineWidth = p.lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    const SUBSTEPS = Math.max(1, Math.floor(p.substeps));
    const timeStep = 0.05 / SUBSTEPS;

    // Damping factor calculation
    // Reduced strength significantly (div by 100 instead of 10) for finer control
    const dampingFactor = 1 - (p.damping / 100);

    for (let i = 0; i < SUBSTEPS; i++) {
        // Apply damping (or acceleration if damping is negative)
        if (p.damping !== 0) {
            s.ampX *= dampingFactor;
            s.ampY *= dampingFactor;

            // If accelerating (negative damping), cap amplitude at 1.0
            if (p.damping < 0) {
              if (s.ampX > 1) s.ampX = 1;
              if (s.ampY > 1) s.ampY = 1;
            }
        }

        // Stop drawing if energy is effectively zero
        if (s.ampX < 0.001 && s.ampY < 0.001) continue;

        const currentRadiusX = maxRadiusX * s.ampX;
        const currentRadiusY = maxRadiusY * s.ampY;

        // Lissajous Math
        s.angleX += p.freqX * p.speed * timeStep; 
        s.angleY += p.freqY * p.speed * timeStep;
        
        s.hue = (s.hue + (p.colorSpeed / SUBSTEPS)) % 360;

        const x = cx + Math.sin(s.angleX) * currentRadiusX;
        const y = cy + Math.sin(s.angleY) * currentRadiusY;

        if (s.isFirstDraw) {
            s.prevX = x;
            s.prevY = y;
            s.isFirstDraw = false;
        }

        ctx.beginPath();
        ctx.strokeStyle = `hsla(${s.hue}, 100%, 60%, ${p.opacity})`;
        
        ctx.moveTo(s.prevX, s.prevY);
        ctx.lineTo(x, y);
        ctx.stroke();

        s.prevX = x;
        s.prevY = y;
    }

    // Sync state back to React (throttle to ~10fps to avoid lag)
    const now = performance.now();
    // Sync if time has passed AND there is a discrepancy (due to physics)
    if (now - lastSyncTimeRef.current > 100) {
        if (Math.abs(s.ampX - p.ampX) > 0.001 || Math.abs(s.ampY - p.ampY) > 0.001) {
             onUpdateAmplitudes(s.ampX, s.ampY);
             lastSyncTimeRef.current = now;
        }
    }

    requestRef.current = requestAnimationFrame(animate);
  }, [isPaused, onUpdateAmplitudes]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [animate]);

  return (
    <div ref={containerRef} className="fixed inset-0 bg-black touch-none overflow-hidden">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};