import {expect} from 'chai';
import 'mocha';
import {CurrencyFormat, ICurrencyOptions} from '@linkurious/rest-client';

import {Tools} from '../../src/tools/tools';

describe('Tools', () => {
  describe('Tools.formatCurrencyValue', () => {
    describe('Format: "[Symbol] #,###.##"', () => {
      const options: ICurrencyOptions = {
        type: 'currency',
        format: CurrencyFormat.SYMBOL_COMMAS_DOT,
        symbol: '$'
      };

      it('should format NaN', () => {
        const result = Tools.formatCurrencyValue(NaN, options);
        expect(result).eql('$ NaN');
      });
      it('should format a single digit value', () => {
        const result = Tools.formatCurrencyValue(9, options);
        expect(result).eql('$ 9.00');
      });
      it('should format a 3 digit value', () => {
        const result = Tools.formatCurrencyValue(123, options);
        expect(result).eql('$ 123.00');
      });
      it('should format a 4 digit value', () => {
        const result = Tools.formatCurrencyValue(4123, options);
        expect(result).eql('$ 4,123.00');
      });
      it('should format a 7 digit value', () => {
        const result = Tools.formatCurrencyValue(7456123, options);
        expect(result).eql('$ 7,456,123.00');
      });
      it('should format a negative value', () => {
        const result = Tools.formatCurrencyValue(-7456123, options);
        expect(result).eql('- $ 7,456,123.00');
      });
      it('should format a decimal value', () => {
        const result = Tools.formatCurrencyValue(7456123.89, options);
        expect(result).eql('$ 7,456,123.89');
      });
      it('should format a decimal value rounding up', () => {
        const result = Tools.formatCurrencyValue(7456123.897, options);
        expect(result).eql('$ 7,456,123.90');
      });
      it('should format a negative decimal value rounding down', () => {
        const result = Tools.formatCurrencyValue(-7456123.892, options);
        expect(result).eql('- $ 7,456,123.89');
      });
      it('should format min safe integer', () => {
        const result = Tools.formatCurrencyValue(Number.MIN_SAFE_INTEGER, options);
        expect(result).eql('- $ 9,007,199,254,740,991.00');
      });
      it('should format max safe integer', () => {
        const result = Tools.formatCurrencyValue(Number.MAX_SAFE_INTEGER, options);
        expect(result).eql('$ 9,007,199,254,740,991.00');
      });
      it('should return formatted value without symbol', () => {
        const result = Tools.formatCurrencyValue(Number.MAX_SAFE_INTEGER, {
          ...options,
          symbol: undefined
        });
        expect(result).eql('9,007,199,254,740,991.00');
      });
      it('should format a signed value without a symbol', () => {
        const result = Tools.formatCurrencyValue(-7456123, {
          ...options,
          symbol: undefined
        });
        expect(result).eql('- 7,456,123.00');
      });
    });

    describe('Format: "[Symbol] #,###"', () => {
      const options: ICurrencyOptions = {
        type: 'currency',
        format: CurrencyFormat.SYMBOL_COMMAS,
        symbol: '$'
      };

      it('should format NaN', () => {
        const result = Tools.formatCurrencyValue(NaN, options);
        expect(result).eql('$ NaN');
      });
      it('should format a single digit value', () => {
        const result = Tools.formatCurrencyValue(9, options);
        expect(result).eql('$ 9');
      });
      it('should format a 3 digit value', () => {
        const result = Tools.formatCurrencyValue(123, options);
        expect(result).eql('$ 123');
      });
      it('should format a 4 digit value', () => {
        const result = Tools.formatCurrencyValue(4123, options);
        expect(result).eql('$ 4,123');
      });
      it('should format a 7 digit value', () => {
        const result = Tools.formatCurrencyValue(7456123, options);
        expect(result).eql('$ 7,456,123');
      });
      it('should format a negative value', () => {
        const result = Tools.formatCurrencyValue(-7456123, options);
        expect(result).eql('- $ 7,456,123');
      });
      it('should format a decimal value', () => {
        const result = Tools.formatCurrencyValue(7456123.89, options);
        expect(result).eql('$ 7,456,124');
      });
      it('should format a decimal value rounding up', () => {
        const result = Tools.formatCurrencyValue(7456123.897, options);
        expect(result).eql('$ 7,456,124');
      });
      it('should format a decimal value rounding down', () => {
        const result = Tools.formatCurrencyValue(7456123.197, options);
        expect(result).eql('$ 7,456,123');
      });
      it('should format a negative decimal value rounding up', () => {
        const result = Tools.formatCurrencyValue(-7456123.892, options);
        expect(result).eql('- $ 7,456,124');
      });
      it('should format min safe integer', () => {
        const result = Tools.formatCurrencyValue(Number.MIN_SAFE_INTEGER, options);
        expect(result).eql('- $ 9,007,199,254,740,991');
      });
      it('should format max safe integer', () => {
        const result = Tools.formatCurrencyValue(Number.MAX_SAFE_INTEGER, options);
        expect(result).eql('$ 9,007,199,254,740,991');
      });
      it('should return formatted value without symbol', () => {
        const result = Tools.formatCurrencyValue(Number.MAX_SAFE_INTEGER, {
          ...options,
          symbol: undefined
        });
        expect(result).eql('9,007,199,254,740,991');
      });
      it('should format a signed value without a symbol', () => {
        const result = Tools.formatCurrencyValue(-7456123, {
          ...options,
          symbol: undefined
        });
        expect(result).eql('- 7,456,123');
      });
    });

    describe('Format: "#.###,## [Symbol]"', () => {
      const options: ICurrencyOptions = {
        type: 'currency',
        format: CurrencyFormat.DOTS_COMMA_SYMBOL,
        symbol: '$'
      };

      it('should format NaN', () => {
        const result = Tools.formatCurrencyValue(NaN, options);
        expect(result).eql('NaN $');
      });
      it('should format a single digit value', () => {
        const result = Tools.formatCurrencyValue(9, options);
        expect(result).eql('9,00 $');
      });
      it('should format a 3 digit value', () => {
        const result = Tools.formatCurrencyValue(123, options);
        expect(result).eql('123,00 $');
      });
      it('should format a 4 digit value', () => {
        const result = Tools.formatCurrencyValue(4123, options);
        expect(result).eql('4.123,00 $');
      });
      it('should format a 7 digit value', () => {
        const result = Tools.formatCurrencyValue(7456123, options);
        expect(result).eql('7.456.123,00 $');
      });
      it('should format a negative value', () => {
        const result = Tools.formatCurrencyValue(-7456123, options);
        expect(result).eql('- 7.456.123,00 $');
      });
      it('should format a decimal value', () => {
        const result = Tools.formatCurrencyValue(7456123.89, options);
        expect(result).eql('7.456.123,89 $');
      });
      it('should format a decimal value rounding up', () => {
        const result = Tools.formatCurrencyValue(7456123.897, options);
        expect(result).eql('7.456.123,90 $');
      });
      it('should format a negative decimal value rounding down', () => {
        const result = Tools.formatCurrencyValue(-7456123.892, options);
        expect(result).eql('- 7.456.123,89 $');
      });
      it('should format min safe integer', () => {
        const result = Tools.formatCurrencyValue(Number.MIN_SAFE_INTEGER, options);
        expect(result).eql('- 9.007.199.254.740.991,00 $');
      });
      it('should format max safe integer', () => {
        const result = Tools.formatCurrencyValue(Number.MAX_SAFE_INTEGER, options);
        expect(result).eql('9.007.199.254.740.991,00 $');
      });
      it('should return formatted value without symbol', () => {
        const result = Tools.formatCurrencyValue(Number.MAX_SAFE_INTEGER, {
          ...options,
          symbol: undefined
        });
        expect(result).eql('9.007.199.254.740.991,00');
      });
      it('should format a signed value without a symbol', () => {
        const result = Tools.formatCurrencyValue(-7456123, {
          ...options,
          symbol: undefined
        });
        expect(result).eql('- 7.456.123,00');
      });
    });

    describe('Format: "#.### [Symbol]"', () => {
      const options: ICurrencyOptions = {
        type: 'currency',
        format: CurrencyFormat.DOTS_SYMBOL,
        symbol: '$'
      };

      it('should format NaN', () => {
        const result = Tools.formatCurrencyValue(NaN, options);
        expect(result).eql('NaN $');
      });
      it('should format a single digit value', () => {
        const result = Tools.formatCurrencyValue(9, options);
        expect(result).eql('9 $');
      });
      it('should format a 3 digit value', () => {
        const result = Tools.formatCurrencyValue(123, options);
        expect(result).eql('123 $');
      });
      it('should format a 4 digit value', () => {
        const result = Tools.formatCurrencyValue(4123, options);
        expect(result).eql('4.123 $');
      });
      it('should format a 7 digit value', () => {
        const result = Tools.formatCurrencyValue(7456123, options);
        expect(result).eql('7.456.123 $');
      });
      it('should format a negative value', () => {
        const result = Tools.formatCurrencyValue(-7456123, options);
        expect(result).eql('- 7.456.123 $');
      });
      it('should format a decimal value', () => {
        const result = Tools.formatCurrencyValue(7456123.89, options);
        expect(result).eql('7.456.124 $');
      });
      it('should format a decimal value rounding up', () => {
        const result = Tools.formatCurrencyValue(7456123.897, options);
        expect(result).eql('7.456.124 $');
      });
      it('should format a decimal value rounding down', () => {
        const result = Tools.formatCurrencyValue(7456123.197, options);
        expect(result).eql('7.456.123 $');
      });
      it('should format a negative decimal value rounding up', () => {
        const result = Tools.formatCurrencyValue(-7456123.892, options);
        expect(result).eql('- 7.456.124 $');
      });
      it('should format min safe integer', () => {
        const result = Tools.formatCurrencyValue(Number.MIN_SAFE_INTEGER, options);
        expect(result).eql('- 9.007.199.254.740.991 $');
      });
      it('should format max safe integer', () => {
        const result = Tools.formatCurrencyValue(Number.MAX_SAFE_INTEGER, options);
        expect(result).eql('9.007.199.254.740.991 $');
      });
      it('should return formatted value without symbol', () => {
        const result = Tools.formatCurrencyValue(Number.MAX_SAFE_INTEGER, {
          ...options,
          symbol: undefined
        });
        expect(result).eql('9.007.199.254.740.991');
      });
      it('should format a signed value without a symbol', () => {
        const result = Tools.formatCurrencyValue(-7456123, {
          ...options,
          symbol: undefined
        });
        expect(result).eql('- 7.456.123');
      });
    });

    describe('Format: "# ###,## [Symbol]"', () => {
      const options: ICurrencyOptions = {
        type: 'currency',
        format: CurrencyFormat.SPACES_COMMA_SYMBOL,
        symbol: '$'
      };

      it('should format NaN', () => {
        const result = Tools.formatCurrencyValue(NaN, options);
        expect(result).eql('NaN $');
      });
      it('should format a single digit value', () => {
        const result = Tools.formatCurrencyValue(9, options);
        expect(result).eql('9,00 $');
      });
      it('should format a 3 digit value', () => {
        const result = Tools.formatCurrencyValue(123, options);
        expect(result).eql('123,00 $');
      });
      it('should format a 4 digit value', () => {
        const result = Tools.formatCurrencyValue(4123, options);
        expect(result).eql('4 123,00 $');
      });
      it('should format a 7 digit value', () => {
        const result = Tools.formatCurrencyValue(7456123, options);
        expect(result).eql('7 456 123,00 $');
      });
      it('should format a negative value', () => {
        const result = Tools.formatCurrencyValue(-7456123, options);
        expect(result).eql('- 7 456 123,00 $');
      });
      it('should format a decimal value', () => {
        const result = Tools.formatCurrencyValue(7456123.89, options);
        expect(result).eql('7 456 123,89 $');
      });
      it('should format a decimal value rounding up', () => {
        const result = Tools.formatCurrencyValue(7456123.897, options);
        expect(result).eql('7 456 123,90 $');
      });
      it('should format a negative decimal value rounding down', () => {
        const result = Tools.formatCurrencyValue(-7456123.892, options);
        expect(result).eql('- 7 456 123,89 $');
      });
      it('should format min safe integer', () => {
        const result = Tools.formatCurrencyValue(Number.MIN_SAFE_INTEGER, options);
        expect(result).eql('- 9 007 199 254 740 991,00 $');
      });
      it('should format max safe integer', () => {
        const result = Tools.formatCurrencyValue(Number.MAX_SAFE_INTEGER, options);
        expect(result).eql('9 007 199 254 740 991,00 $');
      });
      it('should return formatted value without symbol', () => {
        const result = Tools.formatCurrencyValue(Number.MAX_SAFE_INTEGER, {
          ...options,
          symbol: undefined
        });
        expect(result).eql('9 007 199 254 740 991,00');
      });
      it('should format a signed value without a symbol', () => {
        const result = Tools.formatCurrencyValue(-7456123, {
          ...options,
          symbol: undefined
        });
        expect(result).eql('- 7 456 123,00');
      });
    });

    describe('Format: "# ### [Symbol]"', () => {
      const options: ICurrencyOptions = {
        type: 'currency',
        format: CurrencyFormat.SPACES_SYMBOL,
        symbol: '$'
      };

      it('should format NaN', () => {
        const result = Tools.formatCurrencyValue(NaN, options);
        expect(result).eql('NaN $');
      });
      it('should format a single digit value', () => {
        const result = Tools.formatCurrencyValue(9, options);
        expect(result).eql('9 $');
      });
      it('should format a 3 digit value', () => {
        const result = Tools.formatCurrencyValue(123, options);
        expect(result).eql('123 $');
      });
      it('should format a 4 digit value', () => {
        const result = Tools.formatCurrencyValue(4123, options);
        expect(result).eql('4 123 $');
      });
      it('should format a 7 digit value', () => {
        const result = Tools.formatCurrencyValue(7456123, options);
        expect(result).eql('7 456 123 $');
      });
      it('should format a negative value', () => {
        const result = Tools.formatCurrencyValue(-7456123, options);
        expect(result).eql('- 7 456 123 $');
      });
      it('should format a decimal value', () => {
        const result = Tools.formatCurrencyValue(7456123.89, options);
        expect(result).eql('7 456 124 $');
      });
      it('should format a decimal value rounding up', () => {
        const result = Tools.formatCurrencyValue(7456123.897, options);
        expect(result).eql('7 456 124 $');
      });
      it('should format a decimal value rounding down', () => {
        const result = Tools.formatCurrencyValue(7456123.197, options);
        expect(result).eql('7 456 123 $');
      });
      it('should format min safe integer', () => {
        const result = Tools.formatCurrencyValue(Number.MIN_SAFE_INTEGER, options);
        expect(result).eql('- 9 007 199 254 740 991 $');
      });
      it('should format max safe integer', () => {
        const result = Tools.formatCurrencyValue(Number.MAX_SAFE_INTEGER, options);
        expect(result).eql('9 007 199 254 740 991 $');
      });
      it('should return formatted value without symbol', () => {
        const result = Tools.formatCurrencyValue(Number.MAX_SAFE_INTEGER, {
          ...options,
          symbol: undefined
        });
        expect(result).eql('9 007 199 254 740 991');
      });
      it('should format a signed value without a symbol', () => {
        const result = Tools.formatCurrencyValue(-7456123, {
          ...options,
          symbol: undefined
        });
        expect(result).eql('- 7 456 123');
      });
    });
  });
});
