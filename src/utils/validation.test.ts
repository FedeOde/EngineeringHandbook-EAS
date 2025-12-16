import {
  validateRequired,
  validateNumber,
  validatePositiveNumber,
  validateNonNegativeNumber,
  validateRange,
  validateLength,
  validateEmail,
  combineValidations,
  getValidationMessage,
} from './validation';

const mockTranslate = (key: string, params?: any): string => {
  const translations: Record<string, string> = {
    'validation.required': 'This field is required',
    'validation.invalidNumber': 'Please enter a valid number',
    'validation.positiveNumber': 'Value must be a positive number',
    'validation.nonNegativeNumber': 'Value must be zero or greater',
    'validation.minValue': `Value must be at least ${params?.min}`,
    'validation.maxValue': `Value must be at most ${params?.max}`,
    'validation.tooShort': 'Input is too short',
    'validation.tooLong': 'Input is too long',
    'validation.invalidEmail': 'Please enter a valid email address',
  };
  return translations[key] || key;
};

describe('validateRequired', () => {
  it('returns valid for non-empty values', () => {
    expect(validateRequired('test').isValid).toBe(true);
    expect(validateRequired(123).isValid).toBe(true);
    expect(validateRequired(0).isValid).toBe(true);
  });

  it('returns invalid for empty values', () => {
    expect(validateRequired('').isValid).toBe(false);
    expect(validateRequired(null).isValid).toBe(false);
    expect(validateRequired(undefined).isValid).toBe(false);
  });
});

describe('validateNumber', () => {
  it('returns valid for valid numbers', () => {
    expect(validateNumber(123).isValid).toBe(true);
    expect(validateNumber('456').isValid).toBe(true);
    expect(validateNumber(0).isValid).toBe(true);
    expect(validateNumber(-10).isValid).toBe(true);
    expect(validateNumber(3.14).isValid).toBe(true);
  });

  it('returns invalid for non-numeric values', () => {
    expect(validateNumber('abc').isValid).toBe(false);
    expect(validateNumber(NaN).isValid).toBe(false);
    expect(validateNumber(Infinity).isValid).toBe(false);
    expect(validateNumber(-Infinity).isValid).toBe(false);
  });
});

describe('validatePositiveNumber', () => {
  it('returns valid for positive numbers', () => {
    expect(validatePositiveNumber(1).isValid).toBe(true);
    expect(validatePositiveNumber(100).isValid).toBe(true);
    expect(validatePositiveNumber(0.1).isValid).toBe(true);
  });

  it('returns invalid for zero and negative numbers', () => {
    expect(validatePositiveNumber(0).isValid).toBe(false);
    expect(validatePositiveNumber(-1).isValid).toBe(false);
    expect(validatePositiveNumber(-100).isValid).toBe(false);
  });

  it('returns invalid for non-numeric values', () => {
    expect(validatePositiveNumber('abc').isValid).toBe(false);
  });
});

describe('validateNonNegativeNumber', () => {
  it('returns valid for non-negative numbers', () => {
    expect(validateNonNegativeNumber(0).isValid).toBe(true);
    expect(validateNonNegativeNumber(1).isValid).toBe(true);
    expect(validateNonNegativeNumber(100).isValid).toBe(true);
  });

  it('returns invalid for negative numbers', () => {
    expect(validateNonNegativeNumber(-1).isValid).toBe(false);
    expect(validateNonNegativeNumber(-100).isValid).toBe(false);
  });
});

describe('validateRange', () => {
  it('returns valid for numbers within range', () => {
    expect(validateRange(5, 0, 10).isValid).toBe(true);
    expect(validateRange(0, 0, 10).isValid).toBe(true);
    expect(validateRange(10, 0, 10).isValid).toBe(true);
  });

  it('returns invalid for numbers below minimum', () => {
    const result = validateRange(-1, 0, 10);
    expect(result.isValid).toBe(false);
    expect(result.errorKey).toBe('validation.minValue');
  });

  it('returns invalid for numbers above maximum', () => {
    const result = validateRange(11, 0, 10);
    expect(result.isValid).toBe(false);
    expect(result.errorKey).toBe('validation.maxValue');
  });

  it('works with only minimum constraint', () => {
    expect(validateRange(5, 0).isValid).toBe(true);
    expect(validateRange(-1, 0).isValid).toBe(false);
  });

  it('works with only maximum constraint', () => {
    expect(validateRange(5, undefined, 10).isValid).toBe(true);
    expect(validateRange(11, undefined, 10).isValid).toBe(false);
  });
});

describe('validateLength', () => {
  it('returns valid for strings within length range', () => {
    expect(validateLength('test', 1, 10).isValid).toBe(true);
    expect(validateLength('a', 1, 10).isValid).toBe(true);
    expect(validateLength('1234567890', 1, 10).isValid).toBe(true);
  });

  it('returns invalid for strings too short', () => {
    const result = validateLength('', 1, 10);
    expect(result.isValid).toBe(false);
    expect(result.errorKey).toBe('validation.tooShort');
  });

  it('returns invalid for strings too long', () => {
    const result = validateLength('12345678901', 1, 10);
    expect(result.isValid).toBe(false);
    expect(result.errorKey).toBe('validation.tooLong');
  });
});

describe('validateEmail', () => {
  it('returns valid for valid email addresses', () => {
    expect(validateEmail('test@example.com').isValid).toBe(true);
    expect(validateEmail('user.name@domain.co.uk').isValid).toBe(true);
    expect(validateEmail('user+tag@example.com').isValid).toBe(true);
  });

  it('returns invalid for invalid email addresses', () => {
    expect(validateEmail('invalid').isValid).toBe(false);
    expect(validateEmail('invalid@').isValid).toBe(false);
    expect(validateEmail('@example.com').isValid).toBe(false);
    expect(validateEmail('invalid@domain').isValid).toBe(false);
  });
});

describe('combineValidations', () => {
  it('returns valid when all validations pass', () => {
    const result = combineValidations(
      { isValid: true },
      { isValid: true },
      { isValid: true }
    );
    expect(result.isValid).toBe(true);
  });

  it('returns first invalid validation', () => {
    const result = combineValidations(
      { isValid: true },
      { isValid: false, errorKey: 'error1' },
      { isValid: false, errorKey: 'error2' }
    );
    expect(result.isValid).toBe(false);
    expect(result.errorKey).toBe('error1');
  });
});

describe('getValidationMessage', () => {
  it('returns null for valid result', () => {
    const result = { isValid: true };
    expect(getValidationMessage(result, mockTranslate)).toBeNull();
  });

  it('returns translated message for invalid result', () => {
    const result = { isValid: false, errorKey: 'validation.required' };
    const message = getValidationMessage(result, mockTranslate);
    expect(message).toBe('This field is required');
  });

  it('returns null when errorKey is missing', () => {
    const result = { isValid: false };
    expect(getValidationMessage(result, mockTranslate)).toBeNull();
  });

  it('passes parameters to translate function', () => {
    const result = {
      isValid: false,
      errorKey: 'validation.minValue',
      errorParams: { min: 10 },
    };
    const message = getValidationMessage(result, mockTranslate);
    expect(message).toContain('10');
  });
});
