// Database utilities and exports
export {
  openDatabase,
  closeDatabase,
  initializeDatabase,
  getDatabase,
  executeQuery,
  resetDatabase,
  dropAllTables,
} from './database';

export { ALL_SCHEMAS } from './schema';
export { ALL_FLANGE_DATA } from './seedData/flanges';
export { ALL_DRILL_DATA } from './seedData/drills';

export type {
  FlangeSpecification,
  FlangeStandard,
  DrillSpecification,
  ThreadStandard,
} from './types';
