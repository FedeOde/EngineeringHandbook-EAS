import {add, multiply} from './math';

describe('Math utilities', () => {
  describe('add', () => {
    it('adds two positive numbers', () => {
      expect(add(2, 3)).toBe(5);
    });

    it('adds negative numbers', () => {
      expect(add(-2, -3)).toBe(-5);
    });
  });

  describe('multiply', () => {
    it('multiplies two positive numbers', () => {
      expect(multiply(2, 3)).toBe(6);
    });

    it('multiplies by zero', () => {
      expect(multiply(5, 0)).toBe(0);
    });
  });
});
