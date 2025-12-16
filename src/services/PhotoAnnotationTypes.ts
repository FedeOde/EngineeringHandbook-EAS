/**
 * Photo Annotation Module Types
 * Defines data structures for photo annotations
 */

export type PhotoSource = 'camera' | 'gallery';

export type AnnotationType = 'text' | 'line' | 'arrow' | 'rectangle' | 'circle';

export interface Point {
  x: number;
  y: number;
}

export interface AnnotationProperties {
  color?: string;
  strokeWidth?: number;
  text?: string;
  fontSize?: number;
  startPoint?: Point;
  endPoint?: Point;
  width?: number;
  height?: number;
  radius?: number;
}

export interface Annotation {
  id: string;
  type: AnnotationType;
  position: Point;
  properties: AnnotationProperties;
}

export interface Photo {
  id: string;
  uri: string;
  originalUri: string;
  annotations: Annotation[];
  timestamp: Date;
}

export interface ExportFormat {
  format: 'jpeg' | 'png';
  quality?: number; // 0-1 for JPEG
}

export interface PhotoMetadata {
  id: string;
  originalUri: string;
  annotatedUri?: string;
  timestamp: number;
  annotationCount: number;
}
