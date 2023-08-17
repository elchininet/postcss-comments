import { Rule, Comment } from 'postcss';
import { RuleCommentConfig, Matcher } from '@types';

const REGEXP_CHARS = /[.?*+^$[\]\\(){}|-]/g;
const REGEXP_STRING = /\/(.*)\/(?:\w+)?/;

const getRegExpString = (ruleMatcher: Matcher): string => {
    if (typeof ruleMatcher === 'string') {
        return ruleMatcher.replace(REGEXP_CHARS, '\\$&');
    }
    if (ruleMatcher instanceof RegExp) {
        return ruleMatcher.toString().replace(REGEXP_STRING, '$1');
    }
    ruleMatcher.map((matcher: string | RegExp): string => {
        return getRegExpString(matcher);
    }).join('|');
};

const cleanCommentBefore = (comment: Comment): void => {
    comment.raws.before = comment.raws.before.replace(/\n+/, '\n');
};

const cleanRuleBefore = (rule: Rule): void => {
    /* in some frameworks like Tailwind, rules could not have before in raws */
    /* istanbul ignore next */
    rule.raws.before = (rule.raws?.before || '\n').replace(/\n+/, '\n');
};

const matchSelector = (selector: string, matcher: Matcher): boolean => {
    if (typeof matcher === 'string') {
        return matcher === selector;
    }
    if (matcher instanceof RegExp) {
        return matcher.test(selector);
    }
    return matcher.some((matcher: string | RegExp): boolean => {
        return matchSelector(selector, matcher);
    });
};

export const getMasterRegExp = (rulesMatchers: RuleCommentConfig[]): RegExp => {
    const regExpStrings = rulesMatchers.map((config: RuleCommentConfig): string => {
        const { matcher } = config;
        return getRegExpString(matcher);
    });
    return new RegExp(regExpStrings.join('|'));
};

export const insertComments = (rule: Rule, rulesMatchers: RuleCommentConfig[]): void => {
    rulesMatchers.some((ruleCommentConfig: RuleCommentConfig) => {
        const { matcher, append, prepend } = ruleCommentConfig;
        const selector = rule.selector.trim();
        const match = matchSelector(selector, matcher);
        if (match) {
            if (prepend) {
                const node = new Comment({
                    text: prepend
                });
                rule.before(node);
                cleanRuleBefore(rule);
            }
            if (append) {
                const node = new Comment({
                    text: append
                });
                rule.after(node);
                cleanCommentBefore(node);
            }
            return true;
        }
        return false;
    });
};