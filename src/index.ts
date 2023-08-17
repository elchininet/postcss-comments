import { Root, Rule, Plugin } from 'postcss';
import { PluginOptions } from '@types';
import { getMasterRegExp, insertComments } from 'utilities';

function postcssRTLCSS (options: PluginOptions): Plugin {

    const { rulesMatchers } = options;

    if (!rulesMatchers || !rulesMatchers.length) {
        throw new Error('postcss-comment requires a rules option!');
    }

    const masterRegExp = getMasterRegExp(rulesMatchers);

    return ({
        postcssPlugin: 'postcss-comments',
        Once(css: Root): void {
            css.walkRules((rule: Rule): void => {
                if (masterRegExp.test(rule.selector)) {
                    insertComments(rule, rulesMatchers);
                }
            });
        }
    });
}

postcssRTLCSS.postcss = true;

export default postcssRTLCSS;