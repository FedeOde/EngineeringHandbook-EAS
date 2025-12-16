import { Unit, UnitCategory } from './types';

// Length units (base: meter)
const lengthUnits: Unit[] = [
  {
    id: 'meter',
    name: 'Meter',
    symbol: 'm',
    category: 'length',
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  {
    id: 'kilometer',
    name: 'Kilometer',
    symbol: 'km',
    category: 'length',
    toBase: (v) => v * 1000,
    fromBase: (v) => v / 1000,
  },
  {
    id: 'centimeter',
    name: 'Centimeter',
    symbol: 'cm',
    category: 'length',
    toBase: (v) => v / 100,
    fromBase: (v) => v * 100,
  },
  {
    id: 'millimeter',
    name: 'Millimeter',
    symbol: 'mm',
    category: 'length',
    toBase: (v) => v / 1000,
    fromBase: (v) => v * 1000,
  },
  {
    id: 'inch',
    name: 'Inch',
    symbol: 'in',
    category: 'length',
    toBase: (v) => v * 0.0254,
    fromBase: (v) => v / 0.0254,
  },
  {
    id: 'foot',
    name: 'Foot',
    symbol: 'ft',
    category: 'length',
    toBase: (v) => v * 0.3048,
    fromBase: (v) => v / 0.3048,
  },
  {
    id: 'yard',
    name: 'Yard',
    symbol: 'yd',
    category: 'length',
    toBase: (v) => v * 0.9144,
    fromBase: (v) => v / 0.9144,
  },
  {
    id: 'mile',
    name: 'Mile',
    symbol: 'mi',
    category: 'length',
    toBase: (v) => v * 1609.344,
    fromBase: (v) => v / 1609.344,
  },
];

// Area units (base: square meter)
const areaUnits: Unit[] = [
  {
    id: 'square_meter',
    name: 'Square Meter',
    symbol: 'm²',
    category: 'area',
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  {
    id: 'square_kilometer',
    name: 'Square Kilometer',
    symbol: 'km²',
    category: 'area',
    toBase: (v) => v * 1000000,
    fromBase: (v) => v / 1000000,
  },
  {
    id: 'square_centimeter',
    name: 'Square Centimeter',
    symbol: 'cm²',
    category: 'area',
    toBase: (v) => v / 10000,
    fromBase: (v) => v * 10000,
  },
  {
    id: 'square_millimeter',
    name: 'Square Millimeter',
    symbol: 'mm²',
    category: 'area',
    toBase: (v) => v / 1000000,
    fromBase: (v) => v * 1000000,
  },
  {
    id: 'square_inch',
    name: 'Square Inch',
    symbol: 'in²',
    category: 'area',
    toBase: (v) => v * 0.00064516,
    fromBase: (v) => v / 0.00064516,
  },
  {
    id: 'square_foot',
    name: 'Square Foot',
    symbol: 'ft²',
    category: 'area',
    toBase: (v) => v * 0.09290304,
    fromBase: (v) => v / 0.09290304,
  },
  {
    id: 'acre',
    name: 'Acre',
    symbol: 'ac',
    category: 'area',
    toBase: (v) => v * 4046.8564224,
    fromBase: (v) => v / 4046.8564224,
  },
  {
    id: 'hectare',
    name: 'Hectare',
    symbol: 'ha',
    category: 'area',
    toBase: (v) => v * 10000,
    fromBase: (v) => v / 10000,
  },
];

// Volume units (base: cubic meter)
const volumeUnits: Unit[] = [
  {
    id: 'cubic_meter',
    name: 'Cubic Meter',
    symbol: 'm³',
    category: 'volume',
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  {
    id: 'liter',
    name: 'Liter',
    symbol: 'L',
    category: 'volume',
    toBase: (v) => v / 1000,
    fromBase: (v) => v * 1000,
  },
  {
    id: 'milliliter',
    name: 'Milliliter',
    symbol: 'mL',
    category: 'volume',
    toBase: (v) => v / 1000000,
    fromBase: (v) => v * 1000000,
  },
  {
    id: 'cubic_centimeter',
    name: 'Cubic Centimeter',
    symbol: 'cm³',
    category: 'volume',
    toBase: (v) => v / 1000000,
    fromBase: (v) => v * 1000000,
  },
  {
    id: 'cubic_inch',
    name: 'Cubic Inch',
    symbol: 'in³',
    category: 'volume',
    toBase: (v) => v * 0.000016387064,
    fromBase: (v) => v / 0.000016387064,
  },
  {
    id: 'cubic_foot',
    name: 'Cubic Foot',
    symbol: 'ft³',
    category: 'volume',
    toBase: (v) => v * 0.028316846592,
    fromBase: (v) => v / 0.028316846592,
  },
  {
    id: 'gallon_us',
    name: 'Gallon (US)',
    symbol: 'gal',
    category: 'volume',
    toBase: (v) => v * 0.003785411784,
    fromBase: (v) => v / 0.003785411784,
  },
  {
    id: 'gallon_uk',
    name: 'Gallon (UK)',
    symbol: 'gal (UK)',
    category: 'volume',
    toBase: (v) => v * 0.00454609,
    fromBase: (v) => v / 0.00454609,
  },
];

// Mass units (base: kilogram)
const massUnits: Unit[] = [
  {
    id: 'kilogram',
    name: 'Kilogram',
    symbol: 'kg',
    category: 'mass',
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  {
    id: 'gram',
    name: 'Gram',
    symbol: 'g',
    category: 'mass',
    toBase: (v) => v / 1000,
    fromBase: (v) => v * 1000,
  },
  {
    id: 'milligram',
    name: 'Milligram',
    symbol: 'mg',
    category: 'mass',
    toBase: (v) => v / 1000000,
    fromBase: (v) => v * 1000000,
  },
  {
    id: 'metric_ton',
    name: 'Metric Ton',
    symbol: 't',
    category: 'mass',
    toBase: (v) => v * 1000,
    fromBase: (v) => v / 1000,
  },
  {
    id: 'pound',
    name: 'Pound',
    symbol: 'lb',
    category: 'mass',
    toBase: (v) => v * 0.45359237,
    fromBase: (v) => v / 0.45359237,
  },
  {
    id: 'ounce',
    name: 'Ounce',
    symbol: 'oz',
    category: 'mass',
    toBase: (v) => v * 0.028349523125,
    fromBase: (v) => v / 0.028349523125,
  },
  {
    id: 'ton_us',
    name: 'Ton (US)',
    symbol: 'ton',
    category: 'mass',
    toBase: (v) => v * 907.18474,
    fromBase: (v) => v / 907.18474,
  },
];

// Force units (base: Newton)
const forceUnits: Unit[] = [
  {
    id: 'newton',
    name: 'Newton',
    symbol: 'N',
    category: 'force',
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  {
    id: 'kilonewton',
    name: 'Kilonewton',
    symbol: 'kN',
    category: 'force',
    toBase: (v) => v * 1000,
    fromBase: (v) => v / 1000,
  },
  {
    id: 'pound_force',
    name: 'Pound Force',
    symbol: 'lbf',
    category: 'force',
    toBase: (v) => v * 4.4482216152605,
    fromBase: (v) => v / 4.4482216152605,
  },
  {
    id: 'kilogram_force',
    name: 'Kilogram Force',
    symbol: 'kgf',
    category: 'force',
    toBase: (v) => v * 9.80665,
    fromBase: (v) => v / 9.80665,
  },
  {
    id: 'dyne',
    name: 'Dyne',
    symbol: 'dyn',
    category: 'force',
    toBase: (v) => v / 100000,
    fromBase: (v) => v * 100000,
  },
];

// Temperature units (base: Kelvin)
const temperatureUnits: Unit[] = [
  {
    id: 'kelvin',
    name: 'Kelvin',
    symbol: 'K',
    category: 'temperature',
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  {
    id: 'celsius',
    name: 'Celsius',
    symbol: '°C',
    category: 'temperature',
    toBase: (v) => v + 273.15,
    fromBase: (v) => v - 273.15,
  },
  {
    id: 'fahrenheit',
    name: 'Fahrenheit',
    symbol: '°F',
    category: 'temperature',
    toBase: (v) => ((v - 32) * 5) / 9 + 273.15,
    fromBase: (v) => ((v - 273.15) * 9) / 5 + 32,
  },
];

// Pressure units (base: Pascal)
const pressureUnits: Unit[] = [
  {
    id: 'pascal',
    name: 'Pascal',
    symbol: 'Pa',
    category: 'pressure',
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  {
    id: 'kilopascal',
    name: 'Kilopascal',
    symbol: 'kPa',
    category: 'pressure',
    toBase: (v) => v * 1000,
    fromBase: (v) => v / 1000,
  },
  {
    id: 'megapascal',
    name: 'Megapascal',
    symbol: 'MPa',
    category: 'pressure',
    toBase: (v) => v * 1000000,
    fromBase: (v) => v / 1000000,
  },
  {
    id: 'bar',
    name: 'Bar',
    symbol: 'bar',
    category: 'pressure',
    toBase: (v) => v * 100000,
    fromBase: (v) => v / 100000,
  },
  {
    id: 'psi',
    name: 'PSI',
    symbol: 'psi',
    category: 'pressure',
    toBase: (v) => v * 6894.757293168,
    fromBase: (v) => v / 6894.757293168,
  },
  {
    id: 'atmosphere',
    name: 'Atmosphere',
    symbol: 'atm',
    category: 'pressure',
    toBase: (v) => v * 101325,
    fromBase: (v) => v / 101325,
  },
  {
    id: 'torr',
    name: 'Torr',
    symbol: 'Torr',
    category: 'pressure',
    toBase: (v) => v * 133.322368,
    fromBase: (v) => v / 133.322368,
  },
];

// Power units (base: Watt)
const powerUnits: Unit[] = [
  {
    id: 'watt',
    name: 'Watt',
    symbol: 'W',
    category: 'power',
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  {
    id: 'kilowatt',
    name: 'Kilowatt',
    symbol: 'kW',
    category: 'power',
    toBase: (v) => v * 1000,
    fromBase: (v) => v / 1000,
  },
  {
    id: 'megawatt',
    name: 'Megawatt',
    symbol: 'MW',
    category: 'power',
    toBase: (v) => v * 1000000,
    fromBase: (v) => v / 1000000,
  },
  {
    id: 'horsepower',
    name: 'Horsepower',
    symbol: 'hp',
    category: 'power',
    toBase: (v) => v * 745.69987158227,
    fromBase: (v) => v / 745.69987158227,
  },
  {
    id: 'btu_per_hour',
    name: 'BTU per Hour',
    symbol: 'BTU/h',
    category: 'power',
    toBase: (v) => v * 0.29307107,
    fromBase: (v) => v / 0.29307107,
  },
];

// Energy units (base: Joule)
const energyUnits: Unit[] = [
  {
    id: 'joule',
    name: 'Joule',
    symbol: 'J',
    category: 'energy',
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  {
    id: 'kilojoule',
    name: 'Kilojoule',
    symbol: 'kJ',
    category: 'energy',
    toBase: (v) => v * 1000,
    fromBase: (v) => v / 1000,
  },
  {
    id: 'megajoule',
    name: 'Megajoule',
    symbol: 'MJ',
    category: 'energy',
    toBase: (v) => v * 1000000,
    fromBase: (v) => v / 1000000,
  },
  {
    id: 'calorie',
    name: 'Calorie',
    symbol: 'cal',
    category: 'energy',
    toBase: (v) => v * 4.184,
    fromBase: (v) => v / 4.184,
  },
  {
    id: 'kilocalorie',
    name: 'Kilocalorie',
    symbol: 'kcal',
    category: 'energy',
    toBase: (v) => v * 4184,
    fromBase: (v) => v / 4184,
  },
  {
    id: 'watt_hour',
    name: 'Watt Hour',
    symbol: 'Wh',
    category: 'energy',
    toBase: (v) => v * 3600,
    fromBase: (v) => v / 3600,
  },
  {
    id: 'kilowatt_hour',
    name: 'Kilowatt Hour',
    symbol: 'kWh',
    category: 'energy',
    toBase: (v) => v * 3600000,
    fromBase: (v) => v / 3600000,
  },
  {
    id: 'btu',
    name: 'BTU',
    symbol: 'BTU',
    category: 'energy',
    toBase: (v) => v * 1055.05585262,
    fromBase: (v) => v / 1055.05585262,
  },
];

// Time units (base: second)
const timeUnits: Unit[] = [
  {
    id: 'second',
    name: 'Second',
    symbol: 's',
    category: 'time',
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  {
    id: 'minute',
    name: 'Minute',
    symbol: 'min',
    category: 'time',
    toBase: (v) => v * 60,
    fromBase: (v) => v / 60,
  },
  {
    id: 'hour',
    name: 'Hour',
    symbol: 'h',
    category: 'time',
    toBase: (v) => v * 3600,
    fromBase: (v) => v / 3600,
  },
  {
    id: 'day',
    name: 'Day',
    symbol: 'd',
    category: 'time',
    toBase: (v) => v * 86400,
    fromBase: (v) => v / 86400,
  },
  {
    id: 'week',
    name: 'Week',
    symbol: 'wk',
    category: 'time',
    toBase: (v) => v * 604800,
    fromBase: (v) => v / 604800,
  },
  {
    id: 'year',
    name: 'Year',
    symbol: 'yr',
    category: 'time',
    toBase: (v) => v * 31536000,
    fromBase: (v) => v / 31536000,
  },
];

// Viscosity units (base: Pascal-second)
const viscosityUnits: Unit[] = [
  {
    id: 'pascal_second',
    name: 'Pascal Second',
    symbol: 'Pa·s',
    category: 'viscosity',
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  {
    id: 'poise',
    name: 'Poise',
    symbol: 'P',
    category: 'viscosity',
    toBase: (v) => v * 0.1,
    fromBase: (v) => v / 0.1,
  },
  {
    id: 'centipoise',
    name: 'Centipoise',
    symbol: 'cP',
    category: 'viscosity',
    toBase: (v) => v * 0.001,
    fromBase: (v) => v / 0.001,
  },
  {
    id: 'pound_per_foot_second',
    name: 'Pound per Foot Second',
    symbol: 'lb/(ft·s)',
    category: 'viscosity',
    toBase: (v) => v * 1.4881639,
    fromBase: (v) => v / 1.4881639,
  },
];

// Combine all units
export const allUnits: Unit[] = [
  ...lengthUnits,
  ...areaUnits,
  ...volumeUnits,
  ...massUnits,
  ...forceUnits,
  ...temperatureUnits,
  ...pressureUnits,
  ...powerUnits,
  ...energyUnits,
  ...timeUnits,
  ...viscosityUnits,
];

// Helper function to get units by category
export function getUnitsByCategory(category: UnitCategory): Unit[] {
  return allUnits.filter((unit) => unit.category === category);
}

// Helper function to get unit by id
export function getUnitById(id: string): Unit | undefined {
  return allUnits.find((unit) => unit.id === id);
}

// Get all categories
export function getAllCategories(): UnitCategory[] {
  return [
    'length',
    'area',
    'volume',
    'mass',
    'force',
    'temperature',
    'pressure',
    'power',
    'energy',
    'time',
    'viscosity',
  ];
}
