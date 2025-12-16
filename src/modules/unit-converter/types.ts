export type UnitCategory =
  | 'length'
  | 'area'
  | 'volume'
  | 'mass'
  | 'force'
  | 'temperature'
  | 'pressure'
  | 'power'
  | 'energy'
  | 'time'
  | 'viscosity';

export interface Unit {
  id: string;
  name: string;
  symbol: string;
  category: UnitCategory;
  toBase: (value: number) => number;
  fromBase: (value: number) => number;
}

export interface ConversionResult {
  value: number;
  fromUnit: Unit;
  toUnit: Unit;
}
