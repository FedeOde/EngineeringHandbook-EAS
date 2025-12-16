/**
 * Unit tests for PhotoAnnotationService
 */

import { PhotoAnnotationService } from './PhotoAnnotationService';
import {
  Photo,
  Annotation,
  AnnotationType,
  Point,
  ExportFormat,
} from './PhotoAnnotationTypes';

describe('PhotoAnnotationService', () => {
  let service: PhotoAnnotationService;

  beforeEach(() => {
    service = new PhotoAnnotationService();
  });

  describe('loadPhoto', () => {
    it('should load a photo from camera', async () => {
      const photo = await service.loadPhoto('camera');

      expect(photo).toBeDefined();
      expect(photo.id).toBeDefined();
      expect(photo.uri).toBeDefined();
      expect(photo.originalUri).toBe(photo.uri);
      expect(photo.annotations).toEqual([]);
      expect(photo.timestamp).toBeInstanceOf(Date);
    });

    it('should load a photo from gallery', async () => {
      const photo = await service.loadPhoto('gallery');

      expect(photo).toBeDefined();
      expect(photo.id).toBeDefined();
      expect(photo.uri).toBeDefined();
      expect(photo.originalUri).toBe(photo.uri);
      expect(photo.annotations).toEqual([]);
      expect(photo.timestamp).toBeInstanceOf(Date);
    });

    it('should create unique IDs for different photos', async () => {
      const photo1 = await service.loadPhoto('camera');
      const photo2 = await service.loadPhoto('camera');

      expect(photo1.id).not.toBe(photo2.id);
    });
  });

  describe('getPhoto', () => {
    it('should retrieve a loaded photo by ID', async () => {
      const loadedPhoto = await service.loadPhoto('camera');
      const retrievedPhoto = await service.getPhoto(loadedPhoto.id);

      expect(retrievedPhoto).toBeDefined();
      expect(retrievedPhoto?.id).toBe(loadedPhoto.id);
    });

    it('should return null for non-existent photo ID', async () => {
      const photo = await service.getPhoto('non-existent-id');

      expect(photo).toBeNull();
    });
  });

  describe('addAnnotation', () => {
    it('should add a line annotation to a photo', async () => {
      const photo = await service.loadPhoto('camera');
      
      const annotation = service.createAnnotation(
        'line',
        { x: 10, y: 20 },
        {
          color: '#FF0000',
          strokeWidth: 2,
          startPoint: { x: 10, y: 20 },
          endPoint: { x: 100, y: 200 },
        }
      );

      await service.addAnnotation(photo.id, annotation);

      const updatedPhoto = await service.getPhoto(photo.id);
      expect(updatedPhoto?.annotations).toHaveLength(1);
      expect(updatedPhoto?.annotations[0].type).toBe('line');
      expect(updatedPhoto?.annotations[0].id).toBeDefined();
    });

    it('should add a text annotation to a photo', async () => {
      const photo = await service.loadPhoto('camera');
      
      const annotation = service.createAnnotation(
        'text',
        { x: 50, y: 50 },
        {
          color: '#0000FF',
          text: 'Test annotation',
          fontSize: 16,
        }
      );

      await service.addAnnotation(photo.id, annotation);

      const updatedPhoto = await service.getPhoto(photo.id);
      expect(updatedPhoto?.annotations).toHaveLength(1);
      expect(updatedPhoto?.annotations[0].type).toBe('text');
      expect(updatedPhoto?.annotations[0].properties.text).toBe('Test annotation');
    });

    it('should add multiple annotations to a photo', async () => {
      const photo = await service.loadPhoto('camera');
      
      const annotation1 = service.createAnnotation('line', { x: 0, y: 0 }, {});
      const annotation2 = service.createAnnotation('circle', { x: 50, y: 50 }, {});

      await service.addAnnotation(photo.id, annotation1);
      await service.addAnnotation(photo.id, annotation2);

      const updatedPhoto = await service.getPhoto(photo.id);
      expect(updatedPhoto?.annotations).toHaveLength(2);
    });

    it('should throw error when adding annotation to non-existent photo', async () => {
      const annotation = service.createAnnotation('line', { x: 0, y: 0 }, {});

      await expect(
        service.addAnnotation('non-existent-id', annotation)
      ).rejects.toThrow('Photo not found');
    });
  });

  describe('updateAnnotation', () => {
    it('should update an existing annotation', async () => {
      const photo = await service.loadPhoto('camera');
      const annotation = service.createAnnotation(
        'text',
        { x: 10, y: 10 },
        { text: 'Original text' }
      );

      await service.addAnnotation(photo.id, annotation);
      const photoWithAnnotation = await service.getPhoto(photo.id);
      const annotationId = photoWithAnnotation!.annotations[0].id;

      await service.updateAnnotation(photo.id, annotationId, {
        properties: { text: 'Updated text' },
      });

      const updatedPhoto = await service.getPhoto(photo.id);
      expect(updatedPhoto?.annotations[0].properties.text).toBe('Updated text');
    });

    it('should throw error when updating non-existent annotation', async () => {
      const photo = await service.loadPhoto('camera');

      await expect(
        service.updateAnnotation(photo.id, 'non-existent-annotation', {})
      ).rejects.toThrow('Annotation not found');
    });
  });

  describe('deleteAnnotation', () => {
    it('should delete an annotation from a photo', async () => {
      const photo = await service.loadPhoto('camera');
      const annotation = service.createAnnotation('line', { x: 0, y: 0 }, {});

      await service.addAnnotation(photo.id, annotation);
      const photoWithAnnotation = await service.getPhoto(photo.id);
      const annotationId = photoWithAnnotation!.annotations[0].id;

      await service.deleteAnnotation(photo.id, annotationId);

      const updatedPhoto = await service.getPhoto(photo.id);
      expect(updatedPhoto?.annotations).toHaveLength(0);
    });

    it('should not throw error when deleting non-existent annotation', async () => {
      const photo = await service.loadPhoto('camera');

      await expect(
        service.deleteAnnotation(photo.id, 'non-existent-annotation')
      ).resolves.not.toThrow();
    });
  });

  describe('saveAnnotatedPhoto', () => {
    it('should save annotated photo and return new URI', async () => {
      const photo = await service.loadPhoto('camera');
      const annotation = service.createAnnotation('line', { x: 0, y: 0 }, {});
      await service.addAnnotation(photo.id, annotation);

      const savedUri = await service.saveAnnotatedPhoto(photo.id);

      expect(savedUri).toBeDefined();
      expect(savedUri).toContain('annotated');
    });

    it('should preserve original photo URI', async () => {
      const photo = await service.loadPhoto('camera');
      const originalUri = photo.originalUri;
      
      const annotation = service.createAnnotation('line', { x: 0, y: 0 }, {});
      await service.addAnnotation(photo.id, annotation);

      await service.saveAnnotatedPhoto(photo.id);

      const updatedPhoto = await service.getPhoto(photo.id);
      expect(updatedPhoto?.originalUri).toBe(originalUri);
      expect(updatedPhoto?.uri).not.toBe(originalUri);
    });

    it('should throw error when saving non-existent photo', async () => {
      await expect(
        service.saveAnnotatedPhoto('non-existent-id')
      ).rejects.toThrow('Photo not found');
    });
  });

  describe('exportPhoto', () => {
    it('should export photo in JPEG format', async () => {
      const photo = await service.loadPhoto('camera');
      const annotation = service.createAnnotation('line', { x: 0, y: 0 }, {});
      await service.addAnnotation(photo.id, annotation);

      const exportFormat: ExportFormat = { format: 'jpeg', quality: 0.9 };
      const exportedPath = await service.exportPhoto(photo.id, exportFormat);

      expect(exportedPath).toBeDefined();
      expect(exportedPath).toMatch(/\.jpg$/i);
    });

    it('should export photo in PNG format', async () => {
      const photo = await service.loadPhoto('camera');
      const annotation = service.createAnnotation('line', { x: 0, y: 0 }, {});
      await service.addAnnotation(photo.id, annotation);

      const exportFormat: ExportFormat = { format: 'png' };
      const exportedPath = await service.exportPhoto(photo.id, exportFormat);

      expect(exportedPath).toBeDefined();
      expect(exportedPath).toMatch(/\.png$/i);
    });

    it('should throw error when exporting non-existent photo', async () => {
      const exportFormat: ExportFormat = { format: 'jpeg' };

      await expect(
        service.exportPhoto('non-existent-id', exportFormat)
      ).rejects.toThrow('Photo not found');
    });
  });

  describe('deletePhoto', () => {
    it('should delete a photo and its annotations', async () => {
      const photo = await service.loadPhoto('camera');
      const annotation = service.createAnnotation('line', { x: 0, y: 0 }, {});
      await service.addAnnotation(photo.id, annotation);

      await service.deletePhoto(photo.id);

      const deletedPhoto = await service.getPhoto(photo.id);
      expect(deletedPhoto).toBeNull();
    });

    it('should not throw error when deleting non-existent photo', async () => {
      await expect(
        service.deletePhoto('non-existent-id')
      ).resolves.not.toThrow();
    });
  });

  describe('createAnnotation', () => {
    it('should create a line annotation with default properties', () => {
      const annotation = service.createAnnotation(
        'line',
        { x: 10, y: 20 },
        {}
      );

      expect(annotation.type).toBe('line');
      expect(annotation.position).toEqual({ x: 10, y: 20 });
      expect(annotation.properties.color).toBe('#FF0000');
      expect(annotation.properties.strokeWidth).toBe(2);
    });

    it('should create an annotation with custom properties', () => {
      const annotation = service.createAnnotation(
        'circle',
        { x: 50, y: 50 },
        {
          color: '#00FF00',
          strokeWidth: 5,
          radius: 25,
        }
      );

      expect(annotation.type).toBe('circle');
      expect(annotation.properties.color).toBe('#00FF00');
      expect(annotation.properties.strokeWidth).toBe(5);
      expect(annotation.properties.radius).toBe(25);
    });

    it('should create all annotation types', () => {
      const types: AnnotationType[] = ['line', 'arrow', 'rectangle', 'circle', 'text'];

      types.forEach((type) => {
        const annotation = service.createAnnotation(type, { x: 0, y: 0 }, {});
        expect(annotation.type).toBe(type);
      });
    });
  });

  describe('getAllPhotos', () => {
    it('should return empty array when no photos exist', async () => {
      const photos = await service.getAllPhotos();
      expect(photos).toEqual([]);
    });

    it('should return all loaded photos', async () => {
      const photo1 = await service.loadPhoto('camera');
      const photo2 = await service.loadPhoto('gallery');

      const photos = await service.getAllPhotos();

      expect(photos.length).toBeGreaterThanOrEqual(2);
      const photoIds = photos.map((p) => p.id);
      expect(photoIds).toContain(photo1.id);
      expect(photoIds).toContain(photo2.id);
    });

    it('should return photos sorted by timestamp (newest first)', async () => {
      // Create photos with slight delay to ensure different timestamps
      const photo1 = await service.loadPhoto('camera');
      await new Promise((resolve) => setTimeout(resolve, 10));
      const photo2 = await service.loadPhoto('camera');

      const photos = await service.getAllPhotos();

      if (photos.length >= 2) {
        expect(photos[0].timestamp.getTime()).toBeGreaterThanOrEqual(
          photos[1].timestamp.getTime()
        );
      }
    });
  });
});
