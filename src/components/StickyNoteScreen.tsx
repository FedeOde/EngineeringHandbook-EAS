import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ScrollView,
  Modal,
} from 'react-native';
import { DrawingCanvas } from './DrawingCanvas';
import { stickyNoteService } from '../services/StickyNoteService';
import { StickyNote, DrawingStroke, DrawingToolConfig } from '../services/StickyNoteTypes';

/**
 * Sticky Note Screen Component
 * Provides UI for creating, viewing, editing, and deleting sticky notes
 */
export const StickyNoteScreen: React.FC = () => {
  const [notes, setNotes] = useState<StickyNote[]>([]);
  const [currentNote, setCurrentNote] = useState<StickyNote | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [toolConfig, setToolConfig] = useState<DrawingToolConfig>({
    tool: 'pen',
    color: '#000000',
    width: 3,
  });

  const colors = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const loadedNotes = await stickyNoteService.getAllNotes();
      setNotes(loadedNotes);
    } catch (error) {
      console.error('Error loading notes:', error);
      Alert.alert('Error', 'Failed to load sticky notes');
    }
  };

  const handleCreateNew = () => {
    const newNote = stickyNoteService.createNote();
    setCurrentNote(newNote);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!currentNote) return;

    try {
      await stickyNoteService.saveNote(currentNote);
      setIsEditing(false);
      setCurrentNote(null);
      await loadNotes();
      Alert.alert('Success', 'Sticky note saved');
    } catch (error) {
      console.error('Error saving note:', error);
      Alert.alert('Error', 'Failed to save sticky note');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCurrentNote(null);
  };

  const handleEdit = (note: StickyNote) => {
    setCurrentNote(note);
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this sticky note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await stickyNoteService.deleteNote(id);
              await loadNotes();
            } catch (error) {
              console.error('Error deleting note:', error);
              Alert.alert('Error', 'Failed to delete sticky note');
            }
          },
        },
      ]
    );
  };

  const handleStrokesChange = (strokes: DrawingStroke[]) => {
    if (currentNote) {
      setCurrentNote({
        ...currentNote,
        strokes,
      });
    }
  };

  const handleClearCanvas = () => {
    if (currentNote) {
      setCurrentNote({
        ...currentNote,
        strokes: [],
      });
    }
  };

  const handleColorSelect = (color: string) => {
    setToolConfig({
      ...toolConfig,
      tool: 'pen',
      color,
    });
  };

  const handleEraserSelect = () => {
    setToolConfig({
      ...toolConfig,
      tool: 'eraser',
    });
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleString();
  };

  const renderNoteItem = ({ item }: { item: StickyNote }) => (
    <View style={styles.noteItem}>
      <View style={styles.noteInfo}>
        <Text style={styles.noteDate}>{formatDate(item.timestamp)}</Text>
        <Text style={styles.noteStrokes}>{item.strokes.length} strokes</Text>
      </View>
      <View style={styles.noteActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleEdit(item)}
        >
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isEditing && currentNote) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Draw Sticky Note</Text>
        </View>

        <ScrollView style={styles.editorContainer}>
          <DrawingCanvas
            strokes={currentNote.strokes}
            onStrokesChange={handleStrokesChange}
            toolConfig={toolConfig}
          />

          <View style={styles.toolsContainer}>
            <Text style={styles.toolsLabel}>Drawing Tools:</Text>
            
            <View style={styles.colorPicker}>
              <Text style={styles.toolLabel}>Colors:</Text>
              <View style={styles.colorRow}>
                {colors.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorButton,
                      { backgroundColor: color },
                      toolConfig.tool === 'pen' && toolConfig.color === color && styles.selectedColor,
                    ]}
                    onPress={() => handleColorSelect(color)}
                  />
                ))}
              </View>
            </View>

            <View style={styles.toolRow}>
              <TouchableOpacity
                style={[
                  styles.toolButton,
                  toolConfig.tool === 'eraser' && styles.selectedTool,
                ]}
                onPress={handleEraserSelect}
              >
                <Text style={styles.toolButtonText}>Eraser</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.toolButton, styles.clearButton]}
                onPress={handleClearCanvas}
              >
                <Text style={styles.toolButtonText}>Clear All</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.actionBar}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sticky Notes</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleCreateNew}>
          <Text style={styles.addButtonText}>+ New Note</Text>
        </TouchableOpacity>
      </View>

      {notes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No sticky notes yet</Text>
          <Text style={styles.emptySubtext}>Tap "New Note" to create one</Text>
        </View>
      ) : (
        <FlatList
          data={notes}
          renderItem={renderNoteItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    color: '#666666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999999',
  },
  listContainer: {
    padding: 16,
  },
  noteItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noteInfo: {
    flex: 1,
  },
  noteDate: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 4,
  },
  noteStrokes: {
    fontSize: 14,
    color: '#666666',
  },
  noteActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  editorContainer: {
    flex: 1,
    padding: 16,
  },
  toolsContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  toolsLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  colorPicker: {
    marginBottom: 16,
  },
  toolLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  colorRow: {
    flexDirection: 'row',
    gap: 12,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#CCCCCC',
  },
  selectedColor: {
    borderColor: '#007AFF',
    borderWidth: 3,
  },
  toolRow: {
    flexDirection: 'row',
    gap: 12,
  },
  toolButton: {
    flex: 1,
    backgroundColor: '#E0E0E0',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedTool: {
    backgroundColor: '#007AFF',
  },
  toolButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  clearButton: {
    backgroundColor: '#FF9500',
  },
  actionBar: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#E0E0E0',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#34C759',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
