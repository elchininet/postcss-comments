import fs from 'fs';
import postcss from 'postcss';
import postcssComments from '../src';

export const readCSSFile = (): Promise<string> => new Promise((resolve) => {
    fs.readFile(`${__dirname}/input.css`, 'utf8', (error, data): void => {
        if (error) {
            resolve('');
        } else {
            resolve(data);
        }
    });
});

describe('Matchers', () => {

    let input = '';
  
    beforeEach(async (): Promise<void> => {
      input = input || await readCSSFile();
    });

    it('String matchers', () => {
        const rules = [
            {
                ruleMatcher: '.test18::after',
                prepend: 'Comment before test18::after'
            },
            {
                ruleMatcher: '.test2',
                append: 'Comment after .test2'
            },
            {
                ruleMatcher: '.test46',
                prepend: 'Comment inside media-query prepend',
                append: 'Comment inside media-query append'
            }
        ];
        const output = postcss([postcssComments({ rules })]).process(input);
        expect(output.css).toMatchSnapshot();
        expect(output.warnings()).toHaveLength(0);
    });

    it('Regexp matchers', () => {
        const rules = [
            {
                ruleMatcher: /^\.test\d+$/,
                prepend: 'Comment before any class with .test and a number'
            },
            {
                ruleMatcher: /^\.test\w+\d+$/,
                append: 'Comment after any class with .test some letters and a number'
            },
            {
                ruleMatcher: /^\.test[\s\S]+\.test\d+$/,
                prepend: 'Comment before multiple tests class rules',
                append: 'Comment after multiple test class rules'
            }
        ];
        const output = postcss([postcssComments({ rules })]).process(input);
        expect(output.css).toMatchSnapshot();
        expect(output.warnings()).toHaveLength(0);
    });

    it('Array of matchers', () => {
        const rules = [
            {
                ruleMatcher: [
                    /^\.test\d+-\w+$/,
                    '.example35',
                    /html \.test\d+$/
                ],
                prepend: 'Comment before these matchers'
            },
            {
                ruleMatcher: [
                    /^\.test\d+$/,
                    /^#test.+$/
                ],
                prepend: 'Start of a test',
                append: 'End of a test'
            }
        ];
        const output = postcss([postcssComments({ rules })]).process(input);
        expect(output.css).toMatchSnapshot();
        expect(output.warnings()).toHaveLength(0);
    });

    it('Error no comments', () => {
        expect(
            // @ts-ignore
            () => postcss([postcssComments()]).process(input)
        ).toThrowError();
        expect(
            () => postcss([postcssComments({ rules: [] })]).process(input)
        ).toThrowError();
    });
});