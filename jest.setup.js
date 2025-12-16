// Jest setup file for additional configuration
// import 'react-native-gesture-handler/jestSetup'; // Commented out - package not installed

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock SQLite with in-memory data store
const mockDataStore = {
  tasks: [],
  drill_specs: [],
  flanges: [],
};

jest.mock('react-native-sqlite-storage', () => {
  const mockDatabase = {
    transaction: jest.fn((callback) => {
      const tx = {
        executeSql: jest.fn((sql, params, successCallback, errorCallback) => {
          try {
            const result = executeMockSQL(sql, params);
            if (successCallback) {
              successCallback(tx, result);
            }
          } catch (error) {
            if (errorCallback) {
              errorCallback(tx, error);
            }
          }
        }),
      };
      callback(tx);
      return Promise.resolve();
    }),
    executeSql: jest.fn((sql, params) => {
      const result = executeMockSQL(sql, params);
      return Promise.resolve([result]);
    }),
    close: jest.fn(() => Promise.resolve()),
  };

  function executeMockSQL(sql, params = []) {
    const sqlLower = sql.toLowerCase();
    
    // CREATE TABLE
    if (sqlLower.includes('create table')) {
      return { rows: { length: 0, item: () => ({}) } };
    }
    
    // INSERT
    if (sqlLower.includes('insert into tasks')) {
      const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      const task = {
        id,
        description: params[0],
        completed: params[1] || 0,
        createdAt: params[2] || Date.now(),
        completedAt: params[3] || null,
      };
      mockDataStore.tasks.push(task);
      return { insertId: id, rows: { length: 0, item: () => ({}) } };
    }
    
    // SELECT tasks
    if (sqlLower.includes('select') && sqlLower.includes('from tasks')) {
      if (sqlLower.includes('where id')) {
        const task = mockDataStore.tasks.find(t => t.id === params[0]);
        return {
          rows: {
            length: task ? 1 : 0,
            item: (i) => task,
          },
        };
      }
      return {
        rows: {
          length: mockDataStore.tasks.length,
          item: (i) => mockDataStore.tasks[i],
        },
      };
    }
    
    // UPDATE tasks
    if (sqlLower.includes('update tasks')) {
      const taskIndex = mockDataStore.tasks.findIndex(t => t.id === params[params.length - 1]);
      if (taskIndex !== -1) {
        if (sqlLower.includes('description')) {
          mockDataStore.tasks[taskIndex].description = params[0];
        }
        if (sqlLower.includes('completed')) {
          mockDataStore.tasks[taskIndex].completed = params[0];
          mockDataStore.tasks[taskIndex].completedAt = params[1];
        }
      }
      return { rows: { length: 0, item: () => ({}) } };
    }
    
    // DELETE tasks
    if (sqlLower.includes('delete from tasks')) {
      mockDataStore.tasks = mockDataStore.tasks.filter(t => t.id !== params[0]);
      return { rows: { length: 0, item: () => ({}) } };
    }
    
    // Default empty result
    return { rows: { length: 0, item: () => ({}) } };
  }

  const SQLite = {
    openDatabase: jest.fn(() => mockDatabase),
    enablePromise: jest.fn(() => true),
  };

  SQLite.default = SQLite;
  
  return SQLite;
});

// Silence the warning: Animated: `useNativeDriver` is not supported
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
