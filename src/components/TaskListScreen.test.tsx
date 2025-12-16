import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { TaskListScreen } from './TaskListScreen';
import { taskService } from '../services/TaskService';
import { initializeDatabase, closeDatabase } from '../database/database';

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('TaskListScreen', () => {
  beforeAll(async () => {
    await initializeDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  beforeEach(async () => {
    // Clean up tasks before each test
    const tasks = await taskService.getAllTasks();
    for (const task of tasks) {
      await taskService.deleteTask(task.id);
    }
  });

  it('should render without crashing', () => {
    const { getByText } = render(<TaskListScreen />);
    expect(getByText('tasks.title')).toBeTruthy();
  });

  it('should display empty state when no tasks exist', async () => {
    const { getByText } = render(<TaskListScreen />);
    
    await waitFor(() => {
      expect(getByText('tasks.noTasks')).toBeTruthy();
    });
  });

  it('should display tasks when they exist', async () => {
    // Create a task
    await taskService.createTask('Test task');

    const { getByText } = render(<TaskListScreen />);
    
    await waitFor(() => {
      expect(getByText('Test task')).toBeTruthy();
    });
  });

  it('should display multiple tasks', async () => {
    await taskService.createTask('Task 1');
    await taskService.createTask('Task 2');
    await taskService.createTask('Task 3');

    const { getByText } = render(<TaskListScreen />);
    
    await waitFor(() => {
      expect(getByText('Task 1')).toBeTruthy();
      expect(getByText('Task 2')).toBeTruthy();
      expect(getByText('Task 3')).toBeTruthy();
    });
  });
});
