// types/github.ts - Tipos adicionales para GitHub API

export interface GitHubApiError {
  message: string;
  documentation_url?: string;
  errors?: Array<{
    resource: string;
    field: string;
    code: string;
  }>;
}

export interface GitHubSearchResult<T> {
  total_count: number;
  incomplete_results: boolean;
  items: T[];
}

export interface GitHubRepoSearchResult extends GitHubSearchResult<GitHubRepo> {}

export interface GitHubUserSearchResult extends GitHubSearchResult<GitHubUser> {}

export interface GitHubRateLimit {
  limit: number;
  remaining: number;
  reset: number;
  used: number;
}

export interface GitHubApiResponse {
  rate_limit?: GitHubRateLimit;
}

// Extender los tipos base para incluir más propiedades
export interface ExtendedGitHubRepo extends GitHubRepo {
  topics?: string[];
  license?: {
    key: string;
    name: string;
    spdx_id: string;
  } | null;
  default_branch?: string;
  open_issues_count?: number;
  watchers_count?: number;
  size?: number;
  archived?: boolean;
  disabled?: boolean;
  pushed_at?: string;
}

export interface GitHubBranch {
  name: string;
  commit: {
    sha: string;
    url: string;
  };
  protected: boolean;
}

export interface GitHubRelease {
  id: number;
  tag_name: string;
  name: string;
  body: string;
  draft: boolean;
  prerelease: boolean;
  created_at: string;
  published_at: string;
  author: {
    login: string;
    avatar_url: string;
  };
  assets: Array<{
    id: number;
    name: string;
    size: number;
    download_count: number;
    browser_download_url: string;
  }>;
}

// Para el gráfico de contribuciones (API no oficial)
export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
  firstDay: string;
}

export interface ContributionCalendar {
  totalContributions: number;
  weeks: ContributionWeek[];
}

// Para estadísticas de commits
export interface CommitActivity {
  days: number[];
  total: number;
  week: number;
}