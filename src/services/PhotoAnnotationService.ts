/**
 * PhotoAnnotationService
 * Manages photo loading, annotation, and storage
 * 
 * Note: This implementation requires the following React Native libraries:
 * - react-native-image-picker (for camera and gallery access)
 * - react-native-fs (for file system operations)
 * - @react-native-community/cameraroll (optional, for saving to gallery)
 */

import {
  Photo,
  PhotoSource,
  Annotation,
  AnnotationType,
  Point,
  AnnotationProperties,
  ExportFormat,
  PhotoMetadata,
} from './PhotoAnnotationTypes';

/**
 * Service for managing photo annotations
 */
export class PhotoAnnotationService {
  private photos: Map<string, Photo> = new Map();
  private readonly STORAGE_KEY = '@photo_annotations';
  private readonly PHOTO_DIR = 'photos';

  /**
   * Loads a photo from camera or gallery
   * @param source - The photo source (camera or gallery)
   * @returns Promise resolving to the loaded Photo
   */
  async loadPhoto(source: PhotoSource): Promise<Photo> {
    try {
      // In a real implementation, this would use react-native-image-picker
      // For now, we'll create a mock implementation that demonstrates the structure
      
      const photoUri = await this.captureOrSelectPhoto(source);
      
      const photo: Photo = {
        id: this.generateId(),
        uri: photoUri,
        originalUri: photoUri,
        annotations: [],
        timestamp: new Date(),
      };

      this.photos.set(photo.id, photo);
      await this.persistPhotoMetadata(photo);

      return photo;
    } catch (error) {
      console.error('Error loading photo:', error);
      throw new Error(`Failed to load photo from ${source}: ${error}`);
    }
  }

  /**
   * Gets a photo by ID
   * @param photoId - The photo ID
   * @returns Promise resolving to the Photo or null if not found
   */
  async getPhoto(photoId: string): Promise<Photo | null> {
    try {
      // Check in-memory cache first
      if (this.photos.has(photoId)) {
        return this.photos.get(photoId)!;
      }

      // Load from storage
      const photo = await this.loadPhotoFromStorage(photoId);
      if (photo) {
        this.photos.set(photoId, photo);
      }

      return photo;
    } catch (error) {
      console.error('Error getting photo:', error);
      return null;
    }
  }

  /**
   * Gets all photos
   * @returns Promise resolving to array of all photos
   */
  async getAllPhotos(): Promise<Photo[]> {
    try {
      const metadata = await this.loadAllPhotoMetadata();
      const photos: Photo[] = [];

      for (const meta of metadata) {
        const photo = await this.getPhoto(meta.id);
        if (photo) {
          photos.push(photo);
        }
      }

      return photos.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    } catch (error) {
      console.error('Error getting all photos:', error);
      return [];
    }
  }

  /**
   * Adds an annotation to a photo
   * @param photoId - The photo ID
   * @param annotation - The annotation to add
   * @returns Promise resolving when annotation is added
   */
  async addAnnotation(
    photoId: string,
    annotation: Omit<Annotation, 'id'>
  ): Promise<void> {
    try {
      const photo = await this.getPhoto(photoId);
      if (!photo) {
        throw new Error('Photo not found');
      }

      const newAnnotation: Annotation = {
        ...annotation,
        id: this.generateAnnotationId(),
      };

      photo.annotations.push(newAnnotation);
      this.photos.set(photoId, photo);

      await this.persistPhotoMetadata(photo);
    } catch (error) {
      console.error('Error adding annotation:', error);
      throw error;
    }
  }

  /**
   * Updates an existing annotation
   * @param photoId - The photo ID
   * @param annotationId - The annotation ID
   * @param updates - Partial annotation updates
   * @returns Promise resolving when annotation is updated
   */
  async updateAnnotation(
    photoId: string,
    annotationId: string,
    updates: Partial<Omit<Annotation, 'id'>>
  ): Promise<void> {
    try {
      const photo = await this.getPhoto(photoId);
      if (!photo) {
        throw new Error('Photo not found');
      }

      const annotationIndex = photo.annotations.findIndex(
        (a) => a.id === annotationId
      );

      if (annotationIndex === -1) {
        throw new Error('Annotation not found');
      }

      photo.annotations[annotationIndex] = {
        ...photo.annotations[annotationIndex],
        ...updates,
      };

      this.photos.set(photoId, photo);
      await this.persistPhotoMetadata(photo);
    } catch (error) {
      console.error('Error updating annotation:', error);
      throw error;
    }
  }

  /**
   * Deletes an annotation from a photo
   * @param photoId - The photo ID
   * @param annotationId - The annotation ID
   * @returns Promise resolving when annotation is deleted
   */
  async deleteAnnotation(photoId: string, annotationId: string): Promise<void> {
    try {
      const photo = await this.getPhoto(photoId);
      if (!photo) {
        throw new Error('Photo not found');
      }

      photo.annotations = photo.annotations.filter((a) => a.id !== annotationId);
      this.photos.set(photoId, photo);

      await this.persistPhotoMetadata(photo);
    } catch (error) {
      console.error('Error deleting annotation:', error);
      throw error;
    }
  }

  /**
   * Saves the annotated photo
   * This creates a new file with annotations rendered, preserving the original
   * @param photoId - The photo ID
   * @returns Promise resolving to the path of the saved annotated photo
   */
  async saveAnnotatedPhoto(photoId: string): Promise<string> {
    try {
      const photo = await this.getPhoto(photoId);
      if (!photo) {
        throw new Error('Photo not found');
      }

      // In a real implementation, this would:
      // 1. Load the original image
      // 2. Create a canvas with the image
      // 3. Render all annotations on the canvas
      // 4. Save the canvas as a new image file
      // 5. Return the new file path

      const annotatedUri = await this.renderAndSaveAnnotatedPhoto(photo);
      
      photo.uri = annotatedUri;
      this.photos.set(photoId, photo);
      await this.persistPhotoMetadata(photo);

      return annotatedUri;
    } catch (error) {
      console.error('Error saving annotated photo:', error);
      throw error;
    }
  }

  /**
   * Exports an annotated photo in the specified format
   * @param photoId - The photo ID
   * @param exportFormat - The export format configuration
   * @returns Promise resolving to the exported file path
   */
  async exportPhoto(
    photoId: string,
    exportFormat: ExportFormat
  ): Promise<string> {
    try {
      const photo = await this.getPhoto(photoId);
      if (!photo) {
        throw new Error('Photo not found');
      }

      // Ensure photo is saved with annotations
      const annotatedUri = photo.uri !== photo.originalUri 
        ? photo.uri 
        : await this.saveAnnotatedPhoto(photoId);

      // In a real implementation, this would convert the image format if needed
      const exportedPath = await this.convertImageFormat(
        annotatedUri,
        exportFormat
      );

      return exportedPath;
    } catch (error) {
      console.error('Error exporting photo:', error);
      throw error;
    }
  }

  /**
   * Deletes a photo and all its annotations
   * @param photoId - The photo ID
   * @returns Promise resolving when photo is deleted
   */
  async deletePhoto(photoId: string): Promise<void> {
    try {
      const photo = await this.getPhoto(photoId);
      if (!photo) {
        return; // Already deleted
      }

      // Delete photo files
      await this.deletePhotoFiles(photo);

      // Remove from cache
      this.photos.delete(photoId);

      // Remove metadata
      await this.deletePhotoMetadata(photoId);
    } catch (error) {
      console.error('Error deleting photo:', error);
      throw error;
    }
  }

  /**
   * Creates a new annotation object
   * @param type - The annotation type
   * @param position - The annotation position
   * @param properties - The annotation properties
   * @returns The annotation object (without ID)
   */
  createAnnotation(
    type: AnnotationType,
    position: Point,
    properties: AnnotationProperties
  ): Omit<Annotation, 'id'> {
    return {
      type,
      position,
      properties: {
        color: properties.color || '#FF0000',
        strokeWidth: properties.strokeWidth || 2,
        ...properties,
      },
    };
  }

  // Private helper methods

  private async captureOrSelectPhoto(source: PhotoSource): Promise<string> {
    // Mock implementation - in real app would use react-native-image-picker
    // Example:
    // import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
    // 
    // const options = { mediaType: 'photo', quality: 1 };
    // const result = source === 'camera' 
    //   ? await launchCamera(options)
    //   : await launchImageLibrary(options);
    // 
    // if (result.assets && result.assets[0]) {
    //   return result.assets[0].uri;
    // }
    
    return `file://mock-photo-${Date.now()}.jpg`;
  }

  private async renderAndSaveAnnotatedPhoto(photo: Photo): Promise<string> {
    // Mock implementation - in real app would use canvas rendering
    // This would involve:
    // 1. Creating a canvas with the original image
    // 2. Drawing each annotation on the canvas
    // 3. Saving the canvas as an image file
    
    return `file://annotated-${photo.id}.jpg`;
  }

  private async convertImageFormat(
    uri: string,
    format: ExportFormat
  ): Promise<string> {
    // Mock implementation - in real app would convert image format
    // Could use react-native-image-resizer or similar library
    
    const extension = format.format === 'jpeg' ? 'jpg' : 'png';
    return uri.replace(/\.(jpg|jpeg|png)$/i, `.${extension}`);
  }

  private async persistPhotoMetadata(photo: Photo): Promise<void> {
    // Mock implementation - in real app would use AsyncStorage or file system
    // Example:
    // import AsyncStorage from '@react-native-async-storage/async-storage';
    // 
    // const metadata: PhotoMetadata = {
    //   id: photo.id,
    //   originalUri: photo.originalUri,
    //   annotatedUri: photo.uri !== photo.originalUri ? photo.uri : undefined,
    //   timestamp: photo.timestamp.getTime(),
    //   annotationCount: photo.annotations.length,
    // };
    // 
    // const key = `${this.STORAGE_KEY}:${photo.id}`;
    // await AsyncStorage.setItem(key, JSON.stringify(metadata));
  }

  private async loadPhotoFromStorage(photoId: string): Promise<Photo | null> {
    // Mock implementation - in real app would load from AsyncStorage
    return null;
  }

  private async loadAllPhotoMetadata(): Promise<PhotoMetadata[]> {
    // Mock implementation - in real app would load all metadata from AsyncStorage
    return [];
  }

  private async deletePhotoFiles(photo: Photo): Promise<void> {
    // Mock implementation - in real app would delete files using react-native-fs
    // Example:
    // import RNFS from 'react-native-fs';
    // 
    // if (photo.uri !== photo.originalUri) {
    //   await RNFS.unlink(photo.uri);
    // }
    // await RNFS.unlink(photo.originalUri);
  }

  private async deletePhotoMetadata(photoId: string): Promise<void> {
    // Mock implementation - in real app would delete from AsyncStorage
    // Example:
    // import AsyncStorage from '@react-native-async-storage/async-storage';
    // const key = `${this.STORAGE_KEY}:${photoId}`;
    // await AsyncStorage.removeItem(key);
  }

  private generateId(): string {
    return `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateAnnotationId(): string {
    return `annotation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
export const photoAnnotationService = new PhotoAnnotationService();
