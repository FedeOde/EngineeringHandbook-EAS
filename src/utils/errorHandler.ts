/**
 * Error handling utilities for the application
 */

export enum ErrorCode {
  INVALID_INPUT = 'INVALID_INPUT',
  NOT_FOUND = 'NOT_FOUND',
  STORAGE_ERROR = 'STORAGE_ERROR',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  CALCULATION_FAILED = 'CALCULATION_FAILED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  FILE_SYSTEM_ERROR = 'FILE_SYSTEM_ERROR',
  INSUFFICIENT_STORAGE = 'INSUFFICIENT_STORAGE',
  CAMERA_ACCESS_DENIED = 'CAMERA_ACCESS_DENIED',
  MICROPHONE_ACCESS_DENIED = 'MICROPHONE_ACCESS_DENIED',
  INVALID_NUMERIC_INPUT = 'INVALID_NUMERIC_INPUT',
  VALUE_OUT_OF_RANGE = 'VALUE_OUT_OF_RANGE',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  DATA_CORRUPTED = 'DATA_CORRUPTED',
  OPERATION_FAILED = 'OPERATION_FAILED',
  UNEXPECTED_ERROR = 'UNEXPECTED_ERROR',
}

export class AppError extends Error {
  code: ErrorCode;
  recoverable: boolean;
  details?: any;

  constructor(
    message: string,
    code: ErrorCode = ErrorCode.UNEXPECTED_ERROR,
    recoverable: boolean = true,
    details?: any
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.recoverable = recoverable;
    this.details = details;
  }
}

/**
 * Get user-friendly error message based on error code
 */
export const getErrorMessage = (error: Error | AppError, translate: (key: string) => string): string => {
  if (error instanceof AppError) {
    switch (error.code) {
      case ErrorCode.INVALID_INPUT:
        return translate('errors.invalidInput');
      case ErrorCode.NOT_FOUND:
        return translate('errors.notFound');
      case ErrorCode.STORAGE_ERROR:
        return translate('errors.storageError');
      case ErrorCode.PERMISSION_DENIED:
        return translate('errors.permissionDenied');
      case ErrorCode.CALCULATION_FAILED:
        return translate('errors.calculationFailed');
      case ErrorCode.NETWORK_ERROR:
        return translate('errors.networkError');
      case ErrorCode.DATABASE_ERROR:
        return translate('errors.databaseError');
      case ErrorCode.FILE_SYSTEM_ERROR:
        return translate('errors.fileSystemError');
      case ErrorCode.INSUFFICIENT_STORAGE:
        return translate('errors.insufficientStorage');
      case ErrorCode.CAMERA_ACCESS_DENIED:
        return translate('errors.cameraAccessDenied');
      case ErrorCode.MICROPHONE_ACCESS_DENIED:
        return translate('errors.microphoneAccessDenied');
      case ErrorCode.INVALID_NUMERIC_INPUT:
        return translate('errors.invalidNumericInput');
      case ErrorCode.VALUE_OUT_OF_RANGE:
        return translate('errors.valueOutOfRange');
      case ErrorCode.MISSING_REQUIRED_FIELD:
        return translate('errors.missingRequiredField');
      case ErrorCode.DATA_CORRUPTED:
        return translate('errors.dataCorrupted');
      case ErrorCode.OPERATION_FAILED:
        return translate('errors.operationFailed');
      default:
        return translate('errors.unexpectedError');
    }
  }
  return error.message || translate('errors.unexpectedError');
};

/**
 * Handle async operations with error handling
 */
export const handleAsyncOperation = async <T>(
  operation: () => Promise<T>,
  onError?: (error: Error) => void
): Promise<T | null> => {
  try {
    return await operation();
  } catch (error) {
    const appError = error instanceof AppError ? error : new AppError(
      error instanceof Error ? error.message : 'Unknown error',
      ErrorCode.OPERATION_FAILED
    );
    
    if (onError) {
      onError(appError);
    } else {
      console.error('Async operation failed:', appError);
    }
    
    return null;
  }
};

/**
 * Check if error is recoverable
 */
export const isRecoverableError = (error: Error | AppError): boolean => {
  if (error instanceof AppError) {
    return error.recoverable;
  }
  return true; // Assume unknown errors are recoverable
};
