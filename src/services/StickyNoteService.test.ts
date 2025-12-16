import { StickyNoteService } from './StickyNoteService';
import { StickyNote, DrawingStroke } from './StickyNoteTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

describe('StickyNoteService', () => {
  let service: StickyNoteService;

  beforeEach(() => {
    service = new StickyNoteService();
    jest.clearAllMocks();
  });

  describe('createNote', () => {
    it('should create a new sticky note with empty strokes', () => {
      const note = service.createNote();

      expect(note).toBeDefined();
      expect(note.id).toBeDefined();
      expect(note.strokes).toEqual([]);
      expect(note.timestamp).toBeInstanceOf(Date);
    });

    it('should create notes with unique IDs', () => {
      const note1 = service.createNote();
      const note2 = service.createNote();

      expect(note1.id).not.toBe(note2.id);
    });
  });

  describe('saveNote', () => {
    it('should save a note to AsyncStorage', async () => {
      const note: StickyNote = {
        id: 'test-note-1',
        strokes: [
          {
            points: [{ x: 10, y: 20 }, { x: 30, y: 40 }],
            color: '#000000',
            width: 3,
          },
        ],
        timestamp: new Date('2024-01-01T12:00:00Z'),
      };

      const id = await service.saveNote(note);

      expect(id).toBe('test-note-1');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@sticky_note:test-note-1',
        expect.any(String)
      );
    });

    it('should update metadata when saving a note', async () => {
      const note = service.createNote();
      note.strokes = [
        { points: [{ x: 0, y: 0 }], color: '#000000', width: 3 },
      ];

      await service.saveNote(note);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@sticky_notes:metadata',
        expect.any(String)
      );
    });
  });

  describe('getNote', () => {
    it('should retrieve a saved note', async () => {
      const savedNote: StickyNote = {
        id: 'test-note-1',
        strokes: [
          {
            points: [{ x: 10, y: 20 }],
            color: '#FF0000',
            width: 5,
          },
        ],
        timestamp: new Date('2024-01-01T12:00:00Z'),
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify({
          id: savedNote.id,
          strokes: savedNote.strokes,
          timestamp: savedNote.timestamp.getTime(),
        })
      );

      const note = await service.getNote('test-note-1');

      expect(note).toBeDefined();
      expect(note?.id).toBe('test-note-1');
      expect(note?.strokes).toEqual(savedNote.strokes);
      expect(note?.timestamp.getTime()).toBe(savedNote.timestamp.getTime());
    });

    it('should return null for non-existent note', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

      const note = await service.getNote('non-existent');

      expect(note).toBeNull();
    });
  });

  describe('deleteNote', () => {
    it('should remove a note from storage', async () => {
      await service.deleteNote('test-note-1');

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@sticky_note:test-note-1');
    });

    it('should update metadata when deleting a note', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify([
          { id: 'note-1', timestamp: Date.now(), strokeCount: 5 },
          { id: 'note-2', timestamp: Date.now(), strokeCount: 3 },
        ])
      );

      await service.deleteNote('note-1');

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@sticky_notes:metadata',
        expect.stringContaining('note-2')
      );
    });
  });

  describe('getAllNotes', () => {
    it('should return all saved notes sorted by timestamp', async () => {
      const metadata = [
        { id: 'note-1', timestamp: 1000, strokeCount: 2 },
        { id: 'note-2', timestamp: 2000, strokeCount: 3 },
      ];

      (AsyncStorage.getItem as jest.Mock)
        .mockResolvedValueOnce(JSON.stringify(metadata))
        .mockResolvedValueOnce(
          JSON.stringify({
            id: 'note-1',
            strokes: [],
            timestamp: 1000,
          })
        )
        .mockResolvedValueOnce(
          JSON.stringify({
            id: 'note-2',
            strokes: [],
            timestamp: 2000,
          })
        );

      const notes = await service.getAllNotes();

      expect(notes).toHaveLength(2);
      expect(notes[0].id).toBe('note-2'); // Newer first
      expect(notes[1].id).toBe('note-1');
    });

    it('should return empty array when no notes exist', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

      const notes = await service.getAllNotes();

      expect(notes).toEqual([]);
    });
  });

  describe('updateNoteStrokes', () => {
    it('should update strokes for an existing note', async () => {
      const existingNote: StickyNote = {
        id: 'test-note-1',
        strokes: [],
        timestamp: new Date(),
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify({
          id: existingNote.id,
          strokes: existingNote.strokes,
          timestamp: existingNote.timestamp.getTime(),
        })
      );

      const newStrokes: DrawingStroke[] = [
        { points: [{ x: 10, y: 20 }], color: '#000000', width: 3 },
      ];

      const updatedNote = await service.updateNoteStrokes('test-note-1', newStrokes);

      expect(updatedNote.strokes).toEqual(newStrokes);
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    it('should throw error when updating non-existent note', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

      await expect(
        service.updateNoteStrokes('non-existent', [])
      ).rejects.toThrow('Note not found');
    });
  });
});
