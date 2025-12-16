import * as fc from 'fast-check';
import { StickyNoteService } from './StickyNoteService';
import { DrawingStroke } from './StickyNoteTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';

describe('StickyNoteService - Property-Based Tests', () => {
  let service: StickyNoteService;

  beforeEach(async () => {
    service = new StickyNoteService();
    // Clear AsyncStorage before each test
    await AsyncStorage.clear();
  });

  afterEach(async () => {
    // Clean up after each test
    await AsyncStorage.clear();
  });

  // Feature: engineering-pocket-helper, Property 23: Sticky note timestamp presence
  // Validates: Requirements 9.3
  it('should have a valid timestamp field for any saved sticky note', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate random drawing strokes
        fc.array(
          fc.record({
            points: fc.array(
              fc.record({
                x: fc.double({ min: 0, max: 1000, noNaN: true }),
                y: fc.double({ min: 0, max: 1000, noNaN: true }),
              }),
              { minLength: 1, maxLength: 100 }
            ),
            color: fc.constantFrom('#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00'),
            width: fc.integer({ min: 1, max: 10 }),
          }),
          { minLength: 0, maxLength: 50 }
        ),
        async (strokes: DrawingStroke[]) => {
          // Create a new sticky note
          const note = service.createNote();
          note.strokes = strokes;

          // Save the note
          const savedId = await service.saveNote(note);

          // Retrieve the saved note
          const retrievedNote = await service.getNote(savedId);

          // Property: Retrieved note should not be null
          expect(retrievedNote).not.toBeNull();

          // Property: The note should have a timestamp field
          expect(retrievedNote!.timestamp).toBeDefined();

          // Property: The timestamp should be a valid Date object
          expect(retrievedNote!.timestamp).toBeInstanceOf(Date);

          // Property: The timestamp should represent a valid date and time
          expect(retrievedNote!.timestamp.getTime()).not.toBeNaN();

          // Property: The timestamp should be a reasonable value (not in the distant past or future)
          const now = Date.now();
          const timestampValue = retrievedNote!.timestamp.getTime();
          // Should be within the last hour and not in the future (with 1 second tolerance)
          expect(timestampValue).toBeGreaterThan(now - 3600000); // Within last hour
          expect(timestampValue).toBeLessThanOrEqual(now + 1000); // Not more than 1 second in future

          // Property: The timestamp should also be present when retrieving all notes
          const allNotes = await service.getAllNotes();
          const foundNote = allNotes.find(n => n.id === savedId);
          
          expect(foundNote).toBeDefined();
          expect(foundNote!.timestamp).toBeDefined();
          expect(foundNote!.timestamp).toBeInstanceOf(Date);
          expect(foundNote!.timestamp.getTime()).not.toBeNaN();

          // Clean up after this iteration
          await service.deleteNote(savedId);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: engineering-pocket-helper, Property 24: Sticky note CRUD operations
  // Validates: Requirements 9.4
  it('should support complete CRUD operations for any sticky note', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate initial strokes
        fc.array(
          fc.record({
            points: fc.array(
              fc.record({
                x: fc.double({ min: 0, max: 1000, noNaN: true }),
                y: fc.double({ min: 0, max: 1000, noNaN: true }),
              }),
              { minLength: 1, maxLength: 100 }
            ),
            color: fc.constantFrom('#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00'),
            width: fc.integer({ min: 1, max: 10 }),
          }),
          { minLength: 0, maxLength: 50 }
        ),
        // Generate modified strokes
        fc.array(
          fc.record({
            points: fc.array(
              fc.record({
                x: fc.double({ min: 0, max: 1000, noNaN: true }),
                y: fc.double({ min: 0, max: 1000, noNaN: true }),
              }),
              { minLength: 1, maxLength: 100 }
            ),
            color: fc.constantFrom('#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00'),
            width: fc.integer({ min: 1, max: 10 }),
          }),
          { minLength: 0, maxLength: 50 }
        ),
        async (initialStrokes: DrawingStroke[], modifiedStrokes: DrawingStroke[]) => {
          // CREATE: Create and save a new sticky note
          const note = service.createNote();
          note.strokes = initialStrokes;
          const savedId = await service.saveNote(note);

          // READ: Retrieve the saved note
          const retrievedNote = await service.getNote(savedId);
          
          // Property: Should be able to retrieve the note after saving
          expect(retrievedNote).not.toBeNull();
          expect(retrievedNote!.id).toBe(savedId);
          expect(retrievedNote!.strokes).toEqual(initialStrokes);

          // Property: The note should appear in getAllNotes
          const allNotesBeforeUpdate = await service.getAllNotes();
          const foundInList = allNotesBeforeUpdate.find(n => n.id === savedId);
          expect(foundInList).toBeDefined();
          expect(foundInList!.strokes).toEqual(initialStrokes);

          // UPDATE: Modify the note's strokes
          const updatedNote = await service.updateNoteStrokes(savedId, modifiedStrokes);
          
          // Property: Should be able to modify strokes
          expect(updatedNote).toBeDefined();
          expect(updatedNote.id).toBe(savedId);
          expect(updatedNote.strokes).toEqual(modifiedStrokes);

          // Property: Modified strokes should persist when retrieved again
          const retrievedAfterUpdate = await service.getNote(savedId);
          expect(retrievedAfterUpdate).not.toBeNull();
          expect(retrievedAfterUpdate!.strokes).toEqual(modifiedStrokes);

          // Property: Updated note should reflect in getAllNotes
          const allNotesAfterUpdate = await service.getAllNotes();
          const foundAfterUpdate = allNotesAfterUpdate.find(n => n.id === savedId);
          expect(foundAfterUpdate).toBeDefined();
          expect(foundAfterUpdate!.strokes).toEqual(modifiedStrokes);

          // DELETE: Delete the note from storage
          await service.deleteNote(savedId);

          // Property: Should not be able to retrieve deleted note
          const retrievedAfterDelete = await service.getNote(savedId);
          expect(retrievedAfterDelete).toBeNull();

          // Property: Deleted note should not appear in getAllNotes
          const allNotesAfterDelete = await service.getAllNotes();
          const foundAfterDelete = allNotesAfterDelete.find(n => n.id === savedId);
          expect(foundAfterDelete).toBeUndefined();
        }
      ),
      { numRuns: 100 }
    );
  });
});
