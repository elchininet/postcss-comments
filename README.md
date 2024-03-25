# PostCSS Comments
[PostCSS] plugin to prepend and append comments to CSS rules.

[![Deployment Status](https://github.com/elchininet/postcss-comments/actions/workflows/deploy.yaml/badge.svg)](https://github.com/elchininet/postcss-comments/actions/workflows/deploy.yaml)
[![Tests](https://github.com/elchininet/postcss-comments/actions/workflows/test.yaml/badge.svg)](https://github.com/elchininet/postcss-comments/actions/workflows/test.yaml)
[![Coverage Status](https://coveralls.io/repos/github/elchininet/postcss-comments/badge.svg?branch=master)](https://coveralls.io/github/elchininet/postcss-comments?branch=master)
[![npm version](https://badge.fury.io/js/postcss-comments.svg)](https://badge.fury.io/js/postcss-comments)

Description
---

Some [PostCSS] plugins require to add comments to the CSS code to be able to perform their work (e.g. [RTLCSS] or [PostCSS RTLCSS]). But if the CSS code is coming from a third-party library or a CSS-in-JS framework it is impossible to modify the CSS source to add comments. In these cases, `postcss-comments` could be helpful to prepend or append comments to CSS rules selecting them using strings or regular expressions.

Install
---

#### npm

```bash
npm install postcss-comments --save-dev
```

#### yarn

```bash
yarn add postcss-comments -D
```

#### Usage with commonJS

```javascript
const postcss = require('postcss');
const postcssComments = require('postcss-comments');

const result = postcss([
    postcssComments({
        rulesMatchers: [
            /* rulesMatchers */
        ]
    })
]).process(cssInput);

const commentedCSS = result.css;
```

#### Usage with ES6 modules

```javascript
import postcss from 'postcss';
import postcssComments from 'postcss-comments';

const result = postcss([
    postcssComments({
        rulesMatchers: [
            /* rulesMatchers */
        ]
    })
]).process(cssInput);

const commentedCSS = result.css;
```

#### Usage in Webpack with postcss-loader

```javascript
rules: [
    {
        test: /\.css$/,
        use: [
            { loader: 'style-loader' },
            { loader: 'css-loader' },
            {
                loader: 'postcss-loader',
                options: {
                    postcssOptions: {
                        plugins: [
                            postcssComments({
                                rulesMatchers: [
                                    /* rulesMatchers */
                                ]
                            })
                        ]
                    }
                }
            }
        ]
    }
]
```

Rules Matchers
---

`rulesMatchers` consist on an array of objects, each one describing one matcher.

```javascript
{
    matcher: string | RegExp | (string | RegExp)[];
    prepend?: string;
    append?: string;
}
```
Examples
---

#### Input

```css
.test1, .test2 {
    color: #666;
    padding-right: 20px;
    width: 100%;
}

.link {
    color: red;
}

.link:hover {
    color: red;
}

.link:visited {
    color: red;
}

.test-class {
    text-align: left;
    height: 100px;
}
```

### Using string rule matchers

String matchers will match a rule if the entire selector of the rule matches exactly with the string.

```javascript
postcssComments({
    rulesMatchers: [
       {
            matcher: ['.link', '.test-class'],
            prepend: 'Using an array of string matchers'
       },
       {
            matcher: '.link:visited',
            append: 'Using a unique string matcher'
       }
    ]
})
```

#### Output

```css
.test1, .test2 {
    color: #666;
    padding-right: 20px;
    width: 100%;
}

/* Using an array of string matchers */
.link {
    color: red;
}

.link:hover {
    color: red;
}

.link:visited {
    color: red;
}
/* Using a unique string matcher */

/* Using an array of string matchers */
.test-class {
    text-align: left;
    height: 100px;
}
```

### Using RegExp rule matchers

Regular Expressions matchers are more flexible. They allow one to match rules without specifying exactly the string of their selectors using a Regular Expression pattern instead.

```javascript
postcssComments({
    rulesMatchers: [
       {
            matcher: [/^\.test\d+/, /^\.link:\w+$/],
            prepend: 'Using an array of RegExp matchers'
       },
       {
            matcher: /\.test-\w+$/,
            append: 'Using a single regular expression'
       }
    ]
})
```

#### Output

```css
/* Using an array of RegExp matchers */
.test1, .test2 {
    color: #666;
    padding-right: 20px;
    width: 100%;
}

.link {
    color: red;
}

/* Using an array of RegExp matchers */
.link:hover {
    color: red;
}

/* Using an array of RegExp matchers */
.link:visited {
    color: red;
}

.test-class {
    text-align: left;
    height: 100px;
}
/* Using a single regular expression */
```

Notes
---

1. String matchers and Regular Expression matchers can be mixed in the same macther array.
1. Only the first matcher is used. If a rule matches a matcher, the `append` or `prepend` comments are inserted and it doesn‘t continue checking the next matchers on the array.
2. Regular Expressions matchers cannot have [flags], if you set flags, they will be ignored.
3. If you do not use PostCSS, add it according to [official docs]
and set this plugin in settings.

[PostCSS]: https://github.com/postcss/postcss
[RTLCSS]: https://rtlcss.com/learn/usage-guide/control-directives/
[PostCSS RTLCSS]: https://github.com/elchininet/postcss-rtlcss#control-directives
[flags]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions#advanced_searching_with_flags
[official docs]: https://github.com/postcss/postcss#usage
