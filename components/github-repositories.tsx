import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import {
  Github,
  Star,
  GitFork,
  Eye,
  TrendingUp,
  Sparkles,
  Code,
  Users,
  Book,
  Calendar,
  ExternalLink,
} from "lucide-react";

// Tipos de datos
interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  bio: string;
  location: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  html_url: string;
}

interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  updated_at: string;
  private: boolean;
  topics: string[];
}

// Componente StatBar memoizado para mejor rendimiento
const StatBar = memo(
  ({
    value,
    maxValue,
    color,
    isVisible,
  }: {
    value: number;
    maxValue: number;
    color: string;
    isVisible: boolean;
  }) => {
    const percentage = useMemo(
      () => (value / maxValue) * 100,
      [value, maxValue]
    );

    return (
      <div className="relative w-full bg-[#1a1a2e]/60 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1200 ease-out shadow-lg transform ${
            isVisible ? "scale-x-100" : "scale-x-0"
          }`}
          style={{
            width: `${percentage}%`,
            background: `linear-gradient(90deg, ${color}40, ${color})`,
            transformOrigin: "left",
          }}
        />
        {/* Glow effect */}
        <div
          className="absolute top-0 left-0 h-full rounded-full opacity-60 blur-sm transition-all duration-1200"
          style={{
            width: `${percentage}%`,
            background: `linear-gradient(90deg, transparent, ${color}80, transparent)`,
          }}
        />
      </div>
    );
  }
);

// Componente de partículas flotantes
const FloatingParticles = memo(() => {
  const [particles, setParticles] = useState<Array<React.CSSProperties>>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 12 }).map(() => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animation: `float ${3 + Math.random() * 4}s linear infinite`,
        animationDelay: `${Math.random() * 2}s`,
      }))
    );
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((style, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-[#1AD6BB] rounded-full opacity-30"
          style={style}
        />
      ))}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.3;
          }
          90% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
});

// Colores para los lenguajes de programación
const getLanguageColor = (language: string) => {
  const colors: Record<string, string> = {
    JavaScript: "#F7DF1E",
    TypeScript: "#3178C6",
    Python: "#3776AB",
    Java: "#ED8B00",
    "C++": "#00599C",
    "C#": "#239120",
    PHP: "#777BB4",
    Ruby: "#CC342D",
    Go: "#00ADD8",
    Rust: "#000000",
    Swift: "#FA7343",
    Kotlin: "#7F52FF",
    HTML: "#E34F26",
    CSS: "#1572B6",
    Vue: "#4FC08D",
    React: "#61DAFB",
    Angular: "#DD0031",
    "Node.js": "#339933",
  };
  return colors[language] || "#1AD6BB";
};

// Componente RepositoryCard memoizado
const RepositoryCard = memo(
  ({
    repo,
    maxStars,
    maxForks,
    isVisible,
    delay,
  }: {
    repo: GitHubRepo;
    maxStars: number;
    maxForks: number;
    isVisible: boolean;
    delay: number;
  }) => {
    const languageColor = getLanguageColor(repo.language);
    const formatNumber = useCallback((num: number) => num.toLocaleString(), []);
    const formatDate = useCallback((dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }, []);

    return (
      <div
        className={`group relative bg-gradient-to-r from-transparent to-[#1a1a2e]/90 rounded-xl p-4 border border-[2px] border-[#848792] hover:border-opacity-40 transition-all duration-500 hover:shadow-lg transform ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
        style={{
          transitionDelay: `${delay}ms`,
          borderColor: languageColor + "40",
          boxShadow: isVisible ? `0 10px 30px ${languageColor}20` : "none",
        }}
      >
        {/* Hover glow effect */}
        <div
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
          style={{
            background: `radial-gradient(circle, ${languageColor}10, transparent)`,
          }}
        />

        <div className="relative z-10">
          {/* Header del repositorio */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <Code className="w-4 h-4 text-[#1AD6BB] flex-shrink-0" />
                <h3 className="text-[#DEE4E4] font-bold text-lg truncate group-hover:text-[#1AD6BB] transition-colors duration-300">
                  {repo.name.toUpperCase()}
                </h3>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[#848792] hover:text-[#1AD6BB]"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              {repo.description && (
                <p className="text-[#848792] text-sm leading-relaxed mb-3 line-clamp-2">
                  {repo.description}
                </p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-[#D3D61A]" />
                <span className="text-[#DEE4E4] text-sm font-semibold">
                  {formatNumber(repo.stargazers_count)}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <GitFork className="w-4 h-4 text-[#CB399E]" />
                <span className="text-[#DEE4E4] text-sm font-semibold">
                  {formatNumber(repo.forks_count)}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {repo.language && (
                <div className="flex items-center space-x-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: languageColor }}
                  />
                  <span className="text-[#848792] text-xs font-medium">
                    {repo.language}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Progress bars */}
          

          {/* Updated date */}
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#848792]/20">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3 text-[#848792]" />
              <span className="text-[#848792] text-xs">
                Actualizado: {formatDate(repo.updated_at)}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

// Hook para usar la API de GitHub
const useGitHubAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWithErrorHandling = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`GitHub API Error: ${response.status}`);
    }
    return response.json();
  };

  const getUserInfo = useCallback(
    async (username: string): Promise<GitHubUser> => {
      const data = await fetchWithErrorHandling(
        `https://api.github.com/users/${username}`
      );
      return data;
    },
    []
  );

  const getUserRepos = useCallback(
    async (username: string): Promise<GitHubRepo[]> => {
      const data = await fetchWithErrorHandling(
        `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`
      );
      return data.filter((repo: GitHubRepo) => !repo.private);
    },
    []
  );

  const getUserData = useCallback(
    async (username: string) => {
      setLoading(true);
      setError(null);

      try {
        const [userInfo, repositories] = await Promise.all([
          getUserInfo(username),
          getUserRepos(username),
        ]);

        return { userInfo, repositories };
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getUserInfo, getUserRepos]
  );

  return {
    loading,
    error,
    getUserInfo,
    getUserRepos,
    getUserData,
  };
};

export function GitHubRepositories() {
  const [userInfo, setUserInfo] = useState<GitHubUser | null>(null);
  const [repositories, setRepositories] = useState<GitHubRepo[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const { loading, error, getUserData } = useGitHubAPI();

  const username = "zelenmun";

  // Calcular valores máximos para las barras de progreso
  const { maxStars, maxForks } = useMemo(() => {
    if (!repositories.length) return { maxStars: 1, maxForks: 1 };

    const maxStars = Math.max(
      ...repositories.map((repo) => repo.stargazers_count),
      1
    );
    const maxForks = Math.max(
      ...repositories.map((repo) => repo.forks_count),
      1
    );

    return { maxStars, maxForks };
  }, [repositories]);

  // Cargar datos al montar el componente
  useEffect(() => {
    const loadData = async () => {
      try {
        const { userInfo, repositories } = await getUserData(username);
        setUserInfo(userInfo);
        setRepositories(repositories);

        // Activar animaciones
        setTimeout(() => setIsVisible(true), 100);
      } catch (err) {
        console.error("Error loading GitHub data:", err);
      }
    };

    loadData();
  }, [getUserData, username]);

  if (loading && !userInfo) {
    return (
      <div className="max-w-md mx-auto p-6">
        <div className="relative bg-gradient-to-br from-[#29293f]/90 via-[#29293f]/70 to-[#1a1a2e]/90 rounded-2xl p-6 border-2 border-[#848792]/20 shadow-2xl backdrop-blur-sm">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#1AD6BB]/30 border-t-[#1AD6BB] rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#DEE4E4] text-lg">Cargando repositorios...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      
      <div className="w-full mx-auto p-6">
        <div className="relative rounded-2xl p-6 border-2 border-[#CB399E]/50 shadow-2xl backdrop-blur-sm">
          <div className="text-center">
            <p className="text-[#CB399E] text-lg mb-2">
              Error al cargar repositorios
            </p>
            <p className="text-[#848792] text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 flex flex-col lg:flex-row lg:pb-0">
      <div className="w-full order-4 lg:order-none">
        <div className="relative rounded-2xl p-6 border-2 border-[#848792]/20 shadow-2xl backdrop-blur-sm overflow-hidden">
          {/* Background animated gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#CB399E]/5 via-transparent to-[#1AD6BB]/5 animate-pulse" />

          {/* Floating particles */}
          <FloatingParticles />

          {/* Header */}
          <div
            className={`mb-6 transform transition-all duration-700 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
          >
            <div className="flex items-center space-x-3 mb-2">
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#1AD6BB]/30 to-[#1AD6BB]/10 flex items-center justify-center">
                <Github className="w-5 h-5 text-[#1AD6BB]" />
              </div>
              <div>
                <h2 className="text-[#DEE4E4] text-xl font-bold">
                  Repositorios Públicos
                </h2>
                <p className="text-[#848792] text-sm">
                  {repositories.length} repositorios encontrados
                </p>
              </div>
            </div>
          </div>

          {/* Repositories Container with Scroll - Height of 2 cards */}
          <div
            className="overflow-y-auto space-y-4 pr-2"
            style={{
              height: "300px", // Altura aproximada de 2 tarjetas
              scrollbarWidth: "thin",
              scrollbarColor: "#1AD6BB40 transparent",
            }}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                width: 6px;
              }
              div::-webkit-scrollbar-track {
                background: transparent;
              }
              div::-webkit-scrollbar-thumb {
                background: #1ad6bb40;
                border-radius: 3px;
              }
              div::-webkit-scrollbar-thumb:hover {
                background: #1ad6bb60;
              }
            `}</style>

            {repositories.map((repo, index) => (
              <RepositoryCard
                key={repo.id}
                repo={repo}
                maxStars={maxStars}
                maxForks={maxForks}
                isVisible={isVisible}
                delay={index * 100}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

StatBar.displayName = "StatBar";
FloatingParticles.displayName = "FloatingParticles";
RepositoryCard.displayName = "RepositoryCard";
