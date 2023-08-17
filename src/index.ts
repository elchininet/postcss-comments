import { Root, Rule, Plugin } from 'postcss';
import { PluginOptions } from '@types';
import { getMasterRegExp, insertComments } from 'utilities';

function postcssRTLCSS (options: PluginOptions): Plugin {

    const { comments } = options;

    if (!comments || !comments.length) {
        throw new Error('postcss-comment requires a comments option!');
    }

    const masterRegExp = getMasterRegExp(comments);

    return ({
        postcssPlugin: 'postcss-comments',
        Once(css: Root): void {
            css.walkRules((rule: Rule): void => {
                if (masterRegExp.test(rule.selector)) {
                    insertComments(rule, comments);
                }
            });
        }
    });
}

postcssRTLCSS.postcss = true;

export default postcssRTLCSS;