/**
 * Voice Note Module Types
 * Defines data structures for voice notes with audio recording
 */

export interface VoiceNote {
  id: string;
  uri: string;
  duration: number;
  timestamp: Date;
}

export interface VoiceNoteMetadata {
  id: string;
  uri: string;
  duration: number;
  timestamp: number;
}

export type RecordingState = 'idle' | 'recording' | 'paused' | 'stopped';

export type PlaybackState = 'idle' | 'playing' | 'paused' | 'stopped';

export interface RecordingStatus {
  state: RecordingState;
  duration: number;
}

export interface PlaybackStatus {
  state: PlaybackState;
  position: number;
  duration: number;
}
