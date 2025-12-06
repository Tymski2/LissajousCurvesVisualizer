export interface SimulationParams {
  freqX: number;
  freqY: number;
  speed: number;
  lineWidth: number;
  opacity: number;
  colorSpeed: number;
  damping: number;
  ampX: number;
  ampY: number;
  substeps: number;
}

export const DEFAULT_PARAMS: SimulationParams = {
  freqX: 3,
  freqY: 2,
  speed: 0.05,
  lineWidth: 7,
  opacity: 0.8,
  colorSpeed: 1,
  damping: 0,
  ampX: 0.9,
  ampY: 0.9,
  substeps: 10,
};