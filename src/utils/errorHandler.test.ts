import {
  AppError,
  ErrorCode,
  getErrorMessage,
  handleAsyncOperation,
  isRecoverableError,
} from './errorHandler';

const mockTranslate = (key: string): string => {
  const translations: Record<string, string> = {
    'errors.invalidInput': 'Invalid input',
    'errors.notFound': 'Not found',
    'errors.storageError': 'Storage error',
    'errors.permissionDenied': 'Permission denied',
    'errors.calculationFailed': 'Calculation failed',
    'errors.networkError': 'Network error',
    'errors.databaseError': 'Database error',
    'errors.fileSystemError': 'File system error',
    'errors.insufficientStorage': 'Insufficient storage',
    'errors.cameraAccessDenied': 'Camera access denied',
    'errors.microphoneAccessDenied': 'Microphone access denied',
    'errors.invalidNumericInput': 'Invalid numeric input',
    'errors.valueOutOfRange': 'Value out of range',
    'errors.missingRequiredField': 'Missing required field',
    'errors.dataCorrupted': 'Data corrupted',
    'errors.operationFailed': 'Operation failed',
    'errors.unexpectedError': 'Unexpected error',
  };
  return translations[key] || key;
};

describe('AppError', () => {
  it('creates an AppError with default values', () => {
    const error = new AppError('Test error');

    expect(error.message).toBe('Test error');
    expect(error.code).toBe(ErrorCode.UNEXPECTED_ERROR);
    expect(error.recoverable).toBe(true);
    expect(error.name).toBe('AppError');
  });

  it('creates an AppError with custom values', () => {
    const error = new AppError(
      'Custom error',
      ErrorCode.INVALID_INPUT,
      false,
      { field: 'test' }
    );

    expect(error.message).toBe('Custom error');
    expect(error.code).toBe(ErrorCode.INVALID_INPUT);
    expect(error.recoverable).toBe(false);
    expect(error.details).toEqual({ field: 'test' });
  });
});

describe('getErrorMessage', () => {
  it('returns translated message for AppError with known code', () => {
    const error = new AppError('Test', ErrorCode.INVALID_INPUT);
    const message = getErrorMessage(error, mockTranslate);

    expect(message).toBe('Invalid input');
  });

  it('returns translated message for different error codes', () => {
    const codes = [
      ErrorCode.NOT_FOUND,
      ErrorCode.STORAGE_ERROR,
      ErrorCode.PERMISSION_DENIED,
      ErrorCode.CALCULATION_FAILED,
    ];

    codes.forEach((code) => {
      const error = new AppError('Test', code);
      const message = getErrorMessage(error, mockTranslate);
      expect(message).toBeTruthy();
      expect(message).not.toBe('Test');
    });
  });

  it('returns error message for regular Error', () => {
    const error = new Error('Regular error message');
    const message = getErrorMessage(error, mockTranslate);

    expect(message).toBe('Regular error message');
  });

  it('returns unexpected error message for unknown error code', () => {
    const error = new AppError('Test', 'UNKNOWN_CODE' as ErrorCode);
    const message = getErrorMessage(error, mockTranslate);

    expect(message).toBe('Unexpected error');
  });
});

describe('handleAsyncOperation', () => {
  it('returns result on successful operation', async () => {
    const operation = async () => 'success';
    const result = await handleAsyncOperation(operation);

    expect(result).toBe('success');
  });

  it('returns null on failed operation', async () => {
    const operation = async () => {
      throw new Error('Operation failed');
    };
    const result = await handleAsyncOperation(operation);

    expect(result).toBeNull();
  });

  it('calls onError callback on failure', async () => {
    const onError = jest.fn();
    const operation = async () => {
      throw new Error('Operation failed');
    };

    await handleAsyncOperation(operation, onError);

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith(expect.any(AppError));
  });

  it('converts regular Error to AppError', async () => {
    const onError = jest.fn();
    const operation = async () => {
      throw new Error('Regular error');
    };

    await handleAsyncOperation(operation, onError);

    const calledError = onError.mock.calls[0][0];
    expect(calledError).toBeInstanceOf(AppError);
    expect(calledError.message).toBe('Regular error');
  });
});

describe('isRecoverableError', () => {
  it('returns true for recoverable AppError', () => {
    const error = new AppError('Test', ErrorCode.INVALID_INPUT, true);
    expect(isRecoverableError(error)).toBe(true);
  });

  it('returns false for non-recoverable AppError', () => {
    const error = new AppError('Test', ErrorCode.DATA_CORRUPTED, false);
    expect(isRecoverableError(error)).toBe(false);
  });

  it('returns true for regular Error', () => {
    const error = new Error('Regular error');
    expect(isRecoverableError(error)).toBe(true);
  });
});
