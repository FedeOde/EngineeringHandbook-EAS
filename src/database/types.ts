// Database type definitions

export interface FlangeSpecification {
  id?: number;
  dn: number;
  inches: number;
  standard: FlangeStandard;
  class: string;
  od: number;
  pcd: number;
  boltCount: number;
  boltSize: string;
  thickness: number;
}

export type FlangeStandard = 'EN1092-1' | 'BS10' | 'ASME-B16.5';

export interface DrillSpecification {
  id?: number;
  standard: ThreadStandard;
  threadSize: string;
  pitch: number;
  tapDrillSize: number;
  tapDrillSizeImperial?: string;
}

export type ThreadStandard =
  | 'metric-coarse'
  | 'metric-fine'
  | 'unc'
  | 'unf'
  | 'bsw'
  | 'bsf'
  | 'bsp'
  | 'ba';

export interface Task {
  id: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
}
