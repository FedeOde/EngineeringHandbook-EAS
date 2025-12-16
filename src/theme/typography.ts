/**
 * Typography system for consistent text styling
 */

import { TextStyle } from 'react-native';

export interface Typography {
  h1: TextStyle;
  h2: TextStyle;
  h3: TextStyle;
  h4: TextStyle;
  body: TextStyle;
  bodyLarge: TextStyle;
  bodySmall: TextStyle;
  caption: TextStyle;
  button: TextStyle;
  label: TextStyle;
}

export const typography: Typography = {
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 36,
  },
  h3: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  bodyLarge: {
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 26,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
};
