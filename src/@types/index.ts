export type Matcher = string | RegExp | (string | RegExp)[];

export interface RuleCommentConfig {
    matcher: Matcher;
    prepend?: string;
    append?: string;
}

export interface PluginOptions {
    rulesMatchers: RuleCommentConfig[];
}