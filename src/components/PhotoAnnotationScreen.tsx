/**
 * PhotoAnnotationScreen
 * UI component for photo annotation with drawing tools
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import {
  Photo,
  AnnotationType,
  Point,
  Annotation,
  ExportFormat,
} from '../services/PhotoAnnotationTypes';
import { photoAnnotationService } from '../services/PhotoAnnotationService';

interface PhotoAnnotationScreenProps {
  navigation?: any;
}

export const PhotoAnnotationScreen: React.FC<PhotoAnnotationScreenProps> = () => {
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [selectedTool, setSelectedTool] = useState<AnnotationType>('line');
  const [selectedColor, setSelectedColor] = useState<string>('#FF0000');
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [currentAnnotation, setCurrentAnnotation] = useState<Partial<Annotation> | null>(null);
  const [textInput, setTextInput] = useState<string>('');
  const [showTextInput, setShowTextInput] = useState<boolean>(false);

  const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#000000'];

  /**
   * Loads a photo from camera
   */
  const handleLoadFromCamera = async () => {
    try {
      const loadedPhoto = await photoAnnotationService.loadPhoto('camera');
      setPhoto(loadedPhoto);
    } catch (error) {
      Alert.alert('Error', 'Failed to load photo from camera');
      console.error(error);
    }
  };

  /**
   * Loads a photo from gallery
   */
  const handleLoadFromGallery = async () => {
    try {
      const loadedPhoto = await photoAnnotationService.loadPhoto('gallery');
      setPhoto(loadedPhoto);
    } catch (error) {
      Alert.alert('Error', 'Failed to load photo from gallery');
      console.error(error);
    }
  };

  /**
   * Handles touch start for drawing
   */
  const handleTouchStart = (event: any) => {
    if (!photo) return;

    const { locationX, locationY } = event.nativeEvent;
    const position: Point = { x: locationX, y: locationY };

    if (selectedTool === 'text') {
      setShowTextInput(true);
      setCurrentAnnotation({
        type: 'text',
        position,
        properties: {
          color: selectedColor,
          fontSize: 16,
        },
      });
    } else {
      setIsDrawing(true);
      setCurrentAnnotation({
        type: selectedTool,
        position,
        properties: {
          color: selectedColor,
          strokeWidth: 2,
          startPoint: position,
        },
      });
    }
  };

  /**
   * Handles touch move for drawing
   */
  const handleTouchMove = (event: any) => {
    if (!isDrawing || !currentAnnotation || !photo) return;

    const { locationX, locationY } = event.nativeEvent;
    const endPoint: Point = { x: locationX, y: locationY };

    setCurrentAnnotation({
      ...currentAnnotation,
      properties: {
        ...currentAnnotation.properties,
        endPoint,
      },
    });
  };

  /**
   * Handles touch end for drawing
   */
  const handleTouchEnd = async () => {
    if (!isDrawing || !currentAnnotation || !photo) return;

    try {
      // Calculate final properties based on annotation type
      const finalAnnotation = calculateFinalAnnotation(currentAnnotation);
      
      await photoAnnotationService.addAnnotation(photo.id, finalAnnotation);
      
      // Reload photo to get updated annotations
      const updatedPhoto = await photoAnnotationService.getPhoto(photo.id);
      if (updatedPhoto) {
        setPhoto(updatedPhoto);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add annotation');
      console.error(error);
    } finally {
      setIsDrawing(false);
      setCurrentAnnotation(null);
    }
  };

  /**
   * Handles text annotation submission
   */
  const handleTextSubmit = async () => {
    if (!currentAnnotation || !photo || !textInput.trim()) return;

    try {
      const textAnnotation: Omit<Annotation, 'id'> = {
        type: 'text',
        position: currentAnnotation.position!,
        properties: {
          ...currentAnnotation.properties,
          text: textInput.trim(),
        },
      };

      await photoAnnotationService.addAnnotation(photo.id, textAnnotation);

      const updatedPhoto = await photoAnnotationService.getPhoto(photo.id);
      if (updatedPhoto) {
        setPhoto(updatedPhoto);
      }

      setTextInput('');
      setShowTextInput(false);
      setCurrentAnnotation(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to add text annotation');
      console.error(error);
    }
  };

  /**
   * Calculates final annotation properties based on type
   */
  const calculateFinalAnnotation = (
    annotation: Partial<Annotation>
  ): Omit<Annotation, 'id'> => {
    const { type, position, properties } = annotation;
    const { startPoint, endPoint } = properties || {};

    if (!type || !position || !startPoint || !endPoint) {
      throw new Error('Invalid annotation data');
    }

    const finalProperties = { ...properties };

    if (type === 'rectangle') {
      finalProperties.width = Math.abs(endPoint.x - startPoint.x);
      finalProperties.height = Math.abs(endPoint.y - startPoint.y);
    } else if (type === 'circle') {
      const dx = endPoint.x - startPoint.x;
      const dy = endPoint.y - startPoint.y;
      finalProperties.radius = Math.sqrt(dx * dx + dy * dy);
    }

    return {
      type,
      position,
      properties: finalProperties,
    };
  };

  /**
   * Saves the annotated photo
   */
  const handleSave = async () => {
    if (!photo) return;

    try {
      const savedPath = await photoAnnotationService.saveAnnotatedPhoto(photo.id);
      Alert.alert('Success', `Photo saved to ${savedPath}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to save photo');
      console.error(error);
    }
  };

  /**
   * Exports the photo in specified format
   */
  const handleExport = async (format: 'jpeg' | 'png') => {
    if (!photo) return;

    try {
      const exportFormat: ExportFormat = {
        format,
        quality: format === 'jpeg' ? 0.9 : undefined,
      };

      const exportedPath = await photoAnnotationService.exportPhoto(
        photo.id,
        exportFormat
      );
      Alert.alert('Success', `Photo exported to ${exportedPath}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to export photo');
      console.error(error);
    }
  };

  /**
   * Deletes an annotation
   */
  const handleDeleteAnnotation = async (annotationId: string) => {
    if (!photo) return;

    try {
      await photoAnnotationService.deleteAnnotation(photo.id, annotationId);
      
      const updatedPhoto = await photoAnnotationService.getPhoto(photo.id);
      if (updatedPhoto) {
        setPhoto(updatedPhoto);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to delete annotation');
      console.error(error);
    }
  };

  /**
   * Renders the annotation tools
   */
  const renderTools = () => (
    <View style={styles.toolsContainer}>
      <Text style={styles.toolsTitle}>Drawing Tools</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {(['line', 'arrow', 'rectangle', 'circle', 'text'] as AnnotationType[]).map(
          (tool) => (
            <TouchableOpacity
              key={tool}
              style={[
                styles.toolButton,
                selectedTool === tool && styles.toolButtonSelected,
              ]}
              onPress={() => setSelectedTool(tool)}
            >
              <Text style={styles.toolButtonText}>{tool}</Text>
            </TouchableOpacity>
          )
        )}
      </ScrollView>

      <Text style={styles.toolsTitle}>Colors</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {colors.map((color) => (
          <TouchableOpacity
            key={color}
            style={[
              styles.colorButton,
              { backgroundColor: color },
              selectedColor === color && styles.colorButtonSelected,
            ]}
            onPress={() => setSelectedColor(color)}
          />
        ))}
      </ScrollView>
    </View>
  );

  /**
   * Renders the action buttons
   */
  const renderActions = () => (
    <View style={styles.actionsContainer}>
      <TouchableOpacity style={styles.actionButton} onPress={handleSave}>
        <Text style={styles.actionButtonText}>Save</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => handleExport('jpeg')}
      >
        <Text style={styles.actionButtonText}>Export JPEG</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => handleExport('png')}
      >
        <Text style={styles.actionButtonText}>Export PNG</Text>
      </TouchableOpacity>
    </View>
  );

  /**
   * Renders the photo with annotations
   */
  const renderPhoto = () => {
    if (!photo) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No photo loaded</Text>
          <TouchableOpacity
            style={styles.loadButton}
            onPress={handleLoadFromCamera}
          >
            <Text style={styles.loadButtonText}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.loadButton}
            onPress={handleLoadFromGallery}
          >
            <Text style={styles.loadButtonText}>Choose from Gallery</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View
        style={styles.photoContainer}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Image source={{ uri: photo.uri }} style={styles.photo} resizeMode="contain" />
        {/* In a real implementation, annotations would be rendered here using SVG or Canvas */}
        <View style={styles.annotationsOverlay}>
          {photo.annotations.map((annotation: Annotation) => (
            <View key={annotation.id} style={styles.annotationMarker}>
              <TouchableOpacity
                onPress={() => handleDeleteAnnotation(annotation.id)}
                style={styles.deleteAnnotationButton}
              >
                <Text style={styles.deleteAnnotationText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Photo Annotation</Text>
      </View>

      {renderPhoto()}
      
      {photo && (
        <>
          {renderTools()}
          {renderActions()}
        </>
      )}

      {showTextInput && (
        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.textInput}
            value={textInput}
            onChangeText={setTextInput}
            placeholder="Enter text annotation"
            autoFocus
          />
          <TouchableOpacity
            style={styles.textSubmitButton}
            onPress={handleTextSubmit}
          >
            <Text style={styles.textSubmitButtonText}>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.textCancelButton}
            onPress={() => {
              setShowTextInput(false);
              setTextInput('');
              setCurrentAnnotation(null);
            }}
          >
            <Text style={styles.textCancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  loadButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginVertical: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  loadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  photoContainer: {
    flex: 1,
    backgroundColor: '#000',
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  annotationsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  annotationMarker: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  deleteAnnotationButton: {
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteAnnotationText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  toolsContainer: {
    backgroundColor: '#fff',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  toolsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  toolButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  toolButtonSelected: {
    backgroundColor: '#007AFF',
  },
  toolButtonText: {
    fontSize: 14,
    color: '#333',
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  colorButtonSelected: {
    borderColor: '#000',
    borderWidth: 3,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  actionButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  textInputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    marginRight: 8,
    fontSize: 16,
  },
  textSubmitButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    marginRight: 8,
  },
  textSubmitButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  textCancelButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
  },
  textCancelButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
