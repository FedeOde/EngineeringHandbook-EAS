/**
 * Responsive layout utilities
 * Helps adapt UI to different screen sizes
 */

import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const screenWidth = width;
export const screenHeight = height;

// Breakpoints
export const breakpoints = {
  small: 375,
  medium: 768,
  large: 1024,
} as const;

export const isSmallDevice = width < breakpoints.medium;
export const isMediumDevice = width >= breakpoints.medium && width < breakpoints.large;
export const isLargeDevice = width >= breakpoints.large;

// Responsive scaling functions
export const scale = (size: number): number => {
  const baseWidth = 375; // iPhone SE width as base
  return (width / baseWidth) * size;
};

export const verticalScale = (size: number): number => {
  const baseHeight = 667; // iPhone SE height as base
  return (height / baseHeight) * size;
};

export const moderateScale = (size: number, factor: number = 0.5): number => {
  return size + (scale(size) - size) * factor;
};

// Minimum touch target size for accessibility (44x44 points on iOS, 48x48 on Android)
export const minTouchTarget = Platform.select({
  ios: 44,
  android: 48,
  default: 44,
});

// Safe area insets (approximate, for devices without notch)
export const safeAreaInsets = {
  top: Platform.select({ ios: 20, android: 0, default: 0 }),
  bottom: Platform.select({ ios: 0, android: 0, default: 0 }),
};
