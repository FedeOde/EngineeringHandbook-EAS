import { executeQuery } from '../database/database';
import { Task } from '../database/types';

/**
 * Service for managing tasks with CRUD operations
 */
export class TaskService {
  /**
   * Creates a new task
   * @param description - The task description
   * @returns The created Task
   */
  async createTask(description: string): Promise<Task> {
    if (!description || description.trim().length === 0) {
      throw new Error('Task description cannot be empty');
    }

    const id = this.generateId();
    const createdAt = Date.now();

    try {
      await executeQuery(
        `INSERT INTO tasks (id, description, completed, created_at)
         VALUES (?, ?, ?, ?)`,
        [id, description.trim(), 0, createdAt]
      );

      return {
        id,
        description: description.trim(),
        completed: false,
        createdAt: new Date(createdAt),
      };
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  /**
   * Updates an existing task
   * @param id - The task ID
   * @param updates - Partial task updates
   * @returns The updated Task
   */
  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    try {
      // Build dynamic update query
      const updateFields: string[] = [];
      const params: any[] = [];

      if (updates.description !== undefined) {
        if (!updates.description || updates.description.trim().length === 0) {
          throw new Error('Task description cannot be empty');
        }
        updateFields.push('description = ?');
        params.push(updates.description.trim());
      }

      if (updates.completed !== undefined) {
        updateFields.push('completed = ?');
        params.push(updates.completed ? 1 : 0);

        if (updates.completed) {
          updateFields.push('completed_at = ?');
          params.push(Date.now());
        } else {
          updateFields.push('completed_at = NULL');
        }
      }

      if (updateFields.length === 0) {
        throw new Error('No fields to update');
      }

      params.push(id);

      await executeQuery(
        `UPDATE tasks SET ${updateFields.join(', ')} WHERE id = ?`,
        params
      );

      // Fetch and return the updated task
      const task = await this.getTask(id);
      if (!task) {
        throw new Error('Task not found after update');
      }

      return task;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  /**
   * Deletes a task
   * @param id - The task ID
   */
  async deleteTask(id: string): Promise<void> {
    try {
      await executeQuery(`DELETE FROM tasks WHERE id = ?`, [id]);
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }

  /**
   * Gets all tasks
   * @returns Array of all tasks, sorted by creation date (newest first)
   */
  async getAllTasks(): Promise<Task[]> {
    try {
      const rows = await executeQuery(
        `SELECT id, description, completed, created_at as createdAt, completed_at as completedAt
         FROM tasks
         ORDER BY created_at DESC`
      );

      return rows.map(this.mapRowToTask);
    } catch (error) {
      console.error('Error getting all tasks:', error);
      throw error;
    }
  }

  /**
   * Gets a single task by ID
   * @param id - The task ID
   * @returns The Task or null if not found
   */
  async getTask(id: string): Promise<Task | null> {
    try {
      const rows = await executeQuery(
        `SELECT id, description, completed, created_at as createdAt, completed_at as completedAt
         FROM tasks
         WHERE id = ?`,
        [id]
      );

      if (rows.length === 0) {
        return null;
      }

      return this.mapRowToTask(rows[0]);
    } catch (error) {
      console.error('Error getting task:', error);
      throw error;
    }
  }

  /**
   * Toggles task completion status
   * @param id - The task ID
   * @returns The updated Task
   */
  async toggleTaskCompletion(id: string): Promise<Task> {
    try {
      const task = await this.getTask(id);
      if (!task) {
        throw new Error('Task not found');
      }

      return await this.updateTask(id, { completed: !task.completed });
    } catch (error) {
      console.error('Error toggling task completion:', error);
      throw error;
    }
  }

  /**
   * Maps a database row to a Task object
   */
  private mapRowToTask(row: any): Task {
    return {
      id: row.id,
      description: row.description,
      completed: row.completed === 1,
      createdAt: new Date(row.createdAt),
      completedAt: row.completedAt ? new Date(row.completedAt) : undefined,
    };
  }

  /**
   * Generates a unique ID for a task
   */
  private generateId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
export const taskService = new TaskService();
