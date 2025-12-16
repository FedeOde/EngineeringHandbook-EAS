/**
 * Animation utilities and constants
 */

export const animationDuration = {
  fast: 150,
  normal: 250,
  slow: 350,
} as const;

export const animationEasing = {
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',
  linear: 'linear',
} as const;

// Common animation configurations for Animated API
export const springConfig = {
  tension: 40,
  friction: 7,
};

export const timingConfig = {
  duration: animationDuration.normal,
  useNativeDriver: true,
};
