import { OffsetParameters, OffsetResult, DiagramData } from './types';

/**
 * OffsetCalculator service for calculating pipe offset dimensions
 */
export class OffsetCalculator {
  // Supported offset angles in degrees
  private readonly SUPPORTED_ANGLES = [15, 22.5, 30, 45, 60, 90];

  /**
   * Get list of supported offset angles
   * @returns Array of supported angles in degrees
   */
  getSupportedAngles(): number[] {
    return [...this.SUPPORTED_ANGLES];
  }

  /**
   * Validate that the angle is supported
   * @param angle - Angle in degrees
   * @returns true if angle is supported
   */
  private isAngleSupported(angle: number): boolean {
    return this.SUPPORTED_ANGLES.includes(angle);
  }

  /**
   * Validate input parameters
   * @param params - Offset parameters
   * @throws Error if parameters are invalid
   */
  private validateParameters(params: OffsetParameters): void {
    // Validate offset distance
    if (
      params.offsetDistance === null ||
      params.offsetDistance === undefined ||
      typeof params.offsetDistance !== 'number' ||
      isNaN(params.offsetDistance) ||
      !isFinite(params.offsetDistance) ||
      params.offsetDistance <= 0
    ) {
      throw new Error('Invalid offset distance: must be a positive finite number');
    }

    // Validate angle
    if (
      params.angle === null ||
      params.angle === undefined ||
      typeof params.angle !== 'number' ||
      isNaN(params.angle) ||
      !isFinite(params.angle)
    ) {
      throw new Error('Invalid angle: must be a valid finite number');
    }

    if (!this.isAngleSupported(params.angle)) {
      throw new Error(
        `Unsupported angle: ${params.angle}. Supported angles are: ${this.SUPPORTED_ANGLES.join(', ')}`
      );
    }

    // Validate pipe diameter if provided
    if (params.pipeDiameter !== undefined && params.pipeDiameter !== null) {
      if (
        typeof params.pipeDiameter !== 'number' ||
        isNaN(params.pipeDiameter) ||
        !isFinite(params.pipeDiameter) ||
        params.pipeDiameter < 0
      ) {
        throw new Error('Invalid pipe diameter: must be a non-negative finite number');
      }
    }
  }

  /**
   * Calculate pipe offset dimensions
   * 
   * For a pipe offset:
   * - Rise: vertical distance (offsetDistance)
   * - Run: horizontal distance
   * - Travel: length of the angled pipe section
   * 
   * Using trigonometry:
   * - sin(angle) = rise / travel  =>  travel = rise / sin(angle)
   * - tan(angle) = rise / run     =>  run = rise / tan(angle)
   * 
   * When pipe diameter is specified, we need to account for center-to-center
   * measurements. The actual travel increases because we measure from pipe centers.
   * 
   * @param params - Offset parameters
   * @returns OffsetResult with calculated dimensions
   */
  calculateOffset(params: OffsetParameters): OffsetResult {
    // Validate inputs
    this.validateParameters(params);

    const { offsetDistance, angle, pipeDiameter } = params;

    // Convert angle to radians
    const angleRad = (angle * Math.PI) / 180;

    // Calculate basic dimensions
    // Rise is the offset distance (vertical distance)
    const rise = offsetDistance;

    // Calculate travel using: travel = rise / sin(angle)
    let travel = rise / Math.sin(angleRad);

    // Calculate run using: run = rise / tan(angle)
    const run = rise / Math.tan(angleRad);

    // Account for pipe diameter if provided
    // When measuring center-to-center, the travel distance increases
    // by approximately (pipeDiameter / sin(angle)) for each connection
    if (pipeDiameter && pipeDiameter > 0) {
      // Add the additional length needed for pipe diameter
      // This accounts for the fact that we're measuring from pipe centers
      const diameterEffect = pipeDiameter / Math.sin(angleRad);
      travel += diameterEffect;
    }

    // Cut length is the same as travel for a simple offset
    const cutLength = travel;

    // Generate diagram data
    const diagram: DiagramData = {
      offsetDistance: rise,
      angle,
      travel,
      rise,
      run,
      pipeDiameter,
    };

    return {
      travel,
      rise,
      run,
      cutLength,
      diagram,
    };
  }
}

// Export singleton instance
export const offsetCalculator = new OffsetCalculator();
