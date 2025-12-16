import * as fc from 'fast-check';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppInitializationService } from './AppInitializationService';
import { TaskService } from './TaskService';
import { StickyNoteService } from './StickyNoteService';
import { LanguageService } from './LanguageService';
import { initializeDatabase, closeDatabase, executeQuery } from '../database/database';
import { Language } from '../types/language.types';
import { DrawingStroke } from './StickyNoteTypes';

describe('AppInitializationService - Property-Based Tests', () => {
  let appService: AppInitializationService;
  let taskService: TaskService;
  let stickyNoteService: StickyNoteService;

  beforeAll(async () => {
    await initializeDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  beforeEach(async () => {
    // Get fresh service instances
    appService = AppInitializationService.getInstance();
    appService.reset();
    taskService = new TaskService();
    stickyNoteService = new StickyNoteService();

    // Clear all data before each test
    await AsyncStorage.clear();
    await executeQuery('DELETE FROM tasks');
  });

  afterEach(async () => {
    // Clean up after each test
    await AsyncStorage.clear();
    await executeQuery('DELETE FROM tasks');
  });

  // Feature: engineering-pocket-helper, Property 28: Application restart data persistence
  // Validates: Requirements 11.2
  it('should restore all user data after application restart', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate language setting
        fc.constantFrom<Language>('en', 'es'),
        // Generate tasks data
        fc.array(
          fc.record({
            description: fc.string({ minLength: 1, maxLength: 200 }).filter(s => s.trim().length > 0),
            completed: fc.boolean(),
          }),
          { minLength: 0, maxLength: 10 }
        ),
        // Generate sticky notes data
        fc.array(
          fc.array(
            fc.record({
              points: fc.array(
                fc.record({
                  x: fc.double({ min: 0, max: 1000, noNaN: true }),
                  y: fc.double({ min: 0, max: 1000, noNaN: true }),
                }),
                { minLength: 1, maxLength: 20 }
              ),
              color: fc.constantFrom('#000000', '#FF0000', '#00FF00', '#0000FF'),
              width: fc.integer({ min: 1, max: 10 }),
            }),
            { minLength: 0, maxLength: 10 }
          ),
          { minLength: 0, maxLength: 5 }
        ),
        async (
          language: Language,
          tasksData: Array<{ description: string; completed: boolean }>,
          stickyNotesData: DrawingStroke[][]
        ) => {
          // ===== PHASE 1: Initialize app and create user data =====
          
          // Initialize the application
          await LanguageService.initialize();
          const initResult = await appService.initialize();
          expect(initResult.success).toBe(true);

          // Set language preference
          await LanguageService.setLanguage(language);
          const languageBeforeRestart = LanguageService.getCurrentLanguage();

          // Create tasks
          const createdTasks = [];
          for (const taskData of tasksData) {
            const task = await taskService.createTask(taskData.description);
            if (taskData.completed) {
              await taskService.updateTask(task.id, { completed: true });
            }
            createdTasks.push({
              id: task.id,
              description: taskData.description.trim(),
              completed: taskData.completed,
            });
          }

          // Create sticky notes
          const createdNotes = [];
          for (const strokesData of stickyNotesData) {
            const note = stickyNoteService.createNote();
            note.strokes = strokesData;
            const savedId = await stickyNoteService.saveNote(note);
            createdNotes.push({
              id: savedId,
              strokes: strokesData,
            });
          }

          // Verify data was created successfully
          const tasksBeforeRestart = await taskService.getAllTasks();
          const notesBeforeRestart = await stickyNoteService.getAllNotes();
          
          expect(tasksBeforeRestart.length).toBe(createdTasks.length);
          expect(notesBeforeRestart.length).toBe(createdNotes.length);

          // ===== PHASE 2: Simulate application restart =====
          
          // Reset the app initialization service to simulate restart
          appService.reset();

          // Re-initialize the application (simulating app restart)
          const restartInitResult = await appService.initialize();
          expect(restartInitResult.success).toBe(true);

          // ===== PHASE 3: Verify all data persisted after restart =====

          // Property: Language setting should persist
          const languageAfterRestart = LanguageService.getCurrentLanguage();
          expect(languageAfterRestart).toBe(languageBeforeRestart);
          expect(languageAfterRestart).toBe(language);

          // Property: All tasks should persist with correct data
          const tasksAfterRestart = await taskService.getAllTasks();
          expect(tasksAfterRestart.length).toBe(createdTasks.length);

          for (const createdTask of createdTasks) {
            const foundTask = tasksAfterRestart.find(t => t.id === createdTask.id);
            
            // Property: Each task should be retrievable after restart
            expect(foundTask).toBeDefined();
            
            // Property: Task description should match
            expect(foundTask!.description).toBe(createdTask.description);
            
            // Property: Task completion status should match
            expect(foundTask!.completed).toBe(createdTask.completed);
            
            // Property: Task should have valid timestamps
            expect(foundTask!.createdAt).toBeInstanceOf(Date);
            expect(foundTask!.createdAt.getTime()).not.toBeNaN();
            
            if (createdTask.completed) {
              expect(foundTask!.completedAt).toBeInstanceOf(Date);
              expect(foundTask!.completedAt!.getTime()).not.toBeNaN();
            }
          }

          // Property: All sticky notes should persist with correct data
          const notesAfterRestart = await stickyNoteService.getAllNotes();
          expect(notesAfterRestart.length).toBe(createdNotes.length);

          for (const createdNote of createdNotes) {
            const foundNote = notesAfterRestart.find(n => n.id === createdNote.id);
            
            // Property: Each note should be retrievable after restart
            expect(foundNote).toBeDefined();
            
            // Property: Note strokes should match
            expect(foundNote!.strokes).toEqual(createdNote.strokes);
            
            // Property: Note should have valid timestamp
            expect(foundNote!.timestamp).toBeInstanceOf(Date);
            expect(foundNote!.timestamp.getTime()).not.toBeNaN();
          }

          // Property: Data integrity should be maintained
          const integrityOk = await appService.isInitialized();
          expect(integrityOk).toBe(true);

          // Clean up after this iteration
          for (const task of createdTasks) {
            await taskService.deleteTask(task.id);
          }
          for (const note of createdNotes) {
            await stickyNoteService.deleteNote(note.id);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
