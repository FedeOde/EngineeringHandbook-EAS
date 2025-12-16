// Bolt specifications and torque data

import { BoltSpecification, BoltGrade } from './types';

/**
 * Common metric bolt sizes with their nominal diameters in mm
 */
export const METRIC_BOLT_SIZES: BoltSpecification[] = [
  { size: 'M3', diameter: 3, isMetric: true },
  { size: 'M4', diameter: 4, isMetric: true },
  { size: 'M5', diameter: 5, isMetric: true },
  { size: 'M6', diameter: 6, isMetric: true },
  { size: 'M8', diameter: 8, isMetric: true },
  { size: 'M10', diameter: 10, isMetric: true },
  { size: 'M12', diameter: 12, isMetric: true },
  { size: 'M14', diameter: 14, isMetric: true },
  { size: 'M16', diameter: 16, isMetric: true },
  { size: 'M18', diameter: 18, isMetric: true },
  { size: 'M20', diameter: 20, isMetric: true },
  { size: 'M22', diameter: 22, isMetric: true },
  { size: 'M24', diameter: 24, isMetric: true },
  { size: 'M27', diameter: 27, isMetric: true },
  { size: 'M30', diameter: 30, isMetric: true },
  { size: 'M33', diameter: 33, isMetric: true },
  { size: 'M36', diameter: 36, isMetric: true },
  { size: 'M39', diameter: 39, isMetric: true },
  { size: 'M42', diameter: 42, isMetric: true },
  { size: 'M48', diameter: 48, isMetric: true },
  { size: 'M56', diameter: 56, isMetric: true },
  { size: 'M64', diameter: 64, isMetric: true },
];

/**
 * Common imperial bolt sizes with their nominal diameters in mm
 */
export const IMPERIAL_BOLT_SIZES: BoltSpecification[] = [
  { size: '1/4"', diameter: 6.35, isMetric: false },
  { size: '5/16"', diameter: 7.94, isMetric: false },
  { size: '3/8"', diameter: 9.53, isMetric: false },
  { size: '7/16"', diameter: 11.11, isMetric: false },
  { size: '1/2"', diameter: 12.7, isMetric: false },
  { size: '9/16"', diameter: 14.29, isMetric: false },
  { size: '5/8"', diameter: 15.88, isMetric: false },
  { size: '3/4"', diameter: 19.05, isMetric: false },
  { size: '7/8"', diameter: 22.23, isMetric: false },
  { size: '1"', diameter: 25.4, isMetric: false },
  { size: '1-1/8"', diameter: 28.58, isMetric: false },
  { size: '1-1/4"', diameter: 31.75, isMetric: false },
  { size: '1-3/8"', diameter: 34.93, isMetric: false },
  { size: '1-1/2"', diameter: 38.1, isMetric: false },
  { size: '1-3/4"', diameter: 44.45, isMetric: false },
  { size: '2"', diameter: 50.8, isMetric: false },
];

/**
 * Tensile strength values for different bolt grades (in MPa)
 */
export const BOLT_GRADE_STRENGTH: Record<BoltGrade, number> = {
  '4.6': 400,
  '4.8': 400,
  '5.8': 500,
  '8.8': 800,
  '10.9': 1000,
  '12.9': 1200,
  A2: 500, // Stainless steel A2-70
  A4: 500, // Stainless steel A4-70
};

/**
 * Friction coefficient (k-factor) for different lubrication conditions
 * Used in torque calculation: T = k × d × F
 */
export const FRICTION_COEFFICIENTS = {
  dry: 0.2, // Dry, unlubricated
  lubricated: 0.15, // Oil lubricated
  'anti-seize': 0.12, // Anti-seize compound
};

/**
 * Get all bolt sizes (metric and imperial)
 */
export function getAllBoltSizes(): BoltSpecification[] {
  return [...METRIC_BOLT_SIZES, ...IMPERIAL_BOLT_SIZES];
}

/**
 * Get bolt specification by size string
 */
export function getBoltBySize(size: string): BoltSpecification | undefined {
  return getAllBoltSizes().find((bolt) => bolt.size === size);
}

/**
 * Get all available bolt grades
 */
export function getAllBoltGrades(): BoltGrade[] {
  return ['4.6', '4.8', '5.8', '8.8', '10.9', '12.9', 'A2', 'A4'];
}
