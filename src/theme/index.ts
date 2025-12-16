/**
 * Main theme export
 * Combines all theme tokens into a single theme object
 */

import { ColorPalette, lightColors, darkColors } from './colors';
import { spacing } from './spacing';
import { typography } from './typography';
import { shadows } from './shadows';
import { borderRadius } from './borderRadius';

export interface Theme {
  colors: ColorPalette;
  spacing: typeof spacing;
  typography: typeof typography;
  shadows: typeof shadows;
  borderRadius: typeof borderRadius;
  isDark: boolean;
}

export const lightTheme: Theme = {
  colors: lightColors,
  spacing,
  typography,
  shadows,
  borderRadius,
  isDark: false,
};

export const darkTheme: Theme = {
  colors: darkColors,
  spacing,
  typography,
  shadows,
  borderRadius,
  isDark: true,
};

// Re-export individual theme tokens
export { lightColors, darkColors, spacing, typography, shadows, borderRadius };
export type { ColorPalette };
