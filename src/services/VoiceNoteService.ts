/**
 * VoiceNoteService
 * Manages voice note recording, playback, and storage
 * 
 * Note: This implementation requires the following React Native libraries:
 * - react-native-audio-recorder-player (for audio recording and playback)
 * - react-native-fs (for file system operations)
 * - @react-native-community/permissions (for microphone permissions)
 */

import {
  VoiceNote,
  VoiceNoteMetadata,
  RecordingState,
  PlaybackState,
  RecordingStatus,
  PlaybackStatus,
} from './VoiceNoteTypes';

/**
 * Service for managing voice notes
 */
export class VoiceNoteService {
  private voiceNotes: Map<string, VoiceNote> = new Map();
  private readonly STORAGE_KEY = '@voice_notes';
  private readonly VOICE_NOTE_DIR = 'voice-notes';
  
  // Track which audio files exist (for mock implementation)
  private audioFiles: Set<string> = new Set();
  
  private currentRecording: {
    id: string;
    startTime: number;
    uri: string;
  } | null = null;
  
  private currentPlayback: {
    noteId: string;
    state: PlaybackState;
  } | null = null;

  /**
   * Starts recording a new voice note
   * @returns Promise resolving when recording starts
   */
  async startRecording(): Promise<void> {
    try {
      if (this.currentRecording) {
        throw new Error('Recording already in progress');
      }

      // Check microphone permissions
      const hasPermission = await this.checkMicrophonePermission();
      if (!hasPermission) {
        throw new Error('Microphone permission not granted');
      }

      const id = this.generateId();
      const uri = await this.getRecordingPath(id);

      this.currentRecording = {
        id,
        startTime: Date.now(),
        uri,
      };

      // Track that this audio file exists (for mock implementation)
      this.audioFiles.add(uri);

      // In a real implementation, this would use react-native-audio-recorder-player
      // Example:
      // import AudioRecorderPlayer from 'react-native-audio-recorder-player';
      // const audioRecorderPlayer = new AudioRecorderPlayer();
      // await audioRecorderPlayer.startRecorder(uri);
      
      console.log('Recording started:', uri);
    } catch (error) {
      console.error('Error starting recording:', error);
      this.currentRecording = null;
      throw error;
    }
  }

  /**
   * Stops the current recording and saves the voice note
   * @returns Promise resolving to the saved VoiceNote
   */
  async stopRecording(): Promise<VoiceNote> {
    try {
      if (!this.currentRecording) {
        throw new Error('No recording in progress');
      }

      // In a real implementation, this would stop the recorder
      // Example:
      // const result = await audioRecorderPlayer.stopRecorder();
      // const duration = result.duration / 1000; // Convert to seconds

      const duration = (Date.now() - this.currentRecording.startTime) / 1000;

      const voiceNote: VoiceNote = {
        id: this.currentRecording.id,
        uri: this.currentRecording.uri,
        duration,
        timestamp: new Date(this.currentRecording.startTime),
      };

      this.voiceNotes.set(voiceNote.id, voiceNote);
      await this.persistVoiceNoteMetadata(voiceNote);

      this.currentRecording = null;

      return voiceNote;
    } catch (error) {
      console.error('Error stopping recording:', error);
      this.currentRecording = null;
      throw error;
    }
  }

  /**
   * Gets the current recording status
   * @returns The current recording status
   */
  getRecordingStatus(): RecordingStatus {
    if (!this.currentRecording) {
      return {
        state: 'idle',
        duration: 0,
      };
    }

    return {
      state: 'recording',
      duration: (Date.now() - this.currentRecording.startTime) / 1000,
    };
  }

  /**
   * Plays a voice note
   * @param id - The voice note ID
   * @returns Promise resolving when playback starts
   */
  async playNote(id: string): Promise<void> {
    try {
      const voiceNote = await this.getNote(id);
      if (!voiceNote) {
        throw new Error('Voice note not found');
      }

      // Stop any current playback
      if (this.currentPlayback) {
        await this.stopPlayback();
      }

      this.currentPlayback = {
        noteId: id,
        state: 'playing',
      };

      // In a real implementation, this would use react-native-audio-recorder-player
      // Example:
      // await audioRecorderPlayer.startPlayer(voiceNote.uri);
      // audioRecorderPlayer.addPlayBackListener((e) => {
      //   if (e.currentPosition === e.duration) {
      //     this.currentPlayback = null;
      //   }
      // });

      console.log('Playing voice note:', voiceNote.uri);
    } catch (error) {
      console.error('Error playing voice note:', error);
      this.currentPlayback = null;
      throw error;
    }
  }

  /**
   * Pauses the current playback
   * @returns Promise resolving when playback is paused
   */
  async pausePlayback(): Promise<void> {
    try {
      if (!this.currentPlayback || this.currentPlayback.state !== 'playing') {
        return;
      }

      // In a real implementation, this would pause the player
      // Example:
      // await audioRecorderPlayer.pausePlayer();

      this.currentPlayback.state = 'paused';
      console.log('Playback paused');
    } catch (error) {
      console.error('Error pausing playback:', error);
      throw error;
    }
  }

  /**
   * Resumes paused playback
   * @returns Promise resolving when playback resumes
   */
  async resumePlayback(): Promise<void> {
    try {
      if (!this.currentPlayback || this.currentPlayback.state !== 'paused') {
        return;
      }

      // In a real implementation, this would resume the player
      // Example:
      // await audioRecorderPlayer.resumePlayer();

      this.currentPlayback.state = 'playing';
      console.log('Playback resumed');
    } catch (error) {
      console.error('Error resuming playback:', error);
      throw error;
    }
  }

  /**
   * Stops the current playback
   * @returns Promise resolving when playback is stopped
   */
  async stopPlayback(): Promise<void> {
    try {
      if (!this.currentPlayback) {
        return;
      }

      // In a real implementation, this would stop the player
      // Example:
      // await audioRecorderPlayer.stopPlayer();

      this.currentPlayback = null;
      console.log('Playback stopped');
    } catch (error) {
      console.error('Error stopping playback:', error);
      throw error;
    }
  }

  /**
   * Gets the current playback status
   * @returns The current playback status
   */
  getPlaybackStatus(): PlaybackStatus {
    if (!this.currentPlayback) {
      return {
        state: 'idle',
        position: 0,
        duration: 0,
      };
    }

    // In a real implementation, this would get actual position from player
    return {
      state: this.currentPlayback.state,
      position: 0,
      duration: 0,
    };
  }

  /**
   * Gets a voice note by ID
   * @param id - The voice note ID
   * @returns Promise resolving to the VoiceNote or null if not found
   */
  async getNote(id: string): Promise<VoiceNote | null> {
    try {
      // Check in-memory cache first
      if (this.voiceNotes.has(id)) {
        return this.voiceNotes.get(id)!;
      }

      // Load from storage
      const voiceNote = await this.loadVoiceNoteFromStorage(id);
      if (voiceNote) {
        this.voiceNotes.set(id, voiceNote);
      }

      return voiceNote;
    } catch (error) {
      console.error('Error getting voice note:', error);
      return null;
    }
  }

  /**
   * Gets all voice notes
   * @returns Promise resolving to array of all voice notes
   */
  async getAllNotes(): Promise<VoiceNote[]> {
    try {
      const metadata = await this.loadAllVoiceNoteMetadata();
      const voiceNotes: VoiceNote[] = [];

      for (const meta of metadata) {
        const voiceNote = await this.getNote(meta.id);
        if (voiceNote) {
          voiceNotes.push(voiceNote);
        }
      }

      return voiceNotes.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    } catch (error) {
      console.error('Error getting all voice notes:', error);
      return [];
    }
  }

  /**
   * Deletes a voice note and its audio file
   * @param id - The voice note ID
   * @returns Promise resolving when voice note is deleted
   */
  async deleteNote(id: string): Promise<void> {
    try {
      const voiceNote = await this.getNote(id);
      if (!voiceNote) {
        return; // Already deleted
      }

      // Stop playback if this note is playing
      if (this.currentPlayback && this.currentPlayback.noteId === id) {
        await this.stopPlayback();
      }

      // Delete audio file
      await this.deleteAudioFile(voiceNote.uri);

      // Remove from cache
      this.voiceNotes.delete(id);

      // Remove metadata
      await this.deleteVoiceNoteMetadata(id);
    } catch (error) {
      console.error('Error deleting voice note:', error);
      throw error;
    }
  }

  /**
   * Checks if the audio file exists for a voice note
   * @param id - The voice note ID
   * @returns Promise resolving to true if file exists, false otherwise
   */
  async audioFileExists(id: string): Promise<boolean> {
    try {
      const voiceNote = await this.getNote(id);
      if (!voiceNote) {
        return false;
      }

      return await this.checkFileExists(voiceNote.uri);
    } catch (error) {
      console.error('Error checking audio file existence:', error);
      return false;
    }
  }

  // Private helper methods

  private async checkMicrophonePermission(): Promise<boolean> {
    // Mock implementation - in real app would use @react-native-community/permissions
    // Example:
    // import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
    // 
    // const permission = Platform.OS === 'ios' 
    //   ? PERMISSIONS.IOS.MICROPHONE 
    //   : PERMISSIONS.ANDROID.RECORD_AUDIO;
    // 
    // let result = await check(permission);
    // if (result !== RESULTS.GRANTED) {
    //   result = await request(permission);
    // }
    // 
    // return result === RESULTS.GRANTED;
    
    return true; // Mock: assume permission granted
  }

  private async getRecordingPath(id: string): Promise<string> {
    // Mock implementation - in real app would use react-native-fs
    // Example:
    // import RNFS from 'react-native-fs';
    // const dir = `${RNFS.DocumentDirectoryPath}/${this.VOICE_NOTE_DIR}`;
    // await RNFS.mkdir(dir);
    // return `${dir}/${id}.m4a`;
    
    return `file://voice-notes/${id}.m4a`;
  }

  private async persistVoiceNoteMetadata(voiceNote: VoiceNote): Promise<void> {
    // Mock implementation - in real app would use AsyncStorage
    // Example:
    // import AsyncStorage from '@react-native-async-storage/async-storage';
    // 
    // const metadata: VoiceNoteMetadata = {
    //   id: voiceNote.id,
    //   uri: voiceNote.uri,
    //   duration: voiceNote.duration,
    //   timestamp: voiceNote.timestamp.getTime(),
    // };
    // 
    // const key = `${this.STORAGE_KEY}:${voiceNote.id}`;
    // await AsyncStorage.setItem(key, JSON.stringify(metadata));
    
    console.log('Voice note metadata persisted:', voiceNote.id);
  }

  private async loadVoiceNoteFromStorage(id: string): Promise<VoiceNote | null> {
    // Mock implementation - in real app would load from AsyncStorage
    // Example:
    // import AsyncStorage from '@react-native-async-storage/async-storage';
    // 
    // const key = `${this.STORAGE_KEY}:${id}`;
    // const data = await AsyncStorage.getItem(key);
    // 
    // if (!data) {
    //   return null;
    // }
    // 
    // const metadata: VoiceNoteMetadata = JSON.parse(data);
    // return {
    //   id: metadata.id,
    //   uri: metadata.uri,
    //   duration: metadata.duration,
    //   timestamp: new Date(metadata.timestamp),
    // };
    
    return null;
  }

  private async loadAllVoiceNoteMetadata(): Promise<VoiceNoteMetadata[]> {
    // Mock implementation - in real app would load all metadata from AsyncStorage
    // Example:
    // import AsyncStorage from '@react-native-async-storage/async-storage';
    // 
    // const keys = await AsyncStorage.getAllKeys();
    // const voiceNoteKeys = keys.filter(key => key.startsWith(this.STORAGE_KEY));
    // const items = await AsyncStorage.multiGet(voiceNoteKeys);
    // 
    // return items
    //   .map(([_, value]) => value ? JSON.parse(value) : null)
    //   .filter((item): item is VoiceNoteMetadata => item !== null);
    
    return [];
  }

  private async deleteAudioFile(uri: string): Promise<void> {
    // Mock implementation - in real app would delete file using react-native-fs
    // Example:
    // import RNFS from 'react-native-fs';
    // const path = uri.replace('file://', '');
    // if (await RNFS.exists(path)) {
    //   await RNFS.unlink(path);
    // }
    
    // Remove from tracked audio files (for mock implementation)
    this.audioFiles.delete(uri);
    
    console.log('Audio file deleted:', uri);
  }

  private async deleteVoiceNoteMetadata(id: string): Promise<void> {
    // Mock implementation - in real app would delete from AsyncStorage
    // Example:
    // import AsyncStorage from '@react-native-async-storage/async-storage';
    // const key = `${this.STORAGE_KEY}:${id}`;
    // await AsyncStorage.removeItem(key);
    
    console.log('Voice note metadata deleted:', id);
  }

  private async checkFileExists(uri: string): Promise<boolean> {
    // Mock implementation - in real app would check file existence
    // Example:
    // import RNFS from 'react-native-fs';
    // const path = uri.replace('file://', '');
    // return await RNFS.exists(path);
    
    // Check if file is in tracked audio files (for mock implementation)
    return this.audioFiles.has(uri);
  }

  private generateId(): string {
    return `voice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
export const voiceNoteService = new VoiceNoteService();
