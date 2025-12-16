import * as fc from 'fast-check';
import {add, multiply} from './math';

describe('Math utilities - Property-Based Tests', () => {
  describe('add', () => {
    it('should be commutative', () => {
      fc.assert(
        fc.property(fc.integer(), fc.integer(), (a, b) => {
          return add(a, b) === add(b, a);
        }),
        {numRuns: 100}
      );
    });

    it('should have zero as identity element', () => {
      fc.assert(
        fc.property(fc.integer(), (a) => {
          return add(a, 0) === a;
        }),
        {numRuns: 100}
      );
    });
  });

  describe('multiply', () => {
    it('should be commutative', () => {
      fc.assert(
        fc.property(fc.integer(), fc.integer(), (a, b) => {
          return multiply(a, b) === multiply(b, a);
        }),
        {numRuns: 100}
      );
    });

    it('should have one as identity element', () => {
      fc.assert(
        fc.property(fc.integer(), (a) => {
          return multiply(a, 1) === a;
        }),
        {numRuns: 100}
      );
    });

    it('should have zero as absorbing element', () => {
      fc.assert(
        fc.property(fc.integer(), (a) => {
          return multiply(a, 0) === 0;
        }),
        {numRuns: 100}
      );
    });
  });
});
