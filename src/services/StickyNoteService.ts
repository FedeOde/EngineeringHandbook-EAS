import AsyncStorage from '@react-native-async-storage/async-storage';
import { StickyNote, StickyNoteMetadata, DrawingStroke } from './StickyNoteTypes';

/**
 * Service for managing sticky notes with file storage operations
 */
export class StickyNoteService {
  private readonly STORAGE_KEY_PREFIX = '@sticky_note:';
  private readonly METADATA_KEY = '@sticky_notes:metadata';

  /**
   * Creates a new empty sticky note
   * @returns A new StickyNote with empty strokes
   */
  createNote(): StickyNote {
    return {
      id: this.generateId(),
      strokes: [],
      timestamp: new Date(),
    };
  }

  /**
   * Saves a sticky note to storage
   * @param note - The sticky note to save
   * @returns The ID of the saved note
   */
  async saveNote(note: StickyNote): Promise<string> {
    try {
      const noteData = {
        id: note.id,
        strokes: note.strokes,
        timestamp: note.timestamp.getTime(),
      };

      // Save the note data
      await AsyncStorage.setItem(
        `${this.STORAGE_KEY_PREFIX}${note.id}`,
        JSON.stringify(noteData)
      );

      // Update metadata
      await this.updateMetadata(note.id, note.strokes.length, note.timestamp.getTime());

      return note.id;
    } catch (error) {
      console.error('Error saving sticky note:', error);
      throw error;
    }
  }

  /**
   * Gets a sticky note by ID
   * @param id - The note ID
   * @returns The StickyNote or null if not found
   */
  async getNote(id: string): Promise<StickyNote | null> {
    try {
      const data = await AsyncStorage.getItem(`${this.STORAGE_KEY_PREFIX}${id}`);
      
      if (!data) {
        return null;
      }

      const parsed = JSON.parse(data);
      return {
        id: parsed.id,
        strokes: parsed.strokes,
        timestamp: new Date(parsed.timestamp),
      };
    } catch (error) {
      console.error('Error getting sticky note:', error);
      throw error;
    }
  }

  /**
   * Deletes a sticky note
   * @param id - The note ID
   */
  async deleteNote(id: string): Promise<void> {
    try {
      // Remove the note data
      await AsyncStorage.removeItem(`${this.STORAGE_KEY_PREFIX}${id}`);

      // Remove from metadata
      await this.removeFromMetadata(id);
    } catch (error) {
      console.error('Error deleting sticky note:', error);
      throw error;
    }
  }

  /**
   * Gets all sticky notes
   * @returns Array of all sticky notes, sorted by timestamp (newest first)
   */
  async getAllNotes(): Promise<StickyNote[]> {
    try {
      const metadata = await this.getMetadata();
      const notes: StickyNote[] = [];

      for (const meta of metadata) {
        const note = await this.getNote(meta.id);
        if (note) {
          notes.push(note);
        }
      }

      // Sort by timestamp, newest first
      return notes.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    } catch (error) {
      console.error('Error getting all sticky notes:', error);
      throw error;
    }
  }

  /**
   * Updates a sticky note's strokes
   * @param id - The note ID
   * @param strokes - The new strokes array
   * @returns The updated StickyNote
   */
  async updateNoteStrokes(id: string, strokes: DrawingStroke[]): Promise<StickyNote> {
    try {
      const note = await this.getNote(id);
      if (!note) {
        throw new Error('Note not found');
      }

      const updatedNote: StickyNote = {
        ...note,
        strokes,
      };

      await this.saveNote(updatedNote);
      return updatedNote;
    } catch (error) {
      console.error('Error updating note strokes:', error);
      throw error;
    }
  }

  /**
   * Gets metadata for all notes
   */
  private async getMetadata(): Promise<StickyNoteMetadata[]> {
    try {
      const data = await AsyncStorage.getItem(this.METADATA_KEY);
      if (!data) {
        return [];
      }
      return JSON.parse(data);
    } catch (error) {
      console.error('Error getting metadata:', error);
      return [];
    }
  }

  /**
   * Updates metadata for a note
   */
  private async updateMetadata(
    id: string,
    strokeCount: number,
    timestamp: number
  ): Promise<void> {
    try {
      const metadata = await this.getMetadata();
      const existingIndex = metadata.findIndex((m) => m.id === id);

      const newMeta: StickyNoteMetadata = {
        id,
        timestamp,
        strokeCount,
      };

      if (existingIndex >= 0) {
        metadata[existingIndex] = newMeta;
      } else {
        metadata.push(newMeta);
      }

      await AsyncStorage.setItem(this.METADATA_KEY, JSON.stringify(metadata));
    } catch (error) {
      console.error('Error updating metadata:', error);
      throw error;
    }
  }

  /**
   * Removes a note from metadata
   */
  private async removeFromMetadata(id: string): Promise<void> {
    try {
      const metadata = await this.getMetadata();
      const filtered = metadata.filter((m) => m.id !== id);
      await AsyncStorage.setItem(this.METADATA_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error removing from metadata:', error);
      throw error;
    }
  }

  /**
   * Generates a unique ID for a sticky note
   */
  private generateId(): string {
    return `sticky_note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
export const stickyNoteService = new StickyNoteService();
