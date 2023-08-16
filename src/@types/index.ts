export interface CommentConfig {
    matcher: string | RegExp;
    prepend?: string;
    append?: string;
}

export interface PluginOptions {
    comments: CommentConfig[];
}