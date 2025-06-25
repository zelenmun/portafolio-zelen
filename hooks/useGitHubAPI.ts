import { useState } from 'react';

// Tipos para la API de GitHub
interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  location: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  private: boolean;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  languages_url: string;
  updated_at: string;
  created_at: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

interface GitHubLanguages {
  [language: string]: number;
}

interface GitHubContributor {
  login: string;
  contributions: number;
  avatar_url: string;
}

interface GitHubCommit {
  sha: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
  };
  author: {
    login: string;
    avatar_url: string;
  } | null;
}

const useGitHubAPI = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const githubToken = process.env.REACT_APP_GITHUB_TOKEN;
  
  const makeRequest = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
      ...(githubToken && { 'Authorization': `token ${githubToken}` }),
      ...options.headers
    };

    try {
      const response = await fetch(url, { ...options, headers });
      
      if (!response.ok) {
        throw new Error(`GitHub API Error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    }
  };

  // Obtener repositorios de un usuario
  const getUserRepos = async (username: string): Promise<GitHubRepo[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const repos = await makeRequest<GitHubRepo[]>(`https://api.github.com/users/${username}/repos`);
      setLoading(false);
      return repos;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  // Obtener lenguajes de un repositorio
  const getRepoLanguages = async (owner: string, repo: string): Promise<GitHubLanguages> => {
    try {
      return await makeRequest<GitHubLanguages>(`https://api.github.com/repos/${owner}/${repo}/languages`);
    } catch (err) {
      throw err;
    }
  };

  // Obtener estadísticas de contribuciones
  const getRepoStats = async (owner: string, repo: string): Promise<GitHubContributor[]> => {
    try {
      return await makeRequest<GitHubContributor[]>(`https://api.github.com/repos/${owner}/${repo}/stats/contributors`);
    } catch (err) {
      throw err;
    }
  };

  // Obtener commits de un repositorio
  const getRepoCommits = async (owner: string, repo: string, since?: string): Promise<GitHubCommit[]> => {
    let url = `https://api.github.com/repos/${owner}/${repo}/commits`;
    if (since) {
      url += `?since=${since}`;
    }
    
    try {
      return await makeRequest<GitHubCommit[]>(url);
    } catch (err) {
      throw err;
    }
  };

  // Obtener información del usuario
  const getUserInfo = async (username: string): Promise<GitHubUser> => {
    setLoading(true);
    setError(null);
    
    try {
      const user = await makeRequest<GitHubUser>(`https://api.github.com/users/${username}`);
      setLoading(false);
      return user;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  return {
    loading,
    error,
    getUserRepos,
    getRepoLanguages,
    getRepoStats,
    getRepoCommits,
    getUserInfo
  };
};

export default useGitHubAPI;
export type { GitHubUser, GitHubRepo, GitHubLanguages, GitHubContributor, GitHubCommit };