export type Matcher = string | RegExp | (string | RegExp)[];

export interface RuleCommentConfig {
    ruleMatcher: Matcher;
    prepend?: string;
    append?: string;
}

export interface PluginOptions {
    rules: RuleCommentConfig[];
}