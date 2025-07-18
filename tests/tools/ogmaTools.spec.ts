import {expect} from 'chai';
import 'mocha';

import {OgmaTools} from '../../src';

describe('OgmaTools.isBright', () => {
  describe('null and empty values', () => {
    it('should return true for null', () => {
      expect(OgmaTools.isBright(null)).to.be.true;
    });

    it('should return true for empty string', () => {
      expect(OgmaTools.isBright('')).to.be.true;
    });
  });

  describe('hexadecimal colors', () => {
    it('should correctly identify bright hex colors (6 digits)', () => {
      expect(OgmaTools.isBright('#FFFFFF')).to.be.true; // White
      expect(OgmaTools.isBright('#FFD700')).to.be.true; // Gold
    });

    it('should correctly identify dark hex colors (6 digits)', () => {
      expect(OgmaTools.isBright('#000000')).to.be.false; // Black
      expect(OgmaTools.isBright('#8B0000')).to.be.false; // Dark red
    });

    it('should correctly handle 3-digit hex colors', () => {
      expect(OgmaTools.isBright('#FFF')).to.be.true; // White
      expect(OgmaTools.isBright('#000')).to.be.false; // Black
    });
  });

  describe('RGB colors', () => {
    it('should correctly identify bright RGB colors', () => {
      expect(OgmaTools.isBright('rgb(255, 255, 255)')).to.be.true; // White
      expect(OgmaTools.isBright('rgb(255, 215, 0)')).to.be.true; // Gold
    });

    it('should correctly identify dark RGB colors', () => {
      expect(OgmaTools.isBright('rgb(0, 0, 0)')).to.be.false; // Black
      expect(OgmaTools.isBright('rgb(139, 0, 0)')).to.be.false; // Dark red
    });

    it('should handle RGB colors with whitespace', () => {
      expect(OgmaTools.isBright('rgb( 255, 255, 255 )')).to.be.true;
    });
  });

  describe('RGBA colors', () => {
    it('should correctly identify bright RGBA colors', () => {
      expect(OgmaTools.isBright('rgba(255, 255, 255, 1)')).to.be.true;
      expect(OgmaTools.isBright('rgba(255, 255, 255, 0.5)')).to.be.true;
    });

    it('should correctly identify dark RGBA colors', () => {
      expect(OgmaTools.isBright('rgba(0, 0, 0, 1)')).to.be.false;
      expect(OgmaTools.isBright('rgba(0, 0, 0, 0.5)')).to.be.false;
    });
  });

  describe('HTML color names', () => {
    it('should correctly identify bright HTML color names', () => {
      expect(OgmaTools.isBright('white')).to.be.true;
      expect(OgmaTools.isBright('yellow')).to.be.true;
    });

    it('should correctly identify dark HTML color names', () => {
      expect(OgmaTools.isBright('black')).to.be.false;
      expect(OgmaTools.isBright('navy')).to.be.false;
    });
  });

  describe('threshold cases', () => {
    it('should identify colors just above the brightness threshold as bright', () => {
      // Threshold is 255 * 0.7 = 178.5 for weighted RGB
      expect(OgmaTools.isBright('rgb(179, 179, 179)')).to.be.true;
    });

    it('should identify colors just below the brightness threshold as dark', () => {
      expect(OgmaTools.isBright('rgb(178, 178, 178)')).to.be.false;
    });
  });

  describe('invalid formats', () => {
    it('should return true for invalid color formats', () => {
      expect(OgmaTools.isBright('not-a-color')).to.be.true;
      expect(OgmaTools.isBright('rgb(300, 0, 0)')).to.be.true;
    });
  });
});
