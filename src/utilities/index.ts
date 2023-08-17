import { Rule, Comment } from 'postcss';
import { RuleCommentConfig, Matcher } from '@types';

const REGEXP_CHARS = /[.?*+^$[\]\\(){}|-]/g;

const getRegExpString = (ruleMatcher: Matcher): string => {
    if (typeof ruleMatcher === 'string') {
        return ruleMatcher.replace(REGEXP_CHARS, '\\$&');
    }
    if (ruleMatcher instanceof RegExp) {
        return ruleMatcher.toString().slice(1, -1);
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

const matchSelector = (selector: string, ruleMatcher: Matcher): boolean => {
    if (typeof ruleMatcher === 'string') {
        return ruleMatcher === selector;
    }
    if (ruleMatcher instanceof RegExp) {
        return ruleMatcher.test(selector);
    }
    return ruleMatcher.some((matcher: string | RegExp): boolean => {
        return matchSelector(selector, matcher);
    });
};

export const getMasterRegExp = (rules: RuleCommentConfig[]): RegExp => {
    const regExpStrings = rules.map((config: RuleCommentConfig): string => {
        const { ruleMatcher } = config;
        return getRegExpString(ruleMatcher);
    });
    return new RegExp(regExpStrings.join('|'));
};

export const insertComments = (rule: Rule, rules: RuleCommentConfig[]): void => {
    rules.some((ruleCommentConfig: RuleCommentConfig) => {
        const { ruleMatcher, append, prepend } = ruleCommentConfig;
        const selector = rule.selector.trim();
        const match = matchSelector(selector, ruleMatcher);
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