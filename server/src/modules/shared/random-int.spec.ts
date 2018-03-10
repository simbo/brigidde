import { expect } from 'chai';

import { randomInt } from './random-int';

describe('randomInt()', () => {

  it('should return a random number between 0 and 9 by default', () => {
    for(let i = 0; i <= 50; i++) {
      expect(randomInt()).to.be.within(0, 9);
    }
  });

  it('should return a random number between given max and min value', () => {
    for(let i = 0; i <= 50; i++) {
      expect(randomInt(10, 20)).to.be.within(10, 20);
      expect(randomInt(-20, -10)).to.be.within(-20, -10);
    }
  });

  it('should automatically correct if first value is larger than second value or both are the same', () => {
    for(let i = 0; i <= 50; i++) {
      expect(randomInt(20, 10)).to.be.within(10, 20);
      expect(randomInt(-10, -20)).to.be.within(-20, -10);
    }
  });

  it('should return the given value if both are the same', () => {
    expect(randomInt(10, 10)).to.be.within(10, 10);
  });

});
