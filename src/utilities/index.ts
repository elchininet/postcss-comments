import { Rule, Comment } from 'postcss';
import { CommentConfig } from '@types';

export const getMasterRegExp = (comments: CommentConfig[]): RegExp => {
    const regExpStrings = comments.map((config: CommentConfig): string => {
        const { matcher } = config;
        return typeof matcher === 'string'
            ? matcher
            : matcher.toString().slice(1, -1);
    });
    return new RegExp(regExpStrings.join('|'));
};

const cleanCommentBefore = (comment: Comment): void => {
    comment.raws.before = comment.raws.before.replace(/\n+/, '\n');
};

const cleanRuleBefore = (rule: Rule): void => {
    /* in some frameworks like Tailwind, rules could not have before in raws */
    /* istanbul ignore next */
    rule.raws.before = (rule.raws?.before || '\n').replace(/\n+/, '\n');
};

export const insertComments = (rule: Rule, comments: CommentConfig[]): void => {
    comments.some((comment: CommentConfig) => {
        const { matcher, append, prepend } = comment;
        const selector = rule.selector.trim();
        const match = (
            (
                typeof matcher === 'string' &&
                matcher === selector
            ) ||
            (
                matcher instanceof RegExp &&
                matcher.test(selector)
            )
        );
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