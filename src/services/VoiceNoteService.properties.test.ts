/**
 * VoiceNoteService - Property-Based Tests
 */

import * as fc from 'fast-check';
import { VoiceNoteService } from './VoiceNoteService';

describe('VoiceNoteService - Property-Based Tests', () => {
  let service: VoiceNoteService;

  beforeEach(() => {
    service = new VoiceNoteService();
  });

  // Feature: engineering-pocket-helper, Property 25: Voice note timestamp presence
  // Validates: Requirements 10.2
  it('should create voice notes with valid timestamp for any recording duration', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate recording durations (in milliseconds) between 10ms and 500ms
        fc.integer({ min: 10, max: 500 }),
        async (recordingDuration: number) => {
          // Capture the time before recording starts
          const beforeRecording = Date.now();

          // Start recording
          await service.startRecording();

          // Wait for the specified recording duration
          await new Promise(resolve => setTimeout(resolve, recordingDuration));

          // Stop recording and get the voice note
          const voiceNote = await service.stopRecording();

          // Capture the time after recording stops
          const afterRecording = Date.now();

          // Property: The voice note should have a timestamp field
          expect(voiceNote.timestamp).toBeDefined();

          // Property: The timestamp should be a valid Date object
          expect(voiceNote.timestamp).toBeInstanceOf(Date);

          // Property: The timestamp should represent a valid date and time
          expect(voiceNote.timestamp.getTime()).not.toBeNaN();
          expect(isFinite(voiceNote.timestamp.getTime())).toBe(true);

          // Property: The timestamp should be within the recording time window
          expect(voiceNote.timestamp.getTime()).toBeGreaterThanOrEqual(beforeRecording);
          expect(voiceNote.timestamp.getTime()).toBeLessThanOrEqual(afterRecording);

          // Property: The timestamp should be a reasonable date (not in the distant past or future)
          const now = Date.now();
          const oneYearAgo = now - (365 * 24 * 60 * 60 * 1000);
          const oneYearFromNow = now + (365 * 24 * 60 * 60 * 1000);
          expect(voiceNote.timestamp.getTime()).toBeGreaterThan(oneYearAgo);
          expect(voiceNote.timestamp.getTime()).toBeLessThan(oneYearFromNow);

          // Clean up - delete the voice note
          await service.deleteNote(voiceNote.id);
        }
      ),
      { numRuns: 10, timeout: 10000 }
    );
  }, 15000);

  // Feature: engineering-pocket-helper, Property 26: Voice note metadata completeness
  // Validates: Requirements 10.4
  it('should return voice notes with complete metadata for any recording', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate recording durations (in milliseconds) between 10ms and 500ms
        fc.integer({ min: 10, max: 500 }),
        async (recordingDuration: number) => {
          // Start recording
          await service.startRecording();

          // Wait for the specified recording duration
          await new Promise(resolve => setTimeout(resolve, recordingDuration));

          // Stop recording and get the voice note
          const createdNote = await service.stopRecording();

          // Retrieve the voice note by ID
          const retrievedNote = await service.getNote(createdNote.id);

          // Property: Retrieved voice note should not be null
          expect(retrievedNote).not.toBeNull();

          if (retrievedNote) {
            // Property: Voice note should have an id field
            expect(retrievedNote.id).toBeDefined();
            expect(typeof retrievedNote.id).toBe('string');
            expect(retrievedNote.id.length).toBeGreaterThan(0);

            // Property: Voice note should have a uri field
            expect(retrievedNote.uri).toBeDefined();
            expect(typeof retrievedNote.uri).toBe('string');
            expect(retrievedNote.uri.length).toBeGreaterThan(0);

            // Property: Voice note should have a duration field
            expect(retrievedNote.duration).toBeDefined();
            expect(typeof retrievedNote.duration).toBe('number');
            expect(retrievedNote.duration).toBeGreaterThanOrEqual(0);
            expect(isFinite(retrievedNote.duration)).toBe(true);
            expect(isNaN(retrievedNote.duration)).toBe(false);

            // Property: Voice note should have a timestamp field
            expect(retrievedNote.timestamp).toBeDefined();
            expect(retrievedNote.timestamp).toBeInstanceOf(Date);
            expect(retrievedNote.timestamp.getTime()).not.toBeNaN();
            expect(isFinite(retrievedNote.timestamp.getTime())).toBe(true);

            // Property: All metadata fields should match the created note
            expect(retrievedNote.id).toBe(createdNote.id);
            expect(retrievedNote.uri).toBe(createdNote.uri);
            expect(retrievedNote.duration).toBe(createdNote.duration);
            expect(retrievedNote.timestamp.getTime()).toBe(createdNote.timestamp.getTime());
          }

          // Clean up - delete the voice note
          await service.deleteNote(createdNote.id);
        }
      ),
      { numRuns: 10, timeout: 10000 }
    );
  }, 15000);

  // Feature: engineering-pocket-helper, Property 27: Voice note deletion cleanup
  // Validates: Requirements 10.5
  it('should remove audio file from file system when voice note is deleted', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate recording durations (in milliseconds) between 10ms and 500ms
        fc.integer({ min: 10, max: 500 }),
        async (recordingDuration: number) => {
          // Start recording
          await service.startRecording();

          // Wait for the specified recording duration
          await new Promise(resolve => setTimeout(resolve, recordingDuration));

          // Stop recording and get the voice note
          const voiceNote = await service.stopRecording();

          // Property: Before deletion, the audio file should exist
          const existsBeforeDeletion = await service.audioFileExists(voiceNote.id);
          expect(existsBeforeDeletion).toBe(true);

          // Delete the voice note
          await service.deleteNote(voiceNote.id);

          // Property: After deletion, the audio file should no longer exist in the file system
          const existsAfterDeletion = await service.audioFileExists(voiceNote.id);
          expect(existsAfterDeletion).toBe(false);

          // Property: The voice note should no longer be retrievable
          const retrievedNote = await service.getNote(voiceNote.id);
          expect(retrievedNote).toBeNull();

          // Property: The voice note should not appear in the list of all notes
          const allNotes = await service.getAllNotes();
          const deletedNoteInList = allNotes.find(note => note.id === voiceNote.id);
          expect(deletedNoteInList).toBeUndefined();
        }
      ),
      { numRuns: 10, timeout: 10000 }
    );
  }, 15000);
});
