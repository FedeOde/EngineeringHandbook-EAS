import { DrillSpecification } from '../types';

// Metric Coarse Thread Specifications
export const METRIC_COARSE: DrillSpecification[] = [
  { standard: 'metric-coarse', threadSize: 'M1.6', pitch: 0.35, tapDrillSize: 1.25 },
  { standard: 'metric-coarse', threadSize: 'M2', pitch: 0.4, tapDrillSize: 1.6 },
  { standard: 'metric-coarse', threadSize: 'M2.5', pitch: 0.45, tapDrillSize: 2.05 },
  { standard: 'metric-coarse', threadSize: 'M3', pitch: 0.5, tapDrillSize: 2.5 },
  { standard: 'metric-coarse', threadSize: 'M4', pitch: 0.7, tapDrillSize: 3.3 },
  { standard: 'metric-coarse', threadSize: 'M5', pitch: 0.8, tapDrillSize: 4.2 },
  { standard: 'metric-coarse', threadSize: 'M6', pitch: 1.0, tapDrillSize: 5.0 },
  { standard: 'metric-coarse', threadSize: 'M8', pitch: 1.25, tapDrillSize: 6.8 },
  { standard: 'metric-coarse', threadSize: 'M10', pitch: 1.5, tapDrillSize: 8.5 },
  { standard: 'metric-coarse', threadSize: 'M12', pitch: 1.75, tapDrillSize: 10.2 },
  { standard: 'metric-coarse', threadSize: 'M14', pitch: 2.0, tapDrillSize: 12.0 },
  { standard: 'metric-coarse', threadSize: 'M16', pitch: 2.0, tapDrillSize: 14.0 },
  { standard: 'metric-coarse', threadSize: 'M18', pitch: 2.5, tapDrillSize: 15.5 },
  { standard: 'metric-coarse', threadSize: 'M20', pitch: 2.5, tapDrillSize: 17.5 },
  { standard: 'metric-coarse', threadSize: 'M22', pitch: 2.5, tapDrillSize: 19.5 },
  { standard: 'metric-coarse', threadSize: 'M24', pitch: 3.0, tapDrillSize: 21.0 },
  { standard: 'metric-coarse', threadSize: 'M27', pitch: 3.0, tapDrillSize: 24.0 },
  { standard: 'metric-coarse', threadSize: 'M30', pitch: 3.5, tapDrillSize: 26.5 },
  { standard: 'metric-coarse', threadSize: 'M33', pitch: 3.5, tapDrillSize: 29.5 },
  { standard: 'metric-coarse', threadSize: 'M36', pitch: 4.0, tapDrillSize: 32.0 },
];

// Metric Fine Thread Specifications
export const METRIC_FINE: DrillSpecification[] = [
  { standard: 'metric-fine', threadSize: 'M6x0.75', pitch: 0.75, tapDrillSize: 5.25 },
  { standard: 'metric-fine', threadSize: 'M8x1.0', pitch: 1.0, tapDrillSize: 7.0 },
  { standard: 'metric-fine', threadSize: 'M10x1.25', pitch: 1.25, tapDrillSize: 8.75 },
  { standard: 'metric-fine', threadSize: 'M12x1.25', pitch: 1.25, tapDrillSize: 10.75 },
  { standard: 'metric-fine', threadSize: 'M12x1.5', pitch: 1.5, tapDrillSize: 10.5 },
  { standard: 'metric-fine', threadSize: 'M14x1.5', pitch: 1.5, tapDrillSize: 12.5 },
  { standard: 'metric-fine', threadSize: 'M16x1.5', pitch: 1.5, tapDrillSize: 14.5 },
  { standard: 'metric-fine', threadSize: 'M18x1.5', pitch: 1.5, tapDrillSize: 16.5 },
  { standard: 'metric-fine', threadSize: 'M20x1.5', pitch: 1.5, tapDrillSize: 18.5 },
  { standard: 'metric-fine', threadSize: 'M22x1.5', pitch: 1.5, tapDrillSize: 20.5 },
  { standard: 'metric-fine', threadSize: 'M24x2.0', pitch: 2.0, tapDrillSize: 22.0 },
  { standard: 'metric-fine', threadSize: 'M27x2.0', pitch: 2.0, tapDrillSize: 25.0 },
  { standard: 'metric-fine', threadSize: 'M30x2.0', pitch: 2.0, tapDrillSize: 28.0 },
];

// UNC (Unified National Coarse) Thread Specifications
export const UNC: DrillSpecification[] = [
  { standard: 'unc', threadSize: '#4-40', pitch: 0.635, tapDrillSize: 2.26, tapDrillSizeImperial: '#43' },
  { standard: 'unc', threadSize: '#6-32', pitch: 0.794, tapDrillSize: 2.77, tapDrillSizeImperial: '#36' },
  { standard: 'unc', threadSize: '#8-32', pitch: 0.794, tapDrillSize: 3.43, tapDrillSizeImperial: '#29' },
  { standard: 'unc', threadSize: '#10-24', pitch: 1.058, tapDrillSize: 3.91, tapDrillSizeImperial: '#25' },
  { standard: 'unc', threadSize: '1/4"-20', pitch: 1.27, tapDrillSize: 5.1, tapDrillSizeImperial: '#7' },
  { standard: 'unc', threadSize: '5/16"-18', pitch: 1.411, tapDrillSize: 6.5, tapDrillSizeImperial: 'F' },
  { standard: 'unc', threadSize: '3/8"-16', pitch: 1.588, tapDrillSize: 7.94, tapDrillSizeImperial: '5/16"' },
  { standard: 'unc', threadSize: '7/16"-14', pitch: 1.814, tapDrillSize: 9.3, tapDrillSizeImperial: 'U' },
  { standard: 'unc', threadSize: '1/2"-13', pitch: 1.954, tapDrillSize: 10.72, tapDrillSizeImperial: '27/64"' },
  { standard: 'unc', threadSize: '9/16"-12', pitch: 2.117, tapDrillSize: 12.1, tapDrillSizeImperial: '31/64"' },
  { standard: 'unc', threadSize: '5/8"-11', pitch: 2.309, tapDrillSize: 13.49, tapDrillSizeImperial: '17/32"' },
  { standard: 'unc', threadSize: '3/4"-10', pitch: 2.54, tapDrillSize: 16.27, tapDrillSizeImperial: '21/32"' },
  { standard: 'unc', threadSize: '7/8"-9', pitch: 2.822, tapDrillSize: 19.05, tapDrillSizeImperial: '49/64"' },
  { standard: 'unc', threadSize: '1"-8', pitch: 3.175, tapDrillSize: 21.43, tapDrillSizeImperial: '7/8"' },
];

// UNF (Unified National Fine) Thread Specifications
export const UNF: DrillSpecification[] = [
  { standard: 'unf', threadSize: '#4-48', pitch: 0.529, tapDrillSize: 2.39, tapDrillSizeImperial: '#42' },
  { standard: 'unf', threadSize: '#6-40', pitch: 0.635, tapDrillSize: 2.87, tapDrillSizeImperial: '#33' },
  { standard: 'unf', threadSize: '#8-36', pitch: 0.706, tapDrillSize: 3.56, tapDrillSizeImperial: '#29' },
  { standard: 'unf', threadSize: '#10-32', pitch: 0.794, tapDrillSize: 4.04, tapDrillSizeImperial: '#21' },
  { standard: 'unf', threadSize: '1/4"-28', pitch: 0.907, tapDrillSize: 5.49, tapDrillSizeImperial: '#3' },
  { standard: 'unf', threadSize: '5/16"-24', pitch: 1.058, tapDrillSize: 6.86, tapDrillSizeImperial: 'I' },
  { standard: 'unf', threadSize: '3/8"-24', pitch: 1.058, tapDrillSize: 8.33, tapDrillSizeImperial: 'Q' },
  { standard: 'unf', threadSize: '7/16"-20', pitch: 1.27, tapDrillSize: 9.7, tapDrillSizeImperial: '25/64"' },
  { standard: 'unf', threadSize: '1/2"-20', pitch: 1.27, tapDrillSize: 11.11, tapDrillSizeImperial: '29/64"' },
  { standard: 'unf', threadSize: '9/16"-18', pitch: 1.411, tapDrillSize: 12.5, tapDrillSizeImperial: '33/64"' },
  { standard: 'unf', threadSize: '5/8"-18', pitch: 1.411, tapDrillSize: 13.89, tapDrillSizeImperial: '37/64"' },
  { standard: 'unf', threadSize: '3/4"-16', pitch: 1.588, tapDrillSize: 16.67, tapDrillSizeImperial: '11/16"' },
  { standard: 'unf', threadSize: '7/8"-14', pitch: 1.814, tapDrillSize: 19.45, tapDrillSizeImperial: '13/16"' },
  { standard: 'unf', threadSize: '1"-12', pitch: 2.117, tapDrillSize: 22.23, tapDrillSizeImperial: '59/64"' },
];

// BSW (British Standard Whitworth) Thread Specifications
export const BSW: DrillSpecification[] = [
  { standard: 'bsw', threadSize: '1/8"', pitch: 1.016, tapDrillSize: 2.65, tapDrillSizeImperial: '#35' },
  { standard: 'bsw', threadSize: '3/16"', pitch: 1.27, tapDrillSize: 4.0, tapDrillSizeImperial: '#22' },
  { standard: 'bsw', threadSize: '1/4"', pitch: 1.27, tapDrillSize: 5.1, tapDrillSizeImperial: '#7' },
  { standard: 'bsw', threadSize: '5/16"', pitch: 1.411, tapDrillSize: 6.5, tapDrillSizeImperial: 'F' },
  { standard: 'bsw', threadSize: '3/8"', pitch: 1.588, tapDrillSize: 7.94, tapDrillSizeImperial: '5/16"' },
  { standard: 'bsw', threadSize: '7/16"', pitch: 1.814, tapDrillSize: 9.25, tapDrillSizeImperial: '23/64"' },
  { standard: 'bsw', threadSize: '1/2"', pitch: 2.117, tapDrillSize: 10.5, tapDrillSizeImperial: '13/32"' },
  { standard: 'bsw', threadSize: '9/16"', pitch: 2.117, tapDrillSize: 11.91, tapDrillSizeImperial: '15/32"' },
  { standard: 'bsw', threadSize: '5/8"', pitch: 2.309, tapDrillSize: 13.1, tapDrillSizeImperial: '33/64"' },
  { standard: 'bsw', threadSize: '3/4"', pitch: 2.54, tapDrillSize: 15.88, tapDrillSizeImperial: '5/8"' },
  { standard: 'bsw', threadSize: '7/8"', pitch: 2.822, tapDrillSize: 18.65, tapDrillSizeImperial: '47/64"' },
  { standard: 'bsw', threadSize: '1"', pitch: 3.175, tapDrillSize: 21.43, tapDrillSizeImperial: '27/32"' },
];

// BSF (British Standard Fine) Thread Specifications
export const BSF: DrillSpecification[] = [
  { standard: 'bsf', threadSize: '3/16"', pitch: 1.058, tapDrillSize: 4.17, tapDrillSizeImperial: '#21' },
  { standard: 'bsf', threadSize: '1/4"', pitch: 1.058, tapDrillSize: 5.31, tapDrillSizeImperial: '#4' },
  { standard: 'bsf', threadSize: '5/16"', pitch: 1.27, tapDrillSize: 6.75, tapDrillSizeImperial: 'H' },
  { standard: 'bsf', threadSize: '3/8"', pitch: 1.411, tapDrillSize: 8.2, tapDrillSizeImperial: '21/64"' },
  { standard: 'bsf', threadSize: '7/16"', pitch: 1.588, tapDrillSize: 9.53, tapDrillSizeImperial: '3/8"' },
  { standard: 'bsf', threadSize: '1/2"', pitch: 1.814, tapDrillSize: 10.9, tapDrillSizeImperial: '7/16"' },
  { standard: 'bsf', threadSize: '9/16"', pitch: 1.814, tapDrillSize: 12.3, tapDrillSizeImperial: '31/64"' },
  { standard: 'bsf', threadSize: '5/8"', pitch: 1.814, tapDrillSize: 13.69, tapDrillSizeImperial: '35/64"' },
  { standard: 'bsf', threadSize: '3/4"', pitch: 2.117, tapDrillSize: 16.27, tapDrillSizeImperial: '41/64"' },
  { standard: 'bsf', threadSize: '7/8"', pitch: 2.309, tapDrillSize: 19.05, tapDrillSizeImperial: '3/4"' },
  { standard: 'bsf', threadSize: '1"', pitch: 2.54, tapDrillSize: 21.83, tapDrillSizeImperial: '55/64"' },
];

// BSP (British Standard Pipe) Thread Specifications
export const BSP: DrillSpecification[] = [
  { standard: 'bsp', threadSize: '1/8"', pitch: 0.907, tapDrillSize: 8.57, tapDrillSizeImperial: 'R' },
  { standard: 'bsp', threadSize: '1/4"', pitch: 1.337, tapDrillSize: 11.45, tapDrillSizeImperial: '29/64"' },
  { standard: 'bsp', threadSize: '3/8"', pitch: 1.337, tapDrillSize: 15.25, tapDrillSizeImperial: '19/32"' },
  { standard: 'bsp', threadSize: '1/2"', pitch: 1.814, tapDrillSize: 19.05, tapDrillSizeImperial: '3/4"' },
  { standard: 'bsp', threadSize: '5/8"', pitch: 1.814, tapDrillSize: 21.0, tapDrillSizeImperial: '53/64"' },
  { standard: 'bsp', threadSize: '3/4"', pitch: 1.814, tapDrillSize: 24.61, tapDrillSizeImperial: '31/32"' },
  { standard: 'bsp', threadSize: '7/8"', pitch: 1.814, tapDrillSize: 28.18, tapDrillSizeImperial: '1-7/64"' },
  { standard: 'bsp', threadSize: '1"', pitch: 2.309, tapDrillSize: 30.29, tapDrillSizeImperial: '1-3/16"' },
  { standard: 'bsp', threadSize: '1-1/4"', pitch: 2.309, tapDrillSize: 39.37, tapDrillSizeImperial: '1-35/64"' },
  { standard: 'bsp', threadSize: '1-1/2"', pitch: 2.309, tapDrillSize: 45.24, tapDrillSizeImperial: '1-25/32"' },
  { standard: 'bsp', threadSize: '2"', pitch: 2.309, tapDrillSize: 56.64, tapDrillSizeImperial: '2-15/64"' },
];

// BA (British Association) Thread Specifications
export const BA: DrillSpecification[] = [
  { standard: 'ba', threadSize: '0BA', pitch: 1.0, tapDrillSize: 5.1 },
  { standard: 'ba', threadSize: '1BA', pitch: 0.9, tapDrillSize: 4.5 },
  { standard: 'ba', threadSize: '2BA', pitch: 0.81, tapDrillSize: 3.9 },
  { standard: 'ba', threadSize: '3BA', pitch: 0.73, tapDrillSize: 3.4 },
  { standard: 'ba', threadSize: '4BA', pitch: 0.66, tapDrillSize: 2.95 },
  { standard: 'ba', threadSize: '5BA', pitch: 0.59, tapDrillSize: 2.55 },
  { standard: 'ba', threadSize: '6BA', pitch: 0.53, tapDrillSize: 2.2 },
  { standard: 'ba', threadSize: '7BA', pitch: 0.48, tapDrillSize: 1.9 },
  { standard: 'ba', threadSize: '8BA', pitch: 0.43, tapDrillSize: 1.65 },
  { standard: 'ba', threadSize: '9BA', pitch: 0.39, tapDrillSize: 1.4 },
  { standard: 'ba', threadSize: '10BA', pitch: 0.35, tapDrillSize: 1.2 },
];

// Export all drill data
export const ALL_DRILL_DATA: DrillSpecification[] = [
  ...METRIC_COARSE,
  ...METRIC_FINE,
  ...UNC,
  ...UNF,
  ...BSW,
  ...BSF,
  ...BSP,
  ...BA,
];
