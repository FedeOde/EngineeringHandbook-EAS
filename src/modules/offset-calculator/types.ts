// Offset calculator type definitions

export interface OffsetParameters {
  offsetDistance: number;
  angle: number;
  pipeDiameter?: number;
}

export interface OffsetResult {
  travel: number;
  rise: number;
  run: number;
  cutLength: number;
  diagram: DiagramData;
}

export interface DiagramData {
  offsetDistance: number;
  angle: number;
  travel: number;
  rise: number;
  run: number;
  pipeDiameter?: number;
}

export interface Point {
  x: number;
  y: number;
}
