import { Root, Rule, Plugin } from 'postcss';
import { PluginOptions } from '@types';
import { getMasterRegExp, insertComments } from 'utilities';

function postcssRTLCSS (options: PluginOptions): Plugin {

    const { rules } = options;

    if (!rules || !rules.length) {
        throw new Error('postcss-comment requires a rules option!');
    }

    const masterRegExp = getMasterRegExp(rules);

    return ({
        postcssPlugin: 'postcss-comments',
        Once(css: Root): void {
            css.walkRules((rule: Rule): void => {
                if (masterRegExp.test(rule.selector)) {
                    insertComments(rule, rules);
                }
            });
        }
    });
}

postcssRTLCSS.postcss = true;

export default postcssRTLCSS;