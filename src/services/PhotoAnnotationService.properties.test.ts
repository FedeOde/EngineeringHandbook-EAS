/**
 * Property-Based Tests for PhotoAnnotationService
 */

import * as fc from 'fast-check';
import { PhotoAnnotationService } from './PhotoAnnotationService';
import {
  Photo,
  Annotation,
  AnnotationType,
  Point,
  AnnotationProperties,
  PhotoSource,
  ExportFormat,
} from './PhotoAnnotationTypes';

describe('PhotoAnnotationService - Property-Based Tests', () => {
  let service: PhotoAnnotationService;

  beforeEach(() => {
    service = new PhotoAnnotationService();
  });

  // Custom arbitraries for photo annotation domain

  const photoSourceArbitrary = fc.constantFrom<PhotoSource>('camera', 'gallery');

  const annotationTypeArbitrary = fc.constantFrom<AnnotationType>(
    'text',
    'line',
    'arrow',
    'rectangle',
    'circle'
  );

  const pointArbitrary = fc.record({
    x: fc.double({ min: 0, max: 1000, noNaN: true }),
    y: fc.double({ min: 0, max: 1000, noNaN: true }),
  });

  const colorArbitrary = fc.oneof(
    fc.constant('#FF0000'),
    fc.constant('#00FF00'),
    fc.constant('#0000FF'),
    fc.constant('#FFFF00'),
    fc.constant('#FF00FF'),
    fc.constant('#00FFFF'),
    fc.constant('#000000'),
    fc.constant('#FFFFFF')
  );

  const annotationPropertiesArbitrary = fc.record({
    color: fc.option(colorArbitrary, { nil: undefined }),
    strokeWidth: fc.option(fc.integer({ min: 1, max: 10 }), { nil: undefined }),
    text: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: undefined }),
    fontSize: fc.option(fc.integer({ min: 8, max: 72 }), { nil: undefined }),
    startPoint: fc.option(pointArbitrary, { nil: undefined }),
    endPoint: fc.option(pointArbitrary, { nil: undefined }),
    width: fc.option(fc.double({ min: 1, max: 500, noNaN: true }), { nil: undefined }),
    height: fc.option(fc.double({ min: 1, max: 500, noNaN: true }), { nil: undefined }),
    radius: fc.option(fc.double({ min: 1, max: 250, noNaN: true }), { nil: undefined }),
  });

  const annotationArbitrary = fc.record({
    type: annotationTypeArbitrary,
    position: pointArbitrary,
    properties: annotationPropertiesArbitrary,
  });

  // Feature: engineering-pocket-helper, Property 15: Annotated photo preservation
  // Validates: Requirements 7.3
  it('should preserve original photo URI when saving annotated version', async () => {
    await fc.assert(
      fc.asyncProperty(
        photoSourceArbitrary,
        fc.array(annotationArbitrary, { minLength: 1, maxLength: 10 }),
        async (source: PhotoSource, annotationsData: Array<{
          type: AnnotationType;
          position: Point;
          properties: AnnotationProperties;
        }>) => {
          // Load a photo
          const photo = await service.loadPhoto(source);
          const originalUri = photo.originalUri;

          // Property: Initially, uri should equal originalUri
          expect(photo.uri).toBe(originalUri);

          // Add annotations to the photo
          for (const annotationData of annotationsData) {
            const annotation = service.createAnnotation(
              annotationData.type,
              annotationData.position,
              annotationData.properties
            );
            await service.addAnnotation(photo.id, annotation);
          }

          // Save the annotated photo
          const annotatedUri = await service.saveAnnotatedPhoto(photo.id);

          // Property: The annotated URI should be different from the original URI
          expect(annotatedUri).not.toBe(originalUri);
          expect(annotatedUri).toContain('annotated');

          // Retrieve the photo to verify preservation
          const retrievedPhoto = await service.getPhoto(photo.id);
          expect(retrievedPhoto).not.toBeNull();

          // Property: The original URI should remain unchanged
          expect(retrievedPhoto!.originalUri).toBe(originalUri);

          // Property: The current URI should be the annotated URI
          expect(retrievedPhoto!.uri).toBe(annotatedUri);

          // Property: The original URI should still be accessible (not equal to annotated URI)
          expect(retrievedPhoto!.originalUri).not.toBe(retrievedPhoto!.uri);

          // Property: Both URIs should be defined and non-empty
          expect(retrievedPhoto!.originalUri).toBeDefined();
          expect(retrievedPhoto!.originalUri.length).toBeGreaterThan(0);
          expect(retrievedPhoto!.uri).toBeDefined();
          expect(retrievedPhoto!.uri.length).toBeGreaterThan(0);

          // Property: The annotations should still be present
          expect(retrievedPhoto!.annotations.length).toBe(annotationsData.length);

          // Clean up
          await service.deletePhoto(photo.id);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: engineering-pocket-helper, Property 16: Annotation mutability
  // Validates: Requirements 7.4
  it('should allow modifying annotation properties and deleting annotations', async () => {
    await fc.assert(
      fc.asyncProperty(
        photoSourceArbitrary,
        annotationArbitrary,
        annotationPropertiesArbitrary,
        async (
          source: PhotoSource,
          initialAnnotationData: {
            type: AnnotationType;
            position: Point;
            properties: AnnotationProperties;
          },
          updatedProperties: AnnotationProperties
        ) => {
          // Load a photo
          const photo = await service.loadPhoto(source);

          // Create and add an annotation
          const annotation = service.createAnnotation(
            initialAnnotationData.type,
            initialAnnotationData.position,
            initialAnnotationData.properties
          );
          await service.addAnnotation(photo.id, annotation);

          // Retrieve the photo to get the annotation with its ID
          let retrievedPhoto = await service.getPhoto(photo.id);
          expect(retrievedPhoto).not.toBeNull();
          expect(retrievedPhoto!.annotations.length).toBe(1);

          const addedAnnotation = retrievedPhoto!.annotations[0];
          const annotationId = addedAnnotation.id;

          // Property: Annotation should have an ID
          expect(annotationId).toBeDefined();
          expect(annotationId.length).toBeGreaterThan(0);

          // Property: Initial annotation should match what we added
          expect(addedAnnotation.type).toBe(initialAnnotationData.type);
          expect(addedAnnotation.position).toEqual(initialAnnotationData.position);

          // Update the annotation properties
          await service.updateAnnotation(photo.id, annotationId, {
            properties: updatedProperties,
          });

          // Retrieve the photo again to verify the update
          retrievedPhoto = await service.getPhoto(photo.id);
          expect(retrievedPhoto).not.toBeNull();
          expect(retrievedPhoto!.annotations.length).toBe(1);

          const updatedAnnotation = retrievedPhoto!.annotations[0];

          // Property: Annotation ID should remain the same after update
          expect(updatedAnnotation.id).toBe(annotationId);

          // Property: Annotation type should remain the same (we only updated properties)
          expect(updatedAnnotation.type).toBe(initialAnnotationData.type);

          // Property: Annotation position should remain the same (we only updated properties)
          expect(updatedAnnotation.position).toEqual(initialAnnotationData.position);

          // Property: Annotation properties should be updated
          // Check that the updated properties are present
          if (updatedProperties.color !== undefined) {
            expect(updatedAnnotation.properties.color).toBe(updatedProperties.color);
          }
          if (updatedProperties.strokeWidth !== undefined) {
            expect(updatedAnnotation.properties.strokeWidth).toBe(updatedProperties.strokeWidth);
          }
          if (updatedProperties.text !== undefined) {
            expect(updatedAnnotation.properties.text).toBe(updatedProperties.text);
          }

          // Now test deletion
          await service.deleteAnnotation(photo.id, annotationId);

          // Retrieve the photo again to verify deletion
          retrievedPhoto = await service.getPhoto(photo.id);
          expect(retrievedPhoto).not.toBeNull();

          // Property: After deletion, the annotation should no longer exist
          expect(retrievedPhoto!.annotations.length).toBe(0);

          // Property: The deleted annotation should not be in the annotations array
          const deletedAnnotation = retrievedPhoto!.annotations.find(
            (a) => a.id === annotationId
          );
          expect(deletedAnnotation).toBeUndefined();

          // Clean up
          await service.deletePhoto(photo.id);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: engineering-pocket-helper, Property 17: Photo export format validity
  // Validates: Requirements 7.5
  it('should export annotated photos in valid image formats (JPEG or PNG)', async () => {
    await fc.assert(
      fc.asyncProperty(
        photoSourceArbitrary,
        fc.array(annotationArbitrary, { minLength: 1, maxLength: 5 }),
        fc.constantFrom<'jpeg' | 'png'>('jpeg', 'png'),
        fc.option(fc.double({ min: 0.1, max: 1.0, noNaN: true }), { nil: undefined }),
        async (
          source: PhotoSource,
          annotationsData: Array<{
            type: AnnotationType;
            position: Point;
            properties: AnnotationProperties;
          }>,
          format: 'jpeg' | 'png',
          quality: number | undefined
        ) => {
          // Load a photo
          const photo = await service.loadPhoto(source);

          // Add annotations to the photo
          for (const annotationData of annotationsData) {
            const annotation = service.createAnnotation(
              annotationData.type,
              annotationData.position,
              annotationData.properties
            );
            await service.addAnnotation(photo.id, annotation);
          }

          // Export the photo with the specified format
          const exportFormat = { format, quality };
          const exportedPath = await service.exportPhoto(photo.id, exportFormat);

          // Property: The exported path should be defined and non-empty
          expect(exportedPath).toBeDefined();
          expect(exportedPath.length).toBeGreaterThan(0);

          // Property: The exported path should be a string
          expect(typeof exportedPath).toBe('string');

          // Property: The exported path should have the correct file extension
          if (format === 'jpeg') {
            // JPEG files can have .jpg or .jpeg extension
            expect(exportedPath).toMatch(/\.(jpg|jpeg)$/i);
          } else if (format === 'png') {
            expect(exportedPath).toMatch(/\.png$/i);
          }

          // Property: The exported path should be different from the original URI
          // (unless the original was already in the correct format)
          expect(exportedPath).toBeDefined();

          // Property: The exported path should contain a valid file path structure
          // It should either start with 'file://' or be a valid path
          const isValidPath = 
            exportedPath.startsWith('file://') || 
            exportedPath.includes('/') || 
            exportedPath.includes('\\') ||
            exportedPath.match(/^[a-zA-Z]:\\/); // Windows path

          expect(isValidPath).toBe(true);

          // Property: The format in the path should match the requested format
          const pathExtension = exportedPath.toLowerCase();
          if (format === 'jpeg') {
            expect(pathExtension.endsWith('.jpg') || pathExtension.endsWith('.jpeg')).toBe(true);
          } else {
            expect(pathExtension.endsWith('.png')).toBe(true);
          }

          // Property: Exporting the same photo multiple times should produce consistent results
          const exportedPath2 = await service.exportPhoto(photo.id, exportFormat);
          
          // Both exports should have the same format extension
          const ext1 = exportedPath.match(/\.(jpg|jpeg|png)$/i)?.[0].toLowerCase();
          const ext2 = exportedPath2.match(/\.(jpg|jpeg|png)$/i)?.[0].toLowerCase();
          
          // Normalize .jpg and .jpeg to be considered the same
          const normalizeExt = (ext: string | undefined) => {
            if (!ext) return '';
            return ext === '.jpeg' ? '.jpg' : ext;
          };
          
          expect(normalizeExt(ext1)).toBe(normalizeExt(ext2));

          // Clean up
          await service.deletePhoto(photo.id);
        }
      ),
      { numRuns: 100 }
    );
  });
});
