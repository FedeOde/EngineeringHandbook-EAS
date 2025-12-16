/**
 * Border radius system for consistent rounded corners
 */

export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  round: 9999,
} as const;

export type BorderRadiusKey = keyof typeof borderRadius;
