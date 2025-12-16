/**
 * VoiceNoteService Unit Tests
 */

import { VoiceNoteService } from './VoiceNoteService';
import { VoiceNote } from './VoiceNoteTypes';

describe('VoiceNoteService', () => {
  let service: VoiceNoteService;

  beforeEach(() => {
    service = new VoiceNoteService();
  });

  describe('Recording', () => {
    it('should start recording successfully', async () => {
      await expect(service.startRecording()).resolves.not.toThrow();
      
      const status = service.getRecordingStatus();
      expect(status.state).toBe('recording');
    });

    it('should throw error when starting recording while already recording', async () => {
      await service.startRecording();
      
      await expect(service.startRecording()).rejects.toThrow('Recording already in progress');
    });

    it('should stop recording and return voice note', async () => {
      await service.startRecording();
      
      // Wait a bit to simulate recording
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const voiceNote = await service.stopRecording();
      
      expect(voiceNote).toBeDefined();
      expect(voiceNote.id).toBeDefined();
      expect(voiceNote.uri).toBeDefined();
      expect(voiceNote.duration).toBeGreaterThan(0);
      expect(voiceNote.timestamp).toBeInstanceOf(Date);
    });

    it('should throw error when stopping recording without active recording', async () => {
      await expect(service.stopRecording()).rejects.toThrow('No recording in progress');
    });

    it('should return idle status when not recording', () => {
      const status = service.getRecordingStatus();
      
      expect(status.state).toBe('idle');
      expect(status.duration).toBe(0);
    });

    it('should calculate recording duration correctly', async () => {
      await service.startRecording();
      
      await new Promise(resolve => setTimeout(resolve, 150));
      
      const status = service.getRecordingStatus();
      expect(status.duration).toBeGreaterThanOrEqual(0.1);
    });
  });

  describe('Playback', () => {
    let voiceNote: VoiceNote;

    beforeEach(async () => {
      await service.startRecording();
      await new Promise(resolve => setTimeout(resolve, 100));
      voiceNote = await service.stopRecording();
    });

    it('should play a voice note', async () => {
      await expect(service.playNote(voiceNote.id)).resolves.not.toThrow();
    });

    it('should throw error when playing non-existent voice note', async () => {
      await expect(service.playNote('non-existent-id')).rejects.toThrow('Voice note not found');
    });

    it('should pause playback', async () => {
      await service.playNote(voiceNote.id);
      await expect(service.pausePlayback()).resolves.not.toThrow();
    });

    it('should resume playback', async () => {
      await service.playNote(voiceNote.id);
      await service.pausePlayback();
      await expect(service.resumePlayback()).resolves.not.toThrow();
    });

    it('should stop playback', async () => {
      await service.playNote(voiceNote.id);
      await expect(service.stopPlayback()).resolves.not.toThrow();
    });

    it('should return idle playback status when not playing', () => {
      const status = service.getPlaybackStatus();
      
      expect(status.state).toBe('idle');
      expect(status.position).toBe(0);
      expect(status.duration).toBe(0);
    });
  });

  describe('Voice Note Management', () => {
    it('should retrieve a voice note by id', async () => {
      await service.startRecording();
      await new Promise(resolve => setTimeout(resolve, 100));
      const created = await service.stopRecording();
      
      const retrieved = await service.getNote(created.id);
      
      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe(created.id);
      expect(retrieved?.uri).toBe(created.uri);
      expect(retrieved?.duration).toBe(created.duration);
    });

    it('should return null for non-existent voice note', async () => {
      const result = await service.getNote('non-existent-id');
      
      expect(result).toBeNull();
    });

    it('should get all voice notes', async () => {
      // Create multiple voice notes
      await service.startRecording();
      await new Promise(resolve => setTimeout(resolve, 100));
      await service.stopRecording();
      
      await service.startRecording();
      await new Promise(resolve => setTimeout(resolve, 100));
      await service.stopRecording();
      
      const allNotes = await service.getAllNotes();
      
      expect(allNotes).toHaveLength(2);
    });

    it('should return empty array when no voice notes exist', async () => {
      const allNotes = await service.getAllNotes();
      
      expect(allNotes).toEqual([]);
    });

    it('should delete a voice note', async () => {
      await service.startRecording();
      await new Promise(resolve => setTimeout(resolve, 100));
      const voiceNote = await service.stopRecording();
      
      await service.deleteNote(voiceNote.id);
      
      const retrieved = await service.getNote(voiceNote.id);
      expect(retrieved).toBeNull();
    });

    it('should not throw when deleting non-existent voice note', async () => {
      await expect(service.deleteNote('non-existent-id')).resolves.not.toThrow();
    });

    it('should stop playback when deleting currently playing note', async () => {
      await service.startRecording();
      await new Promise(resolve => setTimeout(resolve, 100));
      const voiceNote = await service.stopRecording();
      
      await service.playNote(voiceNote.id);
      await service.deleteNote(voiceNote.id);
      
      const status = service.getPlaybackStatus();
      expect(status.state).toBe('idle');
    });
  });

  describe('Voice Note Properties', () => {
    it('should create voice note with timestamp', async () => {
      const beforeTime = Date.now();
      
      await service.startRecording();
      await new Promise(resolve => setTimeout(resolve, 100));
      const voiceNote = await service.stopRecording();
      
      const afterTime = Date.now();
      
      expect(voiceNote.timestamp.getTime()).toBeGreaterThanOrEqual(beforeTime);
      expect(voiceNote.timestamp.getTime()).toBeLessThanOrEqual(afterTime);
    });

    it('should create voice note with unique id', async () => {
      await service.startRecording();
      await new Promise(resolve => setTimeout(resolve, 100));
      const note1 = await service.stopRecording();
      
      await service.startRecording();
      await new Promise(resolve => setTimeout(resolve, 100));
      const note2 = await service.stopRecording();
      
      expect(note1.id).not.toBe(note2.id);
    });

    it('should create voice note with valid uri', async () => {
      await service.startRecording();
      await new Promise(resolve => setTimeout(resolve, 100));
      const voiceNote = await service.stopRecording();
      
      expect(voiceNote.uri).toBeDefined();
      expect(typeof voiceNote.uri).toBe('string');
      expect(voiceNote.uri.length).toBeGreaterThan(0);
    });

    it('should calculate duration based on recording time', async () => {
      await service.startRecording();
      await new Promise(resolve => setTimeout(resolve, 200));
      const voiceNote = await service.stopRecording();
      
      expect(voiceNote.duration).toBeGreaterThanOrEqual(0.15);
      expect(voiceNote.duration).toBeLessThan(0.5);
    });
  });

  describe('File Management', () => {
    it('should check if audio file exists', async () => {
      await service.startRecording();
      await new Promise(resolve => setTimeout(resolve, 100));
      const voiceNote = await service.stopRecording();
      
      const exists = await service.audioFileExists(voiceNote.id);
      
      // In mock implementation, this returns true
      expect(exists).toBe(true);
    });

    it('should return false for non-existent audio file', async () => {
      const exists = await service.audioFileExists('non-existent-id');
      
      expect(exists).toBe(false);
    });
  });
});
