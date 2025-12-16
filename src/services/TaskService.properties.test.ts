import * as fc from 'fast-check';
import { TaskService } from './TaskService';
import { initializeDatabase, closeDatabase } from '../database/database';

describe('TaskService - Property-Based Tests', () => {
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

  // Feature: engineering-pocket-helper, Property 18: Task creation state
  // Validates: Requirements 8.1
  it('should create tasks with unchecked status for any valid description', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate valid task descriptions (non-empty strings with at least one non-whitespace character)
        fc.string({ minLength: 1, maxLength: 500 }).filter(s => s.trim().length > 0),
        async (description: string) => {
          // Create a new task
          const createdTask = await service.createTask(description);

          // Property: The task should have completed status set to false
          expect(createdTask.completed).toBe(false);
          expect(createdTask.completedAt).toBeUndefined();

          // Property: The task should appear in the task list
          const allTasks = await service.getAllTasks();
          const foundTask = allTasks.find(t => t.id === createdTask.id);
          
          expect(foundTask).toBeDefined();
          expect(foundTask?.completed).toBe(false);
          expect(foundTask?.description).toBe(description.trim());

          // Clean up after this iteration
          await service.deleteTask(createdTask.id);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: engineering-pocket-helper, Property 19: Task completion toggle
  // Validates: Requirements 8.2
  it('should toggle completion status from false to true or true to false for any task', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate valid task descriptions
        fc.string({ minLength: 1, maxLength: 500 }).filter(s => s.trim().length > 0),
        // Generate initial completion status (true or false)
        fc.boolean(),
        async (description: string, initialCompleted: boolean) => {
          // Create a new task
          const createdTask = await service.createTask(description);
          
          // Set initial completion status if needed
          if (initialCompleted) {
            await service.updateTask(createdTask.id, { completed: true });
          }

          // Get the task to verify initial state
          const taskBefore = await service.getTask(createdTask.id);
          expect(taskBefore).not.toBeNull();
          expect(taskBefore!.completed).toBe(initialCompleted);

          // Toggle the completion status
          const toggledTask = await service.toggleTaskCompletion(createdTask.id);

          // Property: The completion status should be inverted
          expect(toggledTask.completed).toBe(!initialCompleted);

          // If toggled to completed, completedAt should be set
          if (toggledTask.completed) {
            expect(toggledTask.completedAt).toBeInstanceOf(Date);
          } else {
            // If toggled to incomplete, completedAt should be undefined
            expect(toggledTask.completedAt).toBeUndefined();
          }

          // Verify the change persisted by retrieving the task again
          const taskAfter = await service.getTask(createdTask.id);
          expect(taskAfter).not.toBeNull();
          expect(taskAfter!.completed).toBe(!initialCompleted);

          // Clean up after this iteration
          await service.deleteTask(createdTask.id);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: engineering-pocket-helper, Property 20: Task persistence round-trip
  // Validates: Requirements 8.3
  it('should persist and retrieve tasks with the same description and completion status', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate valid task descriptions
        fc.string({ minLength: 1, maxLength: 500 }).filter(s => s.trim().length > 0),
        // Generate completion status (true or false)
        fc.boolean(),
        async (description: string, completed: boolean) => {
          // Create a new task
          const createdTask = await service.createTask(description);
          
          // Set the completion status
          if (completed) {
            await service.updateTask(createdTask.id, { completed: true });
          }

          // Retrieve the task from storage
          const retrievedTask = await service.getTask(createdTask.id);

          // Property: Retrieved task should not be null
          expect(retrievedTask).not.toBeNull();

          // Property: Description should match (trimmed)
          expect(retrievedTask!.description).toBe(description.trim());

          // Property: Completion status should match
          expect(retrievedTask!.completed).toBe(completed);

          // Property: If completed, completedAt should be set
          if (completed) {
            expect(retrievedTask!.completedAt).toBeInstanceOf(Date);
          } else {
            expect(retrievedTask!.completedAt).toBeUndefined();
          }

          // Property: ID should match
          expect(retrievedTask!.id).toBe(createdTask.id);

          // Property: createdAt should be a valid Date
          expect(retrievedTask!.createdAt).toBeInstanceOf(Date);

          // Verify the task also appears in getAllTasks with same properties
          const allTasks = await service.getAllTasks();
          const foundTask = allTasks.find(t => t.id === createdTask.id);
          
          expect(foundTask).toBeDefined();
          expect(foundTask!.description).toBe(description.trim());
          expect(foundTask!.completed).toBe(completed);

          // Clean up after this iteration
          await service.deleteTask(createdTask.id);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: engineering-pocket-helper, Property 21: Task deletion completeness
  // Validates: Requirements 8.4
  it('should not return deleted tasks in subsequent queries', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate valid task descriptions
        fc.string({ minLength: 1, maxLength: 500 }).filter(s => s.trim().length > 0),
        // Generate completion status (true or false)
        fc.boolean(),
        async (description: string, completed: boolean) => {
          // Create a new task
          const createdTask = await service.createTask(description);
          
          // Set the completion status if needed
          if (completed) {
            await service.updateTask(createdTask.id, { completed: true });
          }

          // Verify the task exists before deletion
          const taskBeforeDeletion = await service.getTask(createdTask.id);
          expect(taskBeforeDeletion).not.toBeNull();
          expect(taskBeforeDeletion!.id).toBe(createdTask.id);

          // Verify the task appears in getAllTasks before deletion
          const allTasksBefore = await service.getAllTasks();
          const foundBefore = allTasksBefore.find(t => t.id === createdTask.id);
          expect(foundBefore).toBeDefined();

          // Delete the task
          await service.deleteTask(createdTask.id);

          // Property: The deleted task should not be retrievable by getTask
          const taskAfterDeletion = await service.getTask(createdTask.id);
          expect(taskAfterDeletion).toBeNull();

          // Property: The deleted task should not appear in getAllTasks
          const allTasksAfter = await service.getAllTasks();
          const foundAfter = allTasksAfter.find(t => t.id === createdTask.id);
          expect(foundAfter).toBeUndefined();

          // Property: The task count should have decreased
          expect(allTasksAfter.length).toBe(allTasksBefore.length - 1);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: engineering-pocket-helper, Property 22: Task description mutability
  // Validates: Requirements 8.5
  it('should update task description and retrieve the new description for any task', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate valid initial task description
        fc.string({ minLength: 1, maxLength: 500 }).filter(s => s.trim().length > 0),
        // Generate valid new task description (different from the first)
        fc.string({ minLength: 1, maxLength: 500 }).filter(s => s.trim().length > 0),
        async (initialDescription: string, newDescription: string) => {
          // Create a new task with initial description
          const createdTask = await service.createTask(initialDescription);

          // Verify the task was created with the initial description
          const taskBeforeUpdate = await service.getTask(createdTask.id);
          expect(taskBeforeUpdate).not.toBeNull();
          expect(taskBeforeUpdate!.description).toBe(initialDescription.trim());

          // Update the task description
          const updatedTask = await service.updateTask(createdTask.id, { 
            description: newDescription 
          });

          // Property: The updated task should have the new description
          expect(updatedTask.description).toBe(newDescription.trim());

          // Property: The task ID should remain the same
          expect(updatedTask.id).toBe(createdTask.id);

          // Property: Other fields should remain unchanged
          expect(updatedTask.completed).toBe(createdTask.completed);
          expect(updatedTask.createdAt.getTime()).toBe(createdTask.createdAt.getTime());

          // Property: Retrieving the task should return the new description
          const retrievedTask = await service.getTask(createdTask.id);
          expect(retrievedTask).not.toBeNull();
          expect(retrievedTask!.description).toBe(newDescription.trim());

          // Property: The task in getAllTasks should also have the new description
          const allTasks = await service.getAllTasks();
          const foundTask = allTasks.find(t => t.id === createdTask.id);
          expect(foundTask).toBeDefined();
          expect(foundTask!.description).toBe(newDescription.trim());

          // Clean up after this iteration
          await service.deleteTask(createdTask.id);
        }
      ),
      { numRuns: 100 }
    );
  });
});
