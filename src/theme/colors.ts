/**
 * Color palette for the application
 * Supports both light and dark themes
 */

export interface ColorPalette {
  // Primary colors
  primary: string;
  primaryLight: string;
  primaryDark: string;
  
  // Background colors
  background: string;
  surface: string;
  card: string;
  
  // Text colors
  text: string;
  textSecondary: string;
  textDisabled: string;
  
  // Border colors
  border: string;
  borderLight: string;
  
  // Status colors
  success: string;
  successLight: string;
  successDark: string;
  error: string;
  errorLight: string;
  errorDark: string;
  warning: string;
  warningLight: string;
  warningDark: string;
  info: string;
  infoLight: string;
  infoDark: string;
  
  // Feature colors (for different sections)
  feature1: string;
  feature2: string;
  feature3: string;
  feature4: string;
  feature5: string;
  feature6: string;
  feature7: string;
  feature8: string;
  feature9: string;
  
  // Overlay
  overlay: string;
  
  // Shadow
  shadow: string;
}

export const lightColors: ColorPalette = {
  // Primary colors
  primary: '#007AFF',
  primaryLight: '#4DA3FF',
  primaryDark: '#0051CC',
  
  // Background colors
  background: '#F5F5F5',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  
  // Text colors
  text: '#000000',
  textSecondary: '#666666',
  textDisabled: '#999999',
  
  // Border colors
  border: '#E5E5E5',
  borderLight: '#F0F0F0',
  
  // Status colors
  success: '#4CAF50',
  successLight: '#E8F5E9',
  successDark: '#2E7D32',
  error: '#F44336',
  errorLight: '#FFEBEE',
  errorDark: '#C62828',
  warning: '#FBC02D',
  warningLight: '#FFF9C4',
  warningDark: '#F57F17',
  info: '#2196F3',
  infoLight: '#E3F2FD',
  infoDark: '#1565C0',
  
  // Feature colors
  feature1: '#007AFF',
  feature2: '#5856D6',
  feature3: '#AF52DE',
  feature4: '#FF9500',
  feature5: '#FF2D55',
  feature6: '#34C759',
  feature7: '#00C7BE',
  feature8: '#FFD60A',
  feature9: '#FF3B30',
  
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  
  // Shadow
  shadow: '#000000',
};

export const darkColors: ColorPalette = {
  // Primary colors
  primary: '#0A84FF',
  primaryLight: '#409CFF',
  primaryDark: '#0066CC',
  
  // Background colors
  background: '#000000',
  surface: '#1C1C1E',
  card: '#2C2C2E',
  
  // Text colors
  text: '#FFFFFF',
  textSecondary: '#AEAEB2',
  textDisabled: '#636366',
  
  // Border colors
  border: '#38383A',
  borderLight: '#48484A',
  
  // Status colors
  success: '#32D74B',
  successLight: '#1C3A20',
  successDark: '#30D158',
  error: '#FF453A',
  errorLight: '#3A1C1C',
  errorDark: '#FF6961',
  warning: '#FFD60A',
  warningLight: '#3A3520',
  warningDark: '#FFE135',
  info: '#64D2FF',
  infoLight: '#1C2E3A',
  infoDark: '#70D7FF',
  
  // Feature colors
  feature1: '#0A84FF',
  feature2: '#5E5CE6',
  feature3: '#BF5AF2',
  feature4: '#FF9F0A',
  feature5: '#FF375F',
  feature6: '#32D74B',
  feature7: '#5AC8FA',
  feature8: '#FFD60A',
  feature9: '#FF453A',
  
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.7)',
  
  // Shadow
  shadow: '#000000',
};
