export interface Github {
  access_token?: string;
  scope?: string;
  token_type?: string;
  user?: {
    avatar_url?: string;
    bio?: string;
    created_at?: string;
    email?: string;
    html_url?: string;
    login?: string;
    name?: string;
    type?: string;
    updated_at?: string;
    url?: string;
  }
}
