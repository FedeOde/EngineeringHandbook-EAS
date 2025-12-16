/**
 * VoiceNoteScreen
 * UI component for recording and managing voice notes
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import { voiceNoteService } from '../services/VoiceNoteService';
import { VoiceNote, RecordingStatus, PlaybackStatus } from '../services/VoiceNoteTypes';

export const VoiceNoteScreen: React.FC = () => {
  const [voiceNotes, setVoiceNotes] = useState<VoiceNote[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [playingNoteId, setPlayingNoteId] = useState<string | null>(null);
  const [isPlaybackPaused, setIsPlaybackPaused] = useState(false);

  useEffect(() => {
    loadVoiceNotes();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRecording) {
      interval = setInterval(() => {
        const status = voiceNoteService.getRecordingStatus();
        setRecordingDuration(status.duration);
      }, 100);
    } else {
      setRecordingDuration(0);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRecording]);

  const loadVoiceNotes = async () => {
    try {
      const notes = await voiceNoteService.getAllNotes();
      setVoiceNotes(notes);
    } catch (error) {
      console.error('Error loading voice notes:', error);
      Alert.alert('Error', 'Failed to load voice notes');
    }
  };

  const handleStartRecording = async () => {
    try {
      await voiceNoteService.startRecording();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      Alert.alert('Error', 'Failed to start recording. Please check microphone permissions.');
    }
  };

  const handleStopRecording = async () => {
    try {
      await voiceNoteService.stopRecording();
      setIsRecording(false);
      setRecordingDuration(0);
      await loadVoiceNotes();
    } catch (error) {
      console.error('Error stopping recording:', error);
      Alert.alert('Error', 'Failed to stop recording');
    }
  };

  const handlePlayNote = async (id: string) => {
    try {
      if (playingNoteId === id) {
        // Toggle pause/resume
        if (isPlaybackPaused) {
          await voiceNoteService.resumePlayback();
          setIsPlaybackPaused(false);
        } else {
          await voiceNoteService.pausePlayback();
          setIsPlaybackPaused(true);
        }
      } else {
        // Start playing new note
        await voiceNoteService.playNote(id);
        setPlayingNoteId(id);
        setIsPlaybackPaused(false);
      }
    } catch (error) {
      console.error('Error playing voice note:', error);
      Alert.alert('Error', 'Failed to play voice note');
    }
  };

  const handleStopPlayback = async () => {
    try {
      await voiceNoteService.stopPlayback();
      setPlayingNoteId(null);
      setIsPlaybackPaused(false);
    } catch (error) {
      console.error('Error stopping playback:', error);
    }
  };

  const handleDeleteNote = async (id: string) => {
    Alert.alert(
      'Delete Voice Note',
      'Are you sure you want to delete this voice note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await voiceNoteService.deleteNote(id);
              await loadVoiceNotes();
              if (playingNoteId === id) {
                setPlayingNoteId(null);
                setIsPlaybackPaused(false);
              }
            } catch (error) {
              console.error('Error deleting voice note:', error);
              Alert.alert('Error', 'Failed to delete voice note');
            }
          },
        },
      ]
    );
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTimestamp = (date: Date): string => {
    return date.toLocaleString();
  };

  const renderVoiceNote = ({ item }: { item: VoiceNote }) => {
    const isPlaying = playingNoteId === item.id;
    const isPaused = isPlaying && isPlaybackPaused;

    return (
      <View style={styles.voiceNoteItem}>
        <View style={styles.voiceNoteInfo}>
          <Text style={styles.voiceNoteTimestamp}>
            {formatTimestamp(item.timestamp)}
          </Text>
          <Text style={styles.voiceNoteDuration}>
            Duration: {formatDuration(item.duration)}
          </Text>
        </View>

        <View style={styles.voiceNoteControls}>
          <TouchableOpacity
            style={[styles.controlButton, styles.playButton]}
            onPress={() => handlePlayNote(item.id)}
          >
            <Text style={styles.controlButtonText}>
              {isPlaying ? (isPaused ? '▶' : '⏸') : '▶'}
            </Text>
          </TouchableOpacity>

          {isPlaying && (
            <TouchableOpacity
              style={[styles.controlButton, styles.stopButton]}
              onPress={handleStopPlayback}
            >
              <Text style={styles.controlButtonText}>⏹</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.controlButton, styles.deleteButton]}
            onPress={() => handleDeleteNote(item.id)}
          >
            <Text style={styles.controlButtonText}>🗑</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.recordingSection}>
        <Text style={styles.title}>Voice Notes</Text>

        {isRecording && (
          <View style={styles.recordingIndicator}>
            <View style={styles.recordingDot} />
            <Text style={styles.recordingText}>
              Recording: {formatDuration(recordingDuration)}
            </Text>
          </View>
        )}

        <View style={styles.recordingControls}>
          {!isRecording ? (
            <TouchableOpacity
              style={[styles.recordButton, styles.startRecordButton]}
              onPress={handleStartRecording}
            >
              <Text style={styles.recordButtonText}>🎤 Start Recording</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.recordButton, styles.stopRecordButton]}
              onPress={handleStopRecording}
            >
              <Text style={styles.recordButtonText}>⏹ Stop Recording</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.listSection}>
        <Text style={styles.listTitle}>
          Saved Voice Notes ({voiceNotes.length})
        </Text>

        {voiceNotes.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No voice notes yet. Tap "Start Recording" to create one.
            </Text>
          </View>
        ) : (
          <FlatList
            data={voiceNotes}
            renderItem={renderVoiceNote}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  recordingSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#ffebee',
    borderRadius: 8,
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#f44336',
    marginRight: 8,
  },
  recordingText: {
    fontSize: 16,
    color: '#d32f2f',
    fontWeight: '600',
  },
  recordingControls: {
    alignItems: 'center',
  },
  recordButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  startRecordButton: {
    backgroundColor: '#4CAF50',
  },
  stopRecordButton: {
    backgroundColor: '#f44336',
  },
  recordButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  listSection: {
    flex: 1,
    padding: 16,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  listContent: {
    paddingBottom: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  voiceNoteItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  voiceNoteInfo: {
    flex: 1,
  },
  voiceNoteTimestamp: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  voiceNoteDuration: {
    fontSize: 12,
    color: '#666',
  },
  voiceNoteControls: {
    flexDirection: 'row',
    gap: 8,
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: '#2196F3',
  },
  stopButton: {
    backgroundColor: '#FF9800',
  },
  deleteButton: {
    backgroundColor: '#f44336',
  },
  controlButtonText: {
    fontSize: 18,
    color: '#fff',
  },
});
