// Torque calculator type definitions

export type BoltGrade =
  | '4.6'
  | '4.8'
  | '5.8'
  | '8.8'
  | '10.9'
  | '12.9'
  | 'A2'
  | 'A4';

export type LubricationCondition = 'dry' | 'lubricated' | 'anti-seize';

export type TorqueUnit = 'Nm' | 'ft-lb' | 'kg-m';

export interface TorqueValue {
  value: number;
  unit: TorqueUnit;
  range: { min: number; max: number };
}

export interface TorqueResult {
  Nm: number;
  'ft-lb': number;
  'kg-m': number;
  range: { min: number; max: number };
}

export interface BoltSpecification {
  size: string;
  diameter: number; // in mm
  isMetric: boolean;
}
