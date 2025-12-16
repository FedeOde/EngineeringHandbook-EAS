import { TaskService } from './TaskService';
import { initializeDatabase, closeDatabase } from '../database/database';

describe('TaskService', () => {
  let service: TaskService;

  beforeAll(async () => {
    await initializeDatabase();
    service = new TaskService();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  beforeEach(async () => {
    // Clean up tasks before each test
    const tasks = await service.getAllTasks();
    for (const task of tasks) {
      await service.deleteTask(task.id);
    }
  });

  describe('createTask', () => {
    it('should create a new task with valid description', async () => {
      const description = 'Test task';
      const task = await service.createTask(description);

      expect(task).toBeDefined();
      expect(task.id).toBeDefined();
      expect(task.description).toBe(description);
      expect(task.completed).toBe(false);
      expect(task.createdAt).toBeInstanceOf(Date);
      expect(task.completedAt).toBeUndefined();
    });

    it('should trim whitespace from task description', async () => {
      const description = '  Test task with spaces  ';
      const task = await service.createTask(description);

      expect(task.description).toBe('Test task with spaces');
    });

    it('should throw error for empty description', async () => {
      await expect(service.createTask('')).rejects.toThrow('Task description cannot be empty');
    });

    it('should throw error for whitespace-only description', async () => {
      await expect(service.createTask('   ')).rejects.toThrow('Task description cannot be empty');
    });

    it('should create multiple tasks with unique IDs', async () => {
      const task1 = await service.createTask('Task 1');
      const task2 = await service.createTask('Task 2');

      expect(task1.id).not.toBe(task2.id);
    });
  });

  describe('getAllTasks', () => {
    it('should return empty array when no tasks exist', async () => {
      const tasks = await service.getAllTasks();
      expect(tasks).toEqual([]);
    });

    it('should return all created tasks', async () => {
      await service.createTask('Task 1');
      await service.createTask('Task 2');
      await service.createTask('Task 3');

      const tasks = await service.getAllTasks();
      expect(tasks.length).toBe(3);
    });

    it('should return tasks sorted by creation date (newest first)', async () => {
      const task1 = await service.createTask('Task 1');
      // Small delay to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 10));
      const task2 = await service.createTask('Task 2');
      await new Promise(resolve => setTimeout(resolve, 10));
      const task3 = await service.createTask('Task 3');

      const tasks = await service.getAllTasks();
      
      expect(tasks[0].id).toBe(task3.id);
      expect(tasks[1].id).toBe(task2.id);
      expect(tasks[2].id).toBe(task1.id);
    });
  });

  describe('getTask', () => {
    it('should return task by ID', async () => {
      const created = await service.createTask('Test task');
      const retrieved = await service.getTask(created.id);

      expect(retrieved).not.toBeNull();
      expect(retrieved?.id).toBe(created.id);
      expect(retrieved?.description).toBe(created.description);
    });

    it('should return null for non-existent task ID', async () => {
      const task = await service.getTask('non-existent-id');
      expect(task).toBeNull();
    });
  });

  describe('updateTask', () => {
    it('should update task description', async () => {
      const task = await service.createTask('Original description');
      const updated = await service.updateTask(task.id, { description: 'Updated description' });

      expect(updated.description).toBe('Updated description');
      expect(updated.id).toBe(task.id);
    });

    it('should update task completion status', async () => {
      const task = await service.createTask('Test task');
      const updated = await service.updateTask(task.id, { completed: true });

      expect(updated.completed).toBe(true);
      expect(updated.completedAt).toBeInstanceOf(Date);
    });

    it('should clear completedAt when marking task as incomplete', async () => {
      const task = await service.createTask('Test task');
      await service.updateTask(task.id, { completed: true });
      const updated = await service.updateTask(task.id, { completed: false });

      expect(updated.completed).toBe(false);
      expect(updated.completedAt).toBeUndefined();
    });

    it('should throw error for empty description update', async () => {
      const task = await service.createTask('Test task');
      await expect(service.updateTask(task.id, { description: '' })).rejects.toThrow(
        'Task description cannot be empty'
      );
    });

    it('should throw error when no fields to update', async () => {
      const task = await service.createTask('Test task');
      await expect(service.updateTask(task.id, {})).rejects.toThrow('No fields to update');
    });
  });

  describe('deleteTask', () => {
    it('should delete existing task', async () => {
      const task = await service.createTask('Test task');
      await service.deleteTask(task.id);

      const retrieved = await service.getTask(task.id);
      expect(retrieved).toBeNull();
    });

    it('should not throw error when deleting non-existent task', async () => {
      await expect(service.deleteTask('non-existent-id')).resolves.not.toThrow();
    });

    it('should remove task from getAllTasks results', async () => {
      const task1 = await service.createTask('Task 1');
      const task2 = await service.createTask('Task 2');
      
      await service.deleteTask(task1.id);
      
      const tasks = await service.getAllTasks();
      expect(tasks.length).toBe(1);
      expect(tasks[0].id).toBe(task2.id);
    });
  });

  describe('toggleTaskCompletion', () => {
    it('should toggle task from incomplete to complete', async () => {
      const task = await service.createTask('Test task');
      const toggled = await service.toggleTaskCompletion(task.id);

      expect(toggled.completed).toBe(true);
      expect(toggled.completedAt).toBeInstanceOf(Date);
    });

    it('should toggle task from complete to incomplete', async () => {
      const task = await service.createTask('Test task');
      await service.toggleTaskCompletion(task.id);
      const toggled = await service.toggleTaskCompletion(task.id);

      expect(toggled.completed).toBe(false);
      expect(toggled.completedAt).toBeUndefined();
    });

    it('should throw error for non-existent task', async () => {
      await expect(service.toggleTaskCompletion('non-existent-id')).rejects.toThrow(
        'Task not found'
      );
    });
  });
});
