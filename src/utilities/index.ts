import { Rule, Comment } from 'postcss';
import { CommentConfig } from '@types';

export const getMasterRegExp = (comments: CommentConfig[]): RegExp => {
    const regExpStrings = comments.map((config: CommentConfig): string => {
        const { matcher } = config;
        return matcher.toString();
    });
    return new RegExp(regExpStrings.join('|'));
};

export const insertComments = (rule: Rule, comments: CommentConfig[]): void => {
    comments.some((comment: CommentConfig) => {
        const { matcher, append, prepend } = comment;
        const selector = rule.selector;
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
                rule.prepend(node);
            }
            if (append) {
                const node = new Comment({
                    text: append
                });
                rule.append(node);
            }
            return true;
        }
        return false;
    });
};