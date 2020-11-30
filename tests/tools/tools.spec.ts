import { expect } from 'chai';
import 'mocha';
import {Tools } from '../../src/tools/tools';
import Ogma from 'ogma';
import { NodeList } from '../../src/ogma/models';
import {LkEdgeData, LkNodeData, PropertyTypeName} from "@linkurious/rest-client";

describe('Tools', () => {
  describe('Tools.getType', () => {
    it('should return "imageUrl"', () => {
      expect(Tools.getType('http://troloe/fdsfd.jpg')).to.equal('imageUrl');
      expect(Tools.getType('http://troloe/fdsfd.jpeg')).to.equal('imageUrl');
      expect(Tools.getType('http://troloe/fdsfd.svg')).to.equal('imageUrl');
      expect(Tools.getType('http://troloe/fdsfd.png')).to.equal('imageUrl');
      expect(Tools.getType('http://troloe/fdsfd.gif')).to.equal('imageUrl');
      expect(Tools.getType('http://troloe/fdsfd.bmp')).to.equal('imageUrl');
      expect(Tools.getType('http://troloe/fdsfd.tiff')).to.equal('imageUrl');
      expect(Tools.getType('https://troloe/fdsfd.jpg')).to.equal('imageUrl');
      expect(Tools.getType('https://troloe/fdsfd.jpeg')).to.equal('imageUrl');
      expect(Tools.getType('https://troloe/fdsfd.svg')).to.equal('imageUrl');
      expect(Tools.getType('https://troloe/fdsfd.png')).to.equal('imageUrl');
      expect(Tools.getType('https://troloe/fdsfd.gif')).to.equal('imageUrl');
      expect(Tools.getType('https://troloe/fdsfd.bmp')).to.equal('imageUrl');
      expect(Tools.getType('https://troloe/fdsfd.tiff')).to.equal('imageUrl');
      expect(Tools.getType('http://troloefdsfd.jpg')).to.equal('imageUrl');
      expect(Tools.getType('http://troloefdsfd.jpeg')).to.equal('imageUrl');
      expect(Tools.getType('http://troloefdsfd.svg')).to.equal('imageUrl');
      expect(Tools.getType('http://troloefdsfd.png')).to.equal('imageUrl');
      expect(Tools.getType('http://troloefdsfd.gif')).to.equal('imageUrl');
      expect(Tools.getType('http://troloefdsfd.bmp')).to.equal('imageUrl');
      expect(Tools.getType('http://troloefdsfd.tiff')).to.equal('imageUrl');
    });

    it('should return "image"', () => {
        expect(Tools.getType('troloe/fdsfd.jpg')).to.equal('image');
        expect(Tools.getType('troloe/fdsfd.jpeg')).to.equal('image');
        expect(Tools.getType('troloe/fdsfd.svg')).to.equal('image');
        expect(Tools.getType('troloe/fdsfd.png')).to.equal('image');
        expect(Tools.getType('troloe/fdsfd.gif')).to.equal('image');
        expect(Tools.getType('troloe/fdsfd.bmp')).to.equal('image');
        expect(Tools.getType('fdsfd.tiff')).to.equal('image');
        expect(Tools.getType('/troloe/fdsfd.jpg')).to.equal('image');
        expect(Tools.getType('troloe/fdsfd.jpeg')).to.equal('image');
        expect(Tools.getType('troloe/fdsfd.svg')).to.equal('image');
        expect(Tools.getType('troloe/fdsfd.png')).to.equal('image');
        expect(Tools.getType('troloe/fdsfd.gif')).to.equal('image');
        expect(Tools.getType('troloe/fdsfd.bmp')).to.equal('image');
        expect(Tools.getType('troloe/fdsfd.tiff')).to.equal('image');
        expect(Tools.getType('troloefdsfd.jpg')).to.equal('image');
        expect(Tools.getType('troloefdsfd.jpeg')).to.equal('image');
        expect(Tools.getType('troloefdsfd.svg')).to.equal('image');
        expect(Tools.getType('troloefdsfd.png')).to.equal('image');
        expect(Tools.getType('troloefdsfd.gif')).to.equal('image');
        expect(Tools.getType('troloefdsfd.bmp')).to.equal('image');
        expect(Tools.getType('troloefdsfd.tiff')).to.equal('image');
    });

    it('should return "url"', () => {
      expect(Tools.getType('dict://troloe/fdsfd.dssq')).to.equal('url');
      expect(Tools.getType('file://troloe/fdsfd.fr')).to.equal('url');
      expect(Tools.getType('ftp://troloe/fdsfd.fr')).to.equal('url');
      expect(Tools.getType('sftp://troloe/fdsfd.fr')).to.equal('url');
      expect(Tools.getType('http://troloe/fdsfd.fr')).to.equal('url');
      expect(Tools.getType('https://troloe/fdsfd.fr')).to.equal('url');
      expect(Tools.getType('imap://troloe/fdsfd.fr')).to.equal('url');
      expect(Tools.getType('ldap://troloe/fdsfd.fr')).to.equal('url');
      expect(Tools.getType('ldaps://troloe/fdsfd.fr')).to.equal('url');
      expect(Tools.getType('nfs://troloe/fdsfd.fr')).to.equal('url');
      expect(Tools.getType('nntp://troloe/fdsfd.fr')).to.equal('url');
      expect(Tools.getType('rtsp://troloe/fdsfd.fr')).to.equal('url');
      expect(Tools.getType('snmp://troloe/fdsfd.fr')).to.equal('url');
      expect(Tools.getType('aft://troloe/fdsfd.fr')).to.equal('url');
      expect(Tools.getType('cvs://troloe/fdsfd.fr')).to.equal('url');
      expect(Tools.getType('feed://troloe/fdsfd.fr')).to.equal('url');
      expect(Tools.getType('fish://troloe/fdsfd.fr')).to.equal('url');
      expect(Tools.getType('keyparc://troloe/fdsfd.fr')).to.equal('url');
      expect(Tools.getType('mms://troloe/fdsfd.fr')).to.equal('url');
      expect(Tools.getType('notes://troloe/fdsfd.fr')).to.equal('url');
      expect(Tools.getType('sgn://troloe/fdsfd.fr')).to.equal('url');
      expect(Tools.getType('smb://troloe/fdsfd.fr')).to.equal('url');
      expect(Tools.getType('svn://troloe/fdsfd.fr')).to.equal('url');
      expect(Tools.getType('svn+ssh://troloe/fdsfd.fr')).to.equal('url');
      expect(Tools.getType('webcal://troloe/fdsfd.fr')).to.equal('url');
      expect(Tools.getType('rtsp://troloe/fdsfd.fr')).to.equal('url');
      expect(Tools.getType('snmp://troloe/fdsfd.fr')).to.equal('url');
      expect(Tools.getType('aft://troloe/fdsfd.fr')).to.equal('url');
    });

    it('should return "undefined"', () => {
      expect(Tools.getType('someoneexample.com')).to.be.undefined;
      expect(Tools.getType('someone@example')).to.be.undefined;
      expect(Tools.getType('someone@example.c')).to.be.undefined;
      expect(Tools.getType('@example.c')).to.be.undefined;
      expect(Tools.getType('fdsf:/fdsfs')).to.be.undefined;
      expect(Tools.getType('ezre/fdsf.fr')).to.be.undefined;
      expect(Tools.getType('zezrezredezd')).to.be.undefined;
      expect(Tools.getType('12')).to.be.undefined;
      expect(Tools.getType('[rezrez]')).to.be.undefined;
      expect(Tools.getType('{dfdfsf: dsfdf}')).to.be.undefined;
    });
  });

  describe('Tools.sanitizeUrlParams', () => {
    it('return the url params', () => {
      expect(
          Tools.sanitizeUrlParams("?populate=nodeId&item_id=16958&key=e7900d9b")
      ).to.eql({
        populate: "nodeId",
        item_id: "16958",
        key: "e7900d9b"
      });
    });
  });

  describe('Tools.isInt', () => {

    it('should accept regular integers', () => {
      expect(Tools.isInt(1)).to.equal(true);
      expect(Tools.isInt(12)).to.equal(true);
      expect(Tools.isInt(-12)).to.equal(true);
      expect(Tools.isInt(99999999)).to.equal(true);
      expect(Tools.isInt(-99999999)).to.equal(true);
      expect(Tools.isInt(0)).to.equal(true);
      expect(Tools.isInt(0.)).to.equal(true);
      expect(Tools.isInt(.0)).to.equal(true);
      expect(Tools.isInt(-1)).to.equal(true);
    });

    it('should accept regular integers as strings', () => {
      expect(Tools.isInt('1')).to.equal(true);
      expect(Tools.isInt('-1')).to.equal(true);
      expect(Tools.isInt('.0')).to.equal(true);
      expect(Tools.isInt(',0')).to.equal(true);
      expect(Tools.isInt('-18.')).to.equal(true);
      expect(Tools.isInt('18.')).to.equal(true);
      expect(Tools.isInt('18,')).to.equal(true);
      expect(Tools.isInt('0.')).to.equal(true);
      expect(Tools.isInt('0,')).to.equal(true);
      expect(Tools.isInt('12')).to.equal(true);
      expect(Tools.isInt('9999999')).to.equal(true);
      expect(Tools.isInt('-9999999')).to.equal(true);
    });

    it('should accept special integers as strings', () => {
      expect(Tools.isInt('1e2')).to.equal(true);
      expect(Tools.isInt('.0')).to.equal(true);
      expect(Tools.isInt('-.0')).to.equal(true);
      expect(Tools.isInt('-1e2')).to.equal(true);
      expect(Tools.isInt('5e2')).to.equal(true);
      expect(Tools.isInt('.5e2')).to.equal(true);
      expect(Tools.isInt('0.5e2')).to.equal(true);
      expect(Tools.isInt('+.0')).to.equal(true);
      expect(Tools.isInt('0x12')).to.equal(true);
      expect(Tools.isInt('0xae')).to.equal(true);
    });

    it('should refuse strings that are not integers', () => {
      expect(Tools.isInt('0xag')).to.equal(false);
      expect(Tools.isInt('e')).to.equal(false);
      expect(Tools.isInt('')).to.equal(false);
      expect(Tools.isInt('-')).to.equal(false);
      expect(Tools.isInt('+')).to.equal(false);
      expect(Tools.isInt('\\')).to.equal(false);
      expect(Tools.isInt('\'')).to.equal(false);
      expect(Tools.isInt('()')).to.equal(false);
      expect(Tools.isInt('.')).to.equal(false);
      expect(Tools.isInt('*')).to.equal(false);
      expect(Tools.isInt('2/2')).to.equal(false);
      expect(Tools.isInt('test')).to.equal(false);
      expect(Tools.isInt('abc')).to.equal(false);
      expect(Tools.isInt('NaN')).to.equal(false);
      expect(Tools.isInt('Infinity')).to.equal(false);
      expect(Tools.isInt('+Infinity')).to.equal(false);
      expect(Tools.isInt('-Infinity')).to.equal(false);
      expect(Tools.isInt('12a')).to.equal(false);
      expect(Tools.isInt('12a')).to.equal(false);
      expect(Tools.isInt('12e')).to.equal(false);
    });

    it('should refuse floats as strings', () => {
      expect(Tools.isInt('12,14')).to.equal(false);
      expect(Tools.isInt('12.14')).to.equal(false);
      expect(Tools.isInt('12.0014')).to.equal(false);
      expect(Tools.isInt('99999.00001')).to.equal(false);
    });

    it('should refuse floats as numbers', () => {
      expect(Tools.isInt(12.14)).to.equal(false);
      expect(Tools.isInt(1.14)).to.equal(false);
      expect(Tools.isInt(1.00014)).to.equal(false);
      expect(Tools.isInt(1.0001)).to.equal(false);
      expect(Tools.isInt(1231.0001)).to.equal(false);
      expect(Tools.isInt(9999999.0001)).to.equal(false);
    });

    it('should refuse funny types', () => {
      // null/undefined
      expect(Tools.isInt(null)).to.equal(false);
      expect(Tools.isInt(undefined)).to.equal(false);
      // date
      expect(Tools.isInt(new Date(123))).to.equal(false);
      // regexp
      expect(Tools.isInt(/123/)).to.equal(false);
      // array
      expect(Tools.isInt([1, 2, 3])).to.equal(false);
      expect(Tools.isInt(['1', '2', '3'])).to.equal(false);
      // object
      expect(Tools.isInt({})).to.equal(false);
      expect(Tools.isInt({10: 10})).to.equal(false);
      expect(Tools.isInt({ab: 10})).to.equal(false);
    });
  });

  describe('Tools.isFloat', () => {

    it('should be true for positive floats', () => {
      expect(Tools.isFloat(12.14)).to.equal(true);

      expect(Tools.isFloat('12.14')).to.equal(true);
      expect(Tools.isFloat('12,14')).to.equal(true);

      expect(Tools.isFloat('.14')).to.equal(true);
      expect(Tools.isFloat(',14')).to.equal(true);

      expect(Tools.isFloat('0.14')).to.equal(true);
      expect(Tools.isFloat('0,14')).to.equal(true);

      expect(Tools.isFloat('1.14')).to.equal(true);
      expect(Tools.isFloat('1,14')).to.equal(true);
    });

    it('should be false for non-finite numbers', () => {
      expect(Tools.isFloat(NaN)).to.equal(false);
      expect(Tools.isFloat(Infinity)).to.equal(false);
      expect(Tools.isFloat(+Infinity)).to.equal(false);
      expect(Tools.isFloat(-Infinity)).to.equal(false);
    });

    it('should be true for negative floats', () => {
      expect(Tools.isFloat(-12.14)).to.equal(true);

      expect(Tools.isFloat('-12.14')).to.equal(true);
      expect(Tools.isFloat('-12,14')).to.equal(true);

      expect(Tools.isFloat('-.14')).to.equal(true);
      expect(Tools.isFloat('-,14')).to.equal(true);

      expect(Tools.isFloat('-0.14')).to.equal(true);
      expect(Tools.isFloat('-0,14')).to.equal(true);

      expect(Tools.isFloat('-1.14')).to.equal(true);
      expect(Tools.isFloat('-1,14')).to.equal(true);
    });

    it('should be false for positive integers', () => {
      expect(Tools.isFloat(0)).to.equal(false);
      expect(Tools.isFloat(12)).to.equal(false);

      expect(Tools.isFloat('12')).to.equal(false);

      expect(Tools.isFloat('12.0')).to.equal(false);
      expect(Tools.isFloat('12,0')).to.equal(false);

      expect(Tools.isFloat('1000')).to.equal(false);

      expect(Tools.isFloat('1e3')).to.equal(false);

      expect(Tools.isFloat('0.0')).to.equal(false);
      expect(Tools.isFloat('0,0')).to.equal(false);
    });

    it('should be false for negative integers', () => {
      expect(Tools.isFloat(-0)).to.equal(false);
      expect(Tools.isFloat(-12)).to.equal(false);

      expect(Tools.isFloat('-12')).to.equal(false);

      expect(Tools.isFloat('-12.0')).to.equal(false);
      expect(Tools.isFloat('-12,0')).to.equal(false);

      expect(Tools.isFloat('-1000')).to.equal(false);

      expect(Tools.isFloat('-1e3')).to.equal(false);

      expect(Tools.isFloat('-0.0')).to.equal(false);
      expect(Tools.isFloat('-0,0')).to.equal(false);
    });

    it('should return false for non-numerical strings', () => {
      expect(Tools.isFloat('test')).to.equal(false);
      expect(Tools.isFloat('-')).to.equal(false);
      expect(Tools.isFloat('')).to.equal(false);
      expect(Tools.isFloat('.')).to.equal(false);
      expect(Tools.isFloat('*')).to.equal(false);
      expect(Tools.isFloat('1/1')).to.equal(false);
      expect(Tools.isFloat('1%')).to.equal(false);
      expect(Tools.isFloat('NaN')).to.equal(false);
      expect(Tools.isFloat('12,4aa')).to.equal(false);
      expect(Tools.isFloat('12,4aa')).to.equal(false);
      expect(Tools.isFloat('12.4-')).to.equal(false);
      expect(Tools.isFloat('Infinity')).to.equal(false);
      expect(Tools.isFloat('-Infinity')).to.equal(false);
    });
  });

  describe('Tools.parseFloat', () => {

    it('should return float', () => {
      expect(Tools.parseFloat(12.14)).to.equal(12.14);
    });

    it('should return float', () => {
      expect(Tools.parseFloat('12,14')).to.equal(12.14);
    });

    it('should return float', () => {
      expect(Tools.parseFloat('12')).to.equal(12.00);
    });

    it('should return float', () => {
      expect(Tools.parseFloat(12)).to.equal(12.00);
    });

    it('should return NaN', () => {
      expect(Tools.parseFloat('test')).to.be.NaN;
    });
  });

  describe('Tools.shortenNumbers', () => {

    it('should return -3', () => {
      expect(Tools.shortenNumber (-3)).to.equal('-3');
    });

    it('should return 3', () => {
      expect(Tools.shortenNumber (3)).to.equal('3');
    });

    it('should return 12', () => {
      expect(Tools.shortenNumber (12)).to.equal('12');
    });

    it('should return 100', () => {
      expect(Tools.shortenNumber (100)).to.equal('100');
    });

    it('should return 999', () => {
      expect(Tools.shortenNumber (999)).to.equal('999');
    });

    it('should return 1k', () => {
      expect(Tools.shortenNumber (1000)).to.equal('1k');
    });

    it('should return 1.2k', () => {
      expect(Tools.shortenNumber (1234)).to.equal('1.2k');
    });

    it('should return 1.9k', () => {
      expect(Tools.shortenNumber (1912)).to.equal('1.9k');
    });

    it('should return -1.9k', () => {
      expect(Tools.shortenNumber (-1912)).to.equal('-1.9k');
    });

    it('should return 2.1k', () => {
      expect(Tools.shortenNumber (2123)).to.equal('2.1k');
    });

    it('should return 9.1k', () => {
      expect(Tools.shortenNumber (9123)).to.equal('9.1k');
    });

    it('should return 12k', () => {
      expect(Tools.shortenNumber (12345)).to.equal('12k');
    });

    it('should return 123k', () => {
      expect(Tools.shortenNumber (123456)).to.equal('123k');
    });

    it('should return 1.2M', () => {
      expect(Tools.shortenNumber (1234567)).to.equal('1.2M');
    });

    it('should return 12M', () => {
      expect(Tools.shortenNumber (12345678)).to.equal('12M');
    });

    it('should return -12M', () => {
      expect(Tools.shortenNumber (-12345678)).to.equal('-12M');
    });

    it('should return -1.2M', () => {
      expect(Tools.shortenNumber (-1234567)).to.equal('-1.2M');
    });

  });

  describe('Tools.formatNumber', () => {

    it('should return 1', () => {
      expect(Tools.formatNumber( 1)).to.equal('1');
    });

    it('should return -1', () => {
      expect(Tools.formatNumber( -1)).to.equal('-1');
    });

    it('should return 1.2', () => {
      expect(Tools.formatNumber( 1.2)).to.equal('1.2');
    });

    it('should return -1.2', () => {
      expect(Tools.formatNumber( -1.2)).to.equal('-1.2');
    });

    it('should return 1.235', () => {
      expect(Tools.formatNumber( 1.23456)).to.equal('1.235');
    });

    it('should return 12', () => {
      expect(Tools.formatNumber( 12)).to.equal('12');
    });

    it('should return 12.1', () => {
      expect(Tools.formatNumber( 12.1)).to.equal('12.1');
    });

    it('should return 123', () => {
      expect(Tools.formatNumber( 123)).to.equal('123');
    });

    it('should return 123.4', () => {
      expect(Tools.formatNumber( 123.4)).to.equal('123.4');
    });

    it('should return 1,234', () => {
      expect(Tools.formatNumber( 1234)).to.equal('1,234');
    });

    it('should return 1,234.6', () => {
      expect(Tools.formatNumber( 1234.6)).to.equal('1,234.6');
    });

    it('should return -1,234.6', () => {
      expect(Tools.formatNumber( -1234.6)).to.equal('-1,234.6');
    });

    it('should return 12,345', () => {
      expect(Tools.formatNumber( 12345)).to.equal('12,345');
    });

    it('should return -12,345', () => {
      expect(Tools.formatNumber( -12345)).to.equal('-12,345');
    });

    it('should return 12,345.7', () => {
      expect(Tools.formatNumber( 12345.7)).to.equal('12,345.7');
    });

    it('should return 123,456', () => {
      expect(Tools.formatNumber( 123456)).to.equal('123,456');
    });

    it('should return 123,456.7', () => {
      expect(Tools.formatNumber( 123456.7)).to.equal('123,456.7');
    });

    it('should return 123,456.789', () => {
      expect(Tools.formatNumber( 123456.78912)).to.equal('123,456.789');
    });

    it('should return -123,456.789', () => {
      expect(Tools.formatNumber( -123456.78912)).to.equal('-123,456.789');
    });

  });

  describe('Tools.clone', () => {
    it('should clone an object', () => {
      expect(Tools.clone({test: 1})).to.eql({test: 1});
    });

      it('should clone an object', () => {
          expect(Tools.clone({test: 1, set: new Set([1])})).to.eql({test: 1, set: {}});
      });
  });

  describe('Tools.copy', () => {
    it('should create a copy of an object', () => {
      expect(Tools.copy({test: 1})).to.eql({test: 1});
    });

    it('should create a copy of an array', () => {
      expect(Tools.copy([1, 2])).to.eql([1, 2]);
    });

    it('should return the value non affected', () => {
      expect(Tools.copy(1)).to.eql(1);
      expect(Tools.copy('1')).to.eql('1');
    });
  });

  describe('Tools.getPropertyKey', () => {
    it('should return a property key', () => {
      expect(Tools.getPropertyKey('data.properties.test')).to.equal('test');
      expect(Tools.getPropertyKey('data.test')).to.equal('test');
    });

    it('should return the string untouched', () => {
      expect(Tools.getPropertyKey('properties.test')).to.equal('properties.test');
      expect(Tools.getPropertyKey('test')).to.equal('test');
      expect(Tools.getPropertyKey('1')).to.equal('1');
    });
  });

  describe('Tools.getSourceParameter', () => {
    it('should return "[key, value]" for an url with key parameter', () => {
      expect(Tools.getSourceParameter('?key=gfd45tr4')).to.eql(['key', 'gfd45tr4']);
      expect(Tools.getSourceParameter('?jambon=true&key=gfd45tr4')).to.eql(['key', 'gfd45tr4']);
      expect(Tools.getSourceParameter('?key=gfd45tr4&jambon=true')).to.eql(['key', 'gfd45tr4']);
    });

    it('should return "[index, value]" for an url with index parameter', () => {
      expect(Tools.getSourceParameter('?sourceIndex=1')).to.eql(['sourceIndex', '1']);
      expect(Tools.getSourceParameter('?jambon=true&sourceIndex=1')).to.eql(['sourceIndex', '1']);
      expect(Tools.getSourceParameter('?sourceIndex=1&jambon=true')).to.eql(['sourceIndex', '1']);
    });

    it('should return "[]" for an url without key or index parameter', () => {
      expect(Tools.getSourceParameter('?jambon=true')).to.eql([]);
    });

    it('should return "[]" for a wrong url', () => {
      expect(Tools.getSourceParameter('dfsfdsfsd')).to.eql([]);
    });
  });

  describe('Tools.intervalToString', () => {
    it('should return a non-interval string if only one value is present', () => {
      expect(Tools.intervalToString(10, 30, 50)).to.equal('50');
      expect(Tools.intervalToString(10, 10, 50.24556)).to.equal('50.25');
      expect(Tools.intervalToString(10.43324342434, 30.33334343, 45)).to.equal('45');
    });

    it('should return a non-interval string if minimal value is equal to maximal one', () => {
      expect(Tools.intervalToString(10, 10)).to.equal('10');
      expect(Tools.intervalToString(10, 10)).to.equal('10');
      expect(Tools.intervalToString(10.3434234, 10.3434234)).to.equal('10.34');
      expect(Tools.intervalToString(10.3434234, 10.3434234)).to.equal('10.34');
    });

    it('should return a readable label for an interval', () => {
      expect(Tools.intervalToString(2, 4)).to.equal('2 - 4');
      expect(Tools.intervalToString(2.45645456, 4)).to.equal('2.46 - 4');
      expect(Tools.intervalToString(2, 4.56756567567)).to.equal('2 - 4.57');
      expect(Tools.intervalToString(2.56756, 4.6745456)).to.equal('2.57 - 4.67');
      expect(Tools.intervalToString(2.0000, 4.0000)).to.equal('2 - 4');
      expect(Tools.intervalToString(5, 4)).to.equal('5 - 4');
      expect(Tools.intervalToString(NaN, 4)).to.equal('NaN - 4');
      expect(Tools.intervalToString(2e5, 4)).to.equal('200000 - 4');
    });
  });

  describe('Tools.getBoundaries', () => {
    it('should return a tuple of a min and a max value of a sequence of numbers', () => {
      expect(Tools.getBoundaries([1, 2, 3, 4, 5])).to.eql([1, 5]);
      expect(Tools.getBoundaries([1, 2, 3, 4, 5e2])).to.eql([1, 500]);
      expect(Tools.getBoundaries([5, 2, 3, 4, 1])).to.eql([1, 5]);
      expect(Tools.getBoundaries([undefined, 2, 3, 4, 5])).to.eql([2, 5]);
      expect(Tools.getBoundaries([NaN, 2, 3, 4, 5])).to.eql([2, 5]);
      expect(Tools.getBoundaries([1.432423, 2, 3, 4, 5])).to.eql([1.432423, 5]);
      expect(Tools.getBoundaries([1, 2, 3, 4, 5.756565])).to.eql([1, 5.756565]);
      expect(Tools.getBoundaries([-1, 2, 3, 4, -5])).to.eql([-5, 4]);
      expect(Tools.getBoundaries([-1, 2, 3, 4, -5])).to.eql([-5, 4]);
      expect(Tools.getBoundaries([null, 2, 3, 4, 5])).to.eql([2, 5]);
      expect(Tools.getBoundaries([null, 2, 3, 4, Infinity])).to.eql([2, Infinity]);
      expect(Tools.getBoundaries([2])).to.eql([2, 2]);
      expect(Tools.getBoundaries([2.767567])).to.eql([2.767567, 2.767567]);
    });

    it('should return undefined if boundaries cannot be reached', () => {
      expect(Tools.getBoundaries([null, null])).to.equal(undefined);
      expect(Tools.getBoundaries([])).to.equal(undefined);
      expect(Tools.getBoundaries([NaN, NaN])).to.equal(undefined);
      expect(Tools.getBoundaries([undefined, undefined])).to.equal(undefined);
    });
  });

  describe('Tools.toNumbers', () => {
    it('should convert string to numbers when possible', () => {
      expect(Tools.toNumbers([undefined, null, 'toto', '2', '2.45'])).to.eql([2, 2.45]);
    });
  });

  describe('Tools.pullAt', () => {
    it('should remove given indexes and return new array', () => {
      expect(Tools.pullAt(['toto', 'tata'], [0])).to.eql(['tata']);
      expect(Tools.pullAt(['toto', 'tata'], [1])).to.eql(['toto']);
      expect(Tools.pullAt(['toto', 'tata'], [2])).to.eql(['toto', 'tata']);
      expect(Tools.pullAt(['toto', 'tata', 'titi'], [1])).to.eql(['toto', 'titi']);
      expect(Tools.pullAt(['toto', 'tata', 'titi'], [0, 2])).to.eql(['tata']);
    });
  });

    describe('Tools.pushUniq', () => {
      it('should return a new array only with uniq items', () => {
        expect(Tools.pushUniq([], [])).to.eql([]);
        expect(Tools.pushUniq([], [2, 5, 8])).to.eql([2, 5, 8]);
        expect(Tools.pushUniq([1, 2, 3, 4, 5], [])).to.eql([1, 2, 3, 4, 5]);
        expect(Tools.pushUniq([1, 2, 3, 4], [1, 2, 3, 4])).to.eql([1, 2, 3, 4]);
        expect(Tools.pushUniq([1, 2, 3, 4, 5], [2, 5, 8])).to.eql([1, 2, 3, 4, 5, 8]);
        expect(Tools.pushUniq([1, 2], [3, 4, 5])).to.eql([1, 2, 3, 4, 5]);
        expect(Tools.pushUniq(['tata', 'toto'], ['tata', 'titi'])).to.eql(['tata', 'toto', 'titi']);
      });
    });

  describe('Tools.isEqual', () => {
    it('should return true if values are equals', () => {
      expect(Tools.isEqual(1, 1)).to.be.true;
      expect(Tools.isEqual(5e2, 500)).to.be.true;
      expect(Tools.isEqual(undefined, undefined)).to.be.true;
      expect(Tools.isEqual(null, null)).to.be.true;
      expect(Tools.isEqual(0, 0)).to.be.true;
      expect(Tools.isEqual([], [])).to.be.true;
      expect(Tools.isEqual('1', '1')).to.be.true;
      expect(Tools.isEqual('toto', 'toto')).to.be.true;
      expect(Tools.isEqual([1, 2], [1, 2])).to.be.true;
      expect(Tools.isEqual([1, [1, 2], 2], [1, [1, 2], 2])).to.be.true;
      expect(Tools.isEqual({test: 1, toto: 'toto'}, {test: 1, toto: 'toto'})).to.be.true;
      expect(Tools.isEqual({arr: [1, 2], number: 1}, {arr: [1, 2], number: 1})).to.be.true;
    });

    it('should return false if values are not equals', () => {
      expect(Tools.isEqual(0, '0')).to.be.false;
      expect(Tools.isEqual(1, '1')).to.be.false;
      expect(Tools.isEqual(0, '0')).to.be.false;
      expect(Tools.isEqual(1, 2)).to.be.false;
      expect(Tools.isEqual(1, 0)).to.be.false;
      expect(Tools.isEqual('toto', 'tata')).to.be.false;
      expect(Tools.isEqual('toto', NaN)).to.be.false;
      expect(Tools.isEqual(1, NaN)).to.be.false;
      expect(Tools.isEqual(undefined, null)).to.be.false;
      expect(Tools.isEqual(0, undefined)).to.be.false;
      expect(Tools.isEqual(0, null)).to.be.false;
      expect(Tools.isEqual([], [1])).to.be.false;
      expect(Tools.isEqual([1], [2])).to.be.false;
      expect(Tools.isEqual([1], [[1]])).to.be.false;
      expect(Tools.isEqual([1], [1, 2])).to.be.false;
      expect(Tools.isEqual([3, 4], [3, 5])).to.be.false;
      expect(Tools.isEqual([1, {name: 'test'}], [1, {name: 'toto'}])).to.be.false;
      expect(Tools.isEqual({name: true}, {test: true})).to.be.false;
      expect(Tools.isEqual({name: true}, {name: false})).to.be.false;
    });
  });

  describe('Tools.isDefined', () => {
    it('Should return true if value is not null or not undefined', () => {
      expect(Tools.isDefined(1)).to.be.true;
      expect(Tools.isDefined('toto')).to.be.true;
      expect(Tools.isDefined(0)).to.be.true;
      expect(Tools.isDefined([])).to.be.true;
      expect(Tools.isDefined([1])).to.be.true;
      expect(Tools.isDefined({test: null})).to.be.true;
      expect(Tools.isDefined({test: undefined})).to.be.true;
      expect(Tools.isDefined(NaN)).to.be.true;
    });

    it('Should return false if value is null or undefined', () => {
      expect(Tools.isDefined(null)).to.be.false;
      expect(Tools.isDefined(undefined)).to.be.false;
    });
  });

  describe('Tools.sortAlphabetically', () => {
    it('should sort alphabetically', () => {
      expect(Tools.sortAlphabetically([5, 0, 1])).to.eql([0, 1, 5]);
      expect(Tools.sortAlphabetically([5, 0, 1], 'id')).to.eql([5, 0, 1]);
      expect(Tools.sortAlphabetically(['r', 'g', 'fg', 'fa'])).to.eql(['fa', 'fg', 'g', 'r']);
      expect(Tools.sortAlphabetically(['test', 'foo', 5, 0, 1])).to.eql(['foo', 'test', 0, 1, 5]);
      expect(Tools.sortAlphabetically([{id: 12}, {id: 1}], 'id')).to.eql([{id: 1}, {id: 12}]);
      expect(Tools.sortAlphabetically([{id: 12}, {id: 1}])).to.eql([{id: 12}, {id: 1}]);
    });
  });

  describe('Tools.uniqBy', () => {
    it('should return an array without duplicate keys', () => {
      expect(Tools.uniqBy([1, 1, 2, 3, '2'])).to.eql([1, 2, 3, "2"]);
      expect(Tools.uniqBy([0, 0, 2, 3, '2'])).to.eql([0, 2, 3, "2"]);
      expect(Tools.uniqBy([5e1, 50, 5 * 10])).to.eql([50]);
      expect(Tools.uniqBy(['toto', 'tata', 'toto', null, undefined])).to.eql(["toto", "tata", null, undefined]);
      expect(Tools.uniqBy([NaN, NaN, 2, 3])).to.eql([NaN, 2, 3]);
      expect(Tools.uniqBy([[1], [2], [1], ['2']])).to.eql([[1], [2], ["2"]]);
      expect(Tools.uniqBy([{name: 'test'}, {name: '1'}, {name: 'test'}])).to.eql([{name: "test"}, {name: "1"}]);
      expect(Tools.uniqBy([{name: 'test', id: 2}, {name: '1', id: 2}, {name: 'test', id: 3}, {name: 'test', id: 2}])).to.eql([{name: 'test', id: 2}, {name: '1', id: 2}, {name: 'test', id: 3}]);
      expect(Tools.uniqBy([{name: 'test'}, {name: '1'}, {name: 'test'}], 'name')).to.eql([{name: "test"}, {name: "1"}]);
    });
  });

  describe('Tools.getNestedStructure', () => {
    it('should return the right object', () => {
      expect(Tools.getNestedStructure(['te', 'tes', 'test'], 'test')).to.eql({te: {tes: {test: 'test'}}});
    });
  });

  describe('Tools.getIn', () => {
    it('should return a value in a nested structure', () => {
      expect(Tools.getIn({t: {te: {test: 'test'}}}, ['t', 'te', 'test'])).to.equal('test');
    });

    it('should return a value in a nested structure', () => {
      expect(Tools.getIn({t: {te: {test: 0}}}, ['t', 'te', 'test'])).to.equal(0);
    });

    it('should return a value in a nested structure', () => {
      expect(Tools.getIn({t: {te: {test: null}}}, ['t', 'te', 'test'])).to.equal(null);
    });
  });

  describe('Tools.numberToPixels', () => {
    it('should return the right value', () => {
      expect(Tools.numberToPixels(2)).to.equal('2px');
      expect(Tools.numberToPixels(25.78)).to.equal('25.78px');
      expect(Tools.numberToPixels(2e5)).to.equal('200000px');
    });

    it('should return "0px" if the value passed is not a number', () => {
      expect(Tools.numberToPixels(NaN)).to.equal('0px');
      expect(Tools.numberToPixels(null)).to.equal('0px');
      expect(Tools.numberToPixels(undefined)).to.equal('0px');
    });
  });

  describe('Tools.getDiff', () => {

    it('should return an empty object', () => {
      expect(Tools.getDiff({name: 'bla'}, {name: 'bla'})).to.eql({});
      expect(Tools.getDiff({name: 0}, {name: 0})).to.eql({});
      expect(Tools.getDiff({name: 2e2}, {name: 200})).to.eql({});
      expect(Tools.getDiff({name: 2.5}, {name: 2.5})).to.eql({});
      expect(Tools.getDiff({name: null}, {name: null})).to.eql({});
      expect(Tools.getDiff({name: undefined}, {name: undefined})).to.eql({});
      expect(Tools.getDiff({name: undefined}, {name: null})).to.eql({});
      expect(Tools.getDiff({name: [1, 2]}, {name: [1, 2]})).to.eql({});
      expect(Tools.getDiff({name: {test: 'bla'}}, {name: {test: 'bla'}})).to.eql({});
    });

    it('should return the right diff based on two objects', () => {
      expect(Tools.getDiff({name: 'bla'}, {name: 'bli'})).to.eql({name: 'bla'});
      expect(Tools.getDiff({name: 'bla'}, {})).to.eql({name: 'bla'});
      expect(Tools.getDiff({name: 'bla'}, {nam: 'bla'})).to.eql({name: 'bla'});
      expect(Tools.getDiff({name: 0}, {name: 1})).to.eql({name: 0});
      expect(Tools.getDiff({name: 2e2}, {name: 201})).to.eql({name: 200});
      expect(Tools.getDiff({name: 2.5}, {name: 2.6})).to.eql({name: 2.5});
      expect(Tools.getDiff({name: [1, 3]}, {name: [1, 2]})).to.eql({name: [1, 3]});
      expect(Tools.getDiff({name: {test: 'bla'}}, {name: {test: 'bli'}})).to.eql({name: {test: 'bla'}});
      expect(Tools.getDiff({name: {tes: 'bla'}}, {name: {test: 'bla'}})).to.eql({name: {tes: 'bla'}});
    });

    it('should return the right diff based on two complex objects', () => {
      expect(Tools.getDiff({
        name: 'test',
        index: 105,
        truc: '15',
        properties: {
          name: 'bla',
          latitude: '2.5',
          longitude: 45,
          categories: ['COMPANY', 'INVESTOR']
        },
        indexes: [1, 5, 45]
      }, {
        name: 'test1',
        properties: {
          name: 'bli',
          latitude: '2.5',
          longitude: 45,
          categories: ['INVESTOR']
        },
        indexes: [1, 5, 45]
      })).to.eql({name: 'test', index: 105, truc: "15", properties: {
        name: 'bla',
        latitude: '2.5',
        longitude: 45,
        categories: ['COMPANY', 'INVESTOR']
      }})
    });
  });

  describe('Tools.valueExists', () => {
    it('should return true', () => {
      expect(Tools.valueExists([])).to.be.true;
      expect(Tools.valueExists({})).to.be.true;
      expect(Tools.valueExists(1)).to.be.true;
      expect(Tools.valueExists(0)).to.be.true;
      expect(Tools.valueExists('tro')).to.be.true;
    });

    it('should return false', () => {
      expect(Tools.valueExists(undefined)).to.be.false;
      expect(Tools.valueExists(null)).to.be.false;
      expect(Tools.valueExists('')).to.be.false;
      expect(Tools.valueExists(' ')).to.be.false;
    });
  });

  describe('Tools.getPropertyType', () => {
    it('should return number', () => {
      expect(Tools.getPropertyType(
          [
              { value: 1, count: 1 },
              { value: 2, count: 1 },
              { value: 3, count: 1 },
              { value: undefined, count: 1 },
              { value: 4, count: 1 },
              { value: 5, count: 1 },
          ]
      )).to.equal('number');
      expect(Tools.getPropertyType(
          [
              { value: 1, count: 1 },
              { value: 2, count: 1 },
              { value: 3, count: 1 },
              { value: '', count: 1 },
              { value: 4, count: 1 },
              { value: '5', count: 1 },
          ]
      )).to.equal('number');
      expect(Tools.getPropertyType(
          [
              { value: undefined, count: 1 },
          ]
      )).to.equal('number');
      expect(Tools.getPropertyType(
          [
              { value: '', count: 1 },
          ]
      )).to.equal('number');
      expect(Tools.getPropertyType(
          [
              { value: '', count: 1 },
              { value: undefined, count: 1 },
          ]
      )).to.equal('number');
    });
    it('should return string', () => {
      expect(Tools.getPropertyType(
            [
                { value: 'aaa', count: 1 },
                { value: 'bbb', count: 1 },
                { value: 'ccc', count: 1 },
                { value: undefined, count: 1 },
                { value: 'ddd', count: 1 },
                { value: 'eee', count: 1 },
            ]
      )).to.equal('string');
      expect(Tools.getPropertyType(
          [
              { value: 1, count: 1 },
              { value: 2, count: 1 },
              { value: 3, count: 1 },
              { value: '', count: 1 },
              { value: 4, count: 1 },
              { value: 'aaa', count: 1 },
          ]
      )).to.equal('string');
      expect(Tools.getPropertyType(
          [
              { value: undefined, count: 1 },
              { value: ' ', count: 1 },
          ]
      )).to.equal('string');
      expect(Tools.getPropertyType(
          [
              { value: '', count: 1 },
              { value: ' ', count: 1 },
          ]
      )).to.equal('string');
      expect(Tools.getPropertyType(
          [
              { value: '', count: 1 },
              { value: undefined, count: 1 },
              { value: ' ', count: 1 },
          ]
      )).to.equal('string');
    });
  });

  describe('Tools.parseDecimal', () => {
    it('should return the correct parse', () => {
      expect(Tools.parseDecimal('floor', 10, 100000000, 2345678.33333)).to.equal(2345678.3);
      expect(Tools.parseDecimal('ceil', 10, 100000000, 2345678.36333)).to.equal(2345678.4);
      expect(Tools.parseDecimal('floor', 10, 100000000, 2345678.99999)).to.equal(2345679);
      expect(Tools.parseDecimal('ceil', 10, 100000000, 2345678.11111)).to.equal(2345678.1);
    });
  });

  describe('Tools.isValidFilterDate', () => {
    it('should return false', () => {
      expect(Tools.isValidFilterDate(undefined)).to.be.false;
      expect(Tools.isValidFilterDate('')).to.be.false;
      expect(Tools.isValidFilterDate('18-10-05')).to.be.false;
      expect(Tools.isValidFilterDate('2018-1-05')).to.be.false;
      expect(Tools.isValidFilterDate('2018-10-5')).to.be.false;
      expect(Tools.isValidFilterDate('0000-00-00')).to.be.false;
      expect(Tools.isValidFilterDate('2018-01-40')).to.be.false;
      expect(Tools.isValidFilterDate('2018-40-04')).to.be.false;
      expect(Tools.isValidFilterDate('2013-02-29')).to.be.false;
    });
    it('should return true', () => {
      expect(Tools.isValidFilterDate('2018-10-01')).to.be.true;
      expect(Tools.isValidFilterDate('2020-12-01')).to.be.true;
      expect(Tools.isValidFilterDate('2013-02-28')).to.be.true;
    });
  });

    describe('Tools.getFilterFormattedDate', () => {
      it('should return undefined', () => {
          expect(Tools.getFilterFormattedDate(new Date(undefined))).to.be.equal(undefined);
          expect(Tools.getFilterFormattedDate(new Date('aaa'))).to.be.equal(undefined);
      });
      it('should return the correct date', () => {
          expect(Tools.getFilterFormattedDate(
              new Date('2004')
          )).to.be.equal('2004-01-01');
          expect(Tools.getFilterFormattedDate(
              new Date('10-13-2004 12:00:00')
          )).to.be.equal('2004-10-13');
          expect(Tools.getFilterFormattedDate(
              new Date('10/13/2004 12:00:00')
          )).to.be.equal('2004-10-13');
          expect(Tools.getFilterFormattedDate(
              new Date('2004-10-13 12:00:00')
          )).to.be.equal('2004-10-13');
          expect(Tools.getFilterFormattedDate(
              new Date('2004/10/13 12:00:00')
          )).to.be.equal('2004-10-13');
          expect(Tools.getFilterFormattedDate(
              new Date(1097661600000)
          )).to.be.equal('2004-10-13');
          expect(Tools.getFilterFormattedDate(
              new Date(Math.round(1097661600000 / 1000)),
              true
          )).to.be.equal('2004-10-13');
      });
    });

    describe('Tools.getFilterFormattedTimestamp', () => {
        it('should return undefined', () => {
            expect(Tools.getFilterFormattedTimestamp('aaa', 'none')).to.be.equal(undefined);
        });
        it('should return the correct timestamp', () => {
            expect(Tools.getFilterFormattedTimestamp('2004 12:00:00', 'start')).to.be.equal(new Date('2004/01/01 00:00:00').getTime());
            expect(Tools.getFilterFormattedTimestamp('10-13-2004 12:00:00', 'start')).to.be.equal(new Date('2004/10/13 00:00:00').getTime());
            expect(Tools.getFilterFormattedTimestamp('10/13/2004 12:00:00', 'start')).to.be.equal(new Date('2004/10/13 00:00:00').getTime());
            expect(Tools.getFilterFormattedTimestamp('2004-10-13 12:00:00', 'start')).to.be.equal(new Date('2004/10/13 00:00:00').getTime());
            expect(Tools.getFilterFormattedTimestamp('2004/10/13 12:00:00', 'start')).to.be.equal(new Date('2004/10/13 00:00:00').getTime());
            expect(Tools.getFilterFormattedTimestamp('2004-10-13', 'end')).to.be.equal(new Date('2004/10/13 23:59:59:999').getTime());
            expect(Tools.getFilterFormattedTimestamp('2004/10/13', 'end')).to.be.equal(new Date('2004/10/13 23:59:59:999').getTime());
            expect(Tools.getFilterFormattedTimestamp('2004 12:00:00', 'start', true)).to.be.equal(new Date('2004/01/01 00:00:00').getTime() / 1000);
            expect(Tools.getFilterFormattedTimestamp('2004/10/13', 'end', true)).to.be.equal(new Date('2004/10/13 23:59:59').getTime() / 1000);
        });
    });

    describe('Tools.isBright', () => {
        it('should return true', () => {
            expect(Tools.isBright('')).to.be.true;
            expect(Tools.isBright(' ')).to.be.true;
            expect(Tools.isBright(null)).to.be.true;
            expect(Tools.isBright('#')).to.be.true;
            expect(Tools.isBright('a')).to.be.true;
            expect(Tools.isBright('#FFF')).to.be.true;
            expect(Tools.isBright('#FFFFFF')).to.be.true;
            expect(Tools.isBright('#9edae5')).to.be.true;
            expect(Tools.isBright('lightblue')).to.be.true;
            expect(Tools.isBright('AliceBlue')).to.be.true;
            expect(Tools.isBright('rgb(158,218,229)')).to.be.true;
            expect(Tools.isBright('rgb(255, 255, 255)')).to.be.true;
            expect(Tools.isBright('rgb(300,300,300)')).to.be.true;
            expect(Tools.isBright('rgba(255,255,255,1)')).to.be.true;
            expect(Tools.isBright('rgba(255, 255, 255, 0)')).to.be.true;
        });

        it('should return false', () => {
            expect(Tools.isBright('black')).to.be.false;
            expect(Tools.isBright('Black')).to.be.false;
            expect(Tools.isBright('#000000')).to.be.false;
            expect(Tools.isBright('rgb(0, 0, 0)')).to.be.false;
        });
    });

    describe('Tools.sortByStartWith', () => {
        it('should an empty array', () => {
            expect(Tools.sortByStartWith(undefined, undefined)).to.eql([]);
            expect(Tools.sortByStartWith([], undefined)).to.eql([]);
            expect(Tools.sortByStartWith(undefined, 'An')).to.eql([]);
            expect(Tools.sortByStartWith([], 'An')).to.eql([]);
        });
        it('should return a sorted array', () => {
            expect(Tools.sortByStartWith([
                'Tata',
                'Toto',
                'tutu',
                'Tete',
                'Titi'
            ], 'Ca')).to.eql([
                'Tata',
                'Tete',
                'Titi',
                'Toto',
                'tutu'
            ]);
          expect(Tools.sortByStartWith([
                'Tata',
                'Tete',
                'tata',
                'Toto',
                'tati',
                'tutu',
                'Titi',
                'tuTa'
            ], 'Ta')).to.eql([
                'tati',
                'tata',
                'Tata',
                'Tete',
                'Titi',
                'Toto',
                'tuTa',
                'tutu'
            ]);
            expect(Tools.sortByStartWith([
                'Tata',
                'Teteta',
                'tata',
                'TotoTa',
                'tati',
                'tututa',
                'Tititati',
                'tuTa'
            ], 'Ta')).to.eql([
                'tati',
                'tata',
                'Tata',
                'Teteta',
                'Tititati',
                'TotoTa',
                'tuTa',
                'tututa',
            ]);
            expect(Tools.sortByStartWith([
                'Barata',
                'Carlos',
                'Alberto',
                'Joao',
                'daniela',
                'Paulo',
                'Luis',
                'David'
            ], 'Da')).to.eql([
                'David',
                'daniela',
                'Alberto',
                'Barata',
                'Carlos',
                'Joao',
                'Luis',
                'Paulo'
            ]);
        });
    });

    describe('Tools.highlightSearch', () => {
        it('should return the same entry list', () => {
            expect(Tools.highlightSearch(undefined,'a')).to.eql(undefined);
            expect(Tools.highlightSearch([],'a')).to.eql([]);
            expect(Tools.highlightSearch([],'')).to.eql([]);
        });
        it('should return the correct highlight', () => {
            expect(Tools.highlightSearch(
                ['Paris', 'Marrakech'],
                'ari')
            ).to.eql(['P[match]ari[/match]s', 'Marrakech']);
            expect(Tools.highlightSearch(
                ['Marrakech', 'Maroc'],
                'mar')
            ).to.eql(['[match]Mar[/match]rakech', '[match]Mar[/match]oc']);
            expect(Tools.highlightSearch(
                [
                    {key: 'name', value: 'Paris'},
                    {key: 'country', value: 'France'}
                ],
                'ari')
            ).to.eql([
                {key: 'name', value: 'P[match]ari[/match]s'},
                {key: 'country', value: 'France'}
            ]);
            expect(Tools.highlightSearch(
                [
                    {key: 'name', value: 'Marrakech'},
                    {key: 'country', value: 'Maroc'}
                ],
                'mar')
            ).to.eql([
                {key: 'name', value: '[match]Mar[/match]rakech'},
                {key: 'country', value: '[match]Mar[/match]oc'}
            ]);
            expect(Tools.highlightSearch(
                [
                    {key: 'name', value: 'Namibie'},
                    {key: 'capital', value: 'Windhoek'}
                ],
                'nam')
            ).to.eql([
                {key: '[match]nam[/match]e', value: '[match]Nam[/match]ibie'},
                {key: 'capital', value: 'Windhoek'}
            ]);
        });
    });

    describe('Tools.getFilteredList', () => {
      it('should return an empty list', () => {
          expect(Tools.getFilteredList(
              undefined, undefined)
          ).to.eql([]);
          expect(Tools.getFilteredList(
              undefined, 'an')
          ).to.eql([]);
          expect(Tools.getFilteredList(
              [], 'an')
          ).to.eql([]);
          expect(Tools.getFilteredList(
              [{key: 'name', value: 'André'}], undefined)
          ).to.eql([]);
          expect(Tools.getFilteredList(
              [{key: 'name', value: 'André'}], 'on')
          ).to.eql([]);
      });
      it('should return the correctly filtered list', () => {
          expect(Tools.getFilteredList(
              [{key: 'name', value: undefined}], 'name')
          ).to.eql([]);
          expect(Tools.getFilteredList(
              [{key: 'name', value: ''}], 'name')
          ).to.eql([]);
          expect(Tools.getFilteredList(
              [{key: 'name', value: 'André'}], 'name')
          ).to.eql([{key: 'name', value: 'André'}]);
          expect(Tools.getFilteredList(
              [{key: 'name', value: 'André'}, {key: 'name', value: 'Maxime'}], 'name')
          ).to.eql([{key: 'name', value: 'André'}, {key: 'name', value: 'Maxime'}]);
          expect(Tools.getFilteredList(
              [{key: 'name', value: 'André'}, {key: 'name', value: 'Maxime'}], 'max')
          ).to.eql([{key: 'name', value: 'Maxime'}]);
          expect(Tools.getFilteredList(
              [{key: 'Name', value: 'André'}, {key: 'Age', value: 31.5}], 'And')
          ).to.eql([{key: 'Name', value: 'André'}]);
      });
    });

    describe('Tools.getHiddenNeighbors', () => {
      it('should return the number of hidden neighbors', () => {
            let ogma = new Ogma();
            ogma.addGraph({
                nodes: [
                    { id: 0 },
                    { id: 1, data: { statistics: { degree: 10 } } },
                    { id: 2, data: { statistics: { degree: 10 } } },
                    { id: 3, data: { statistics: { degree: 10 } } }
                ],
                edges: [
                    { id: 0, source: 0, target: 1 },
                    { id: 1, source: 1, target: 0 },
                    { id: 2, source: 1, target: 3 },
                    { id: 3, source: 1, target: 2 },
                    { id: 4, source: 2, target: 3 }
                ]
            });
            expect(Tools.getHiddenNeighbors(ogma.getNodes([0]) as NodeList<LkNodeData, LkEdgeData>)).to.eql(0);
            expect(Tools.getHiddenNeighbors(ogma.getNodes([1]) as NodeList<LkNodeData, LkEdgeData>)).to.eql(7);
            expect(Tools.getHiddenNeighbors(ogma.getNodes([2]) as NodeList<LkNodeData, LkEdgeData>)).to.eql(8);
            expect(Tools.getHiddenNeighbors(ogma.getNodes([3]) as NodeList<LkNodeData, LkEdgeData>)).to.eql(8);
            expect(Tools.getHiddenNeighbors(ogma.getNodes() as NodeList<LkNodeData, LkEdgeData>)).to.eql(23);
        });
    });

    describe('Tools.getPropertyValue', () => {
      it('should return the expected value', () => {
        expect(Tools.getPropertyValue('abc')).to.eql('abc');
        expect(Tools.getPropertyValue(123)).to.eql(123);
        expect(Tools.getPropertyValue(true)).to.eql(true);
        expect(Tools.getPropertyValue(false)).to.eql(false);
        expect(Tools.getPropertyValue(
            { type: 'date', value: '2019-07-17T00:00:00.000Z'}
        )).to.eql(1563321600000);
        expect(Tools.getPropertyValue(
            { type: 'datetime', value: '2019-07-17T11:27:00.000Z'}
        )).to.eql(1563362820000);
        expect(Tools.getPropertyValue(
            { type: 'date', value: '2019-07-17T00:00:00.000Z'}, true, true
        )).to.eql('2019-07-17');
        expect(Tools.getPropertyValue(
            { type: 'datetime', value: '2019-07-17T11:27:00.000Z'}, true, true
        )).to.eql('2019-07-17 11:27:00');
        expect(Tools.getPropertyValue(
            { type: {name: PropertyTypeName.STRING}, status: 'invalid', original: 'abc'},
            true
        )).to.eql('abc');
        expect(Tools.getPropertyValue(
            { type: PropertyTypeName.STRING, status: 'conflict', original: 'abc'},
            true
        )).to.eql('abc');
      });
      it('should return undefined', () => {
        expect(Tools.getPropertyValue(undefined)).to.eql(undefined);
        expect(Tools.getPropertyValue(
            { type: PropertyTypeName.STRING, status: 'conflict', original: 'abc'}
        )).to.eql(undefined);
        expect(Tools.getPropertyValue(
            { type: {name: PropertyTypeName.STRING}, status: 'invalid', original: 'abc'}
        )).to.eql(undefined);
        expect(Tools.getPropertyValue(
            { type: PropertyTypeName.STRING, status: 'missing', mandatory: false}
        )).to.eql(undefined);
        expect(Tools.getPropertyValue(
            { type: PropertyTypeName.STRING, status: 'missing', mandatory: false},
            true
        )).to.eql(undefined);
      });
    });

    describe('Tools.timezoneToMilliseconds', () => {
      it('should return the right number based on a timezone', () => {
        expect(Tools.timezoneToMilliseconds('+03:00')).to.eql(1.08e+7);
        expect(Tools.timezoneToMilliseconds('-03:00')).to.eql(-1.08e+7);
        expect(Tools.timezoneToMilliseconds('+00:00')).to.eql(0);
        expect(Tools.timezoneToMilliseconds('+02:20')).to.eql(8.4e+6);
        expect(Tools.timezoneToMilliseconds('-02:20')).to.eql(-8.4e+6);
        expect(Tools.timezoneToMilliseconds('Z')).to.eql(0);
      })
    });
});
