/**
 * Input validation utilities
 */

export interface ValidationResult {
  isValid: boolean;
  errorKey?: string;
  errorParams?: Record<string, any>;
}

/**
 * Validate that a value is not empty
 */
export const validateRequired = (value: any): ValidationResult => {
  if (value === null || value === undefined || value === '') {
    return {
      isValid: false,
      errorKey: 'validation.required',
    };
  }
  return { isValid: true };
};

/**
 * Validate that a value is a valid number
 */
export const validateNumber = (value: any): ValidationResult => {
  const num = Number(value);
  if (isNaN(num) || !isFinite(num)) {
    return {
      isValid: false,
      errorKey: 'validation.invalidNumber',
    };
  }
  return { isValid: true };
};

/**
 * Validate that a number is positive
 */
export const validatePositiveNumber = (value: any): ValidationResult => {
  const numberValidation = validateNumber(value);
  if (!numberValidation.isValid) {
    return numberValidation;
  }

  const num = Number(value);
  if (num <= 0) {
    return {
      isValid: false,
      errorKey: 'validation.positiveNumber',
    };
  }
  return { isValid: true };
};

/**
 * Validate that a number is non-negative
 */
export const validateNonNegativeNumber = (value: any): ValidationResult => {
  const numberValidation = validateNumber(value);
  if (!numberValidation.isValid) {
    return numberValidation;
  }

  const num = Number(value);
  if (num < 0) {
    return {
      isValid: false,
      errorKey: 'validation.nonNegativeNumber',
    };
  }
  return { isValid: true };
};

/**
 * Validate that a number is within a range
 */
export const validateRange = (
  value: any,
  min?: number,
  max?: number
): ValidationResult => {
  const numberValidation = validateNumber(value);
  if (!numberValidation.isValid) {
    return numberValidation;
  }

  const num = Number(value);

  if (min !== undefined && num < min) {
    return {
      isValid: false,
      errorKey: 'validation.minValue',
      errorParams: { min },
    };
  }

  if (max !== undefined && num > max) {
    return {
      isValid: false,
      errorKey: 'validation.maxValue',
      errorParams: { max },
    };
  }

  return { isValid: true };
};

/**
 * Validate string length
 */
export const validateLength = (
  value: string,
  min?: number,
  max?: number
): ValidationResult => {
  if (min !== undefined && value.length < min) {
    return {
      isValid: false,
      errorKey: 'validation.tooShort',
      errorParams: { min },
    };
  }

  if (max !== undefined && value.length > max) {
    return {
      isValid: false,
      errorKey: 'validation.tooLong',
      errorParams: { max },
    };
  }

  return { isValid: true };
};

/**
 * Validate email format
 */
export const validateEmail = (value: string): ValidationResult => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return {
      isValid: false,
      errorKey: 'validation.invalidEmail',
    };
  }
  return { isValid: true };
};

/**
 * Combine multiple validation results
 */
export const combineValidations = (
  ...validations: ValidationResult[]
): ValidationResult => {
  for (const validation of validations) {
    if (!validation.isValid) {
      return validation;
    }
  }
  return { isValid: true };
};

/**
 * Get validation error message
 */
export const getValidationMessage = (
  result: ValidationResult,
  translate: (key: string, params?: any) => string
): string | null => {
  if (result.isValid || !result.errorKey) {
    return null;
  }
  return translate(result.errorKey, result.errorParams);
};
