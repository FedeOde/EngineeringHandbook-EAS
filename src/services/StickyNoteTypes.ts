/**
 * Sticky Note Module Types
 * Defines data structures for sticky notes with drawing strokes
 */

export interface Point {
  x: number;
  y: number;
}

export interface DrawingStroke {
  points: Point[];
  color: string;
  width: number;
}

export interface StickyNote {
  id: string;
  strokes: DrawingStroke[];
  timestamp: Date;
}

export interface StickyNoteMetadata {
  id: string;
  timestamp: number;
  strokeCount: number;
}

export type DrawingTool = 'pen' | 'eraser';

export interface DrawingToolConfig {
  tool: DrawingTool;
  color: string;
  width: number;
}
