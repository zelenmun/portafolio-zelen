import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { Github, Star, GitFork, Eye, TrendingUp, Sparkles, Code, Users, Book } from 'lucide-react';

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
}

// Componente StatBar memoizado para mejor rendimiento
const StatBar = memo(({ value, maxValue, color, isVisible }: { 
  value: number, 
  maxValue: number, 
  color: string,
  isVisible: boolean 
}) => {
  const percentage = useMemo(() => (value / maxValue) * 100, [value, maxValue])
  
  return (
    <div className="relative w-full bg-[#1a1a2e]/60 rounded-full h-2 overflow-hidden">
      <div 
        className={`h-full rounded-full transition-all duration-1200 ease-out shadow-lg transform ${
          isVisible ? 'scale-x-100' : 'scale-x-0'
        }`}
        style={{ 
          width: `${percentage}%`,
          background: `linear-gradient(90deg, ${color}40, ${color})`,
          transformOrigin: 'left'
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
  )
})

// Componente de partículas flotantes
const FloatingParticles = memo(() => {
  const [particles, setParticles] = useState<Array<React.CSSProperties>>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 12 }).map(() => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animation: `float ${3 + Math.random() * 4}s linear infinite`,
        animationDelay: `${Math.random() * 2}s`
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
          0% { transform: translateY(0px) rotate(0deg); opacity: 0; }
          10% { opacity: 0.3; }
          90% { opacity: 0.3; }
          100% { transform: translateY(-20px) rotate(180deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
});

// Componente StatCard memoizado
const StatCard = memo(({ 
  icon: Icon, 
  label, 
  sublabel, 
  value, 
  maxValue, 
  color, 
  bgColor, 
  isVisible,
  delay 
}: {
  icon: any,
  label: string,
  sublabel: string,
  value: number,
  maxValue: number,
  color: string,
  bgColor: string,
  isVisible: boolean,
  delay: number
}) => {
  const formatNumber = useCallback((num: number) => num.toLocaleString(), [])
  
  return (
    <div 
      className={`group relative bg-gradient-to-r ${bgColor} rounded-xl p-4 border border-opacity-20 hover:border-opacity-40 transition-all duration-500 hover:shadow-lg transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
      style={{ 
        transitionDelay: `${delay}ms`,
        borderColor: color,
        boxShadow: isVisible ? `0 10px 30px ${color}20` : 'none'
      }}
    >
      {/* Hover glow effect */}
      <div 
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
        style={{ background: `radial-gradient(circle, ${color}10, transparent)` }}
      />
      
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center space-x-3">
          <div 
            className="relative w-10 h-10 rounded-xl flex items-center justify-center shadow-inner group-hover:shadow-lg transition-all duration-300 overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${color}30, ${color}10)` }}
          >
            <Icon className={`w-5 h-5 group-hover:scale-110 transition-transform duration-300`} style={{ color }} />
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          </div>
          <div>
            <span className="text-[#DEE4E4] text-sm font-bold tracking-wide">{label}</span>
            <div className="text-xs text-[#848792] opacity-80">{sublabel}</div>
          </div>
        </div>
        <div className="text-right">
          <span 
            className="font-bold text-xl tabular-nums transition-all duration-300 group-hover:scale-105"
            style={{ color }}
          >
            {formatNumber(value)}
          </span>
          {/* Pulse effect on value */}
          <div 
            className="absolute right-0 top-0 w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 animate-ping"
            style={{ backgroundColor: color }}
          />
        </div>
      </div>
      <StatBar value={value} maxValue={maxValue} color={color} isVisible={isVisible} />
    </div>
  )
})

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

  const getUserInfo = useCallback(async (username: string): Promise<GitHubUser> => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWithErrorHandling(`https://api.github.com/users/${username}`);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserRepos = useCallback(async (username: string): Promise<GitHubRepo[]> => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWithErrorHandling(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, getUserInfo, getUserRepos };
};

export function GitHubProfile() {
  const [userInfo, setUserInfo] = useState<GitHubUser | null>(null);
  const [repositories, setRepositories] = useState<GitHubRepo[]>([]);
  const [animatedStats, setAnimatedStats] = useState({ 
    repos: 0, 
    stars: 0, 
    followers: 0 
  });
  const [showSparkles, setShowSparkles] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [pulseEffect, setPulseEffect] = useState(false);
  const { loading, error, getUserInfo, getUserRepos } = useGitHubAPI();

  const username = 'zelenmun';

  // Calcular estadísticas
  const stats = useMemo(() => {
    if (!userInfo || !repositories.length) return { repos: 0, stars: 0, followers: 0 };

    const totalStars = repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    
    return {
      repos: userInfo.public_repos,
      stars: totalStars,
      followers: userInfo.followers
    };
  }, [userInfo, repositories]);

  const totalPower = useMemo(() => 
    animatedStats.repos + animatedStats.stars + animatedStats.followers,
    [animatedStats]
  );

  const formatNumber = useCallback((num: number) => num.toLocaleString(), []);

  // Cargar datos al montar el componente
  useEffect(() => {
    const loadData = async () => {
      try {
        const user = await getUserInfo(username);
        setUserInfo(user);

        const repos = await getUserRepos(username);
        setRepositories(repos);

        // Activar animaciones
        setTimeout(() => setIsVisible(true), 100);
      } catch (err) {
        console.error('Error loading GitHub data:', err);
      }
    };

    loadData();
  }, [getUserInfo, getUserRepos, username]);

  // Animación de entrada mejorada
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Animación de stats con easing personalizado
  useEffect(() => {
    if (!isVisible || !stats.repos) return;

    const duration = 2000;
    const steps = 80;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      // Easing function más suave
      const easeOut = 1 - Math.pow(1 - progress, 4);

      setAnimatedStats({
        repos: Math.floor(stats.repos * easeOut),
        stars: Math.floor(stats.stars * easeOut),
        followers: Math.floor(stats.followers * easeOut),
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setShowSparkles(true);
        setPulseEffect(true);
        
        // Auto-hide sparkles
        setTimeout(() => {
          setShowSparkles(false);
          setPulseEffect(false);
        }, 3000);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isVisible, stats]);

  const handleRefresh = useCallback(() => {
    setAnimatedStats({ repos: 0, stars: 0, followers: 0 });
    setShowSparkles(false);
    setPulseEffect(false);
    
    setTimeout(() => {
      setAnimatedStats({
        repos: stats.repos,
        stars: stats.stars,
        followers: stats.followers,
      });
      setShowSparkles(true);
      setPulseEffect(true);
      
      setTimeout(() => {
        setShowSparkles(false);
        setPulseEffect(false);
      }, 2000);
    }, 100);
  }, [stats]);

  if (loading && !userInfo) {
    return (
      <div className="max-w-md mx-auto p-6">
        <div className="relative bg-gradient-to-br from-[#29293f]/90 via-[#29293f]/70 to-[#1a1a2e]/90 rounded-2xl p-6 border-2 border-[#848792]/20 shadow-2xl backdrop-blur-sm">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#1AD6BB]/30 border-t-[#1AD6BB] rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#DEE4E4] text-lg">Cargando datos de GitHub...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto p-6">
        <div className="relative bg-gradient-to-br from-[#29293f]/90 via-[#29293f]/70 to-[#1a1a2e]/90 rounded-2xl p-6 border-2 border-[#CB399E]/50 shadow-2xl backdrop-blur-sm">
          <div className="text-center">
            <p className="text-[#CB399E] text-lg mb-2">Error al cargar datos</p>
            <p className="text-[#848792] text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 flex flex-col lg:flex-row pb-20 lg:pb-0">
      <div className="w-full lg:w-[400px] xl:w-[500px] order-4 lg:order-none">
        <div className="relative rounded-2xl p-6 border-2 border-[#848792]/20 shadow-2xl backdrop-blur-sm overflow-hidden">
          {/* Background animated gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#CB399E]/5 via-transparent to-[#1AD6BB]/5 animate-pulse" />

          {/* Floating particles */}
          <FloatingParticles />

          {/* Header */}

          {/* Stats Cards */}
          <div className="space-y-4">
            <StatCard
              icon={Book}
              label="REPOSITORIES"
              sublabel="Public Projects"
              value={animatedStats.repos}
              maxValue={100}
              color="#D61A72"
              bgColor="from-[#CB399E]/10 to-transparent"
              isVisible={isVisible}
              delay={200}
            />

            <StatCard
              icon={Star}
              label="STARS"
              sublabel="Total Recognition"
              value={animatedStats.stars}
              maxValue={1000}
              color="#D3D61A"
              bgColor="from-[#2E5677]/10 to-transparent"
              isVisible={isVisible}
              delay={400}
            />

            <StatCard
              icon={Users}
              label="FOLLOWERS"
              sublabel="Community Size"
              value={animatedStats.followers}
              maxValue={500}
              color="#1AD6BB"
              bgColor="from-[#1AD6BB]/10 to-transparent"
              isVisible={isVisible}
              delay={600}
            />
          </div>

          {/* Total Power Section */}
          <div
            className={`mt-6 pt-4 border-t border-[#848792]/20 transform transition-all duration-700 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
            style={{ transitionDelay: "800ms" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-[#1AD6BB]" />
                <span className="text-[#848792] text-sm font-medium">
                  TOTAL IMPACT
                </span>
              </div>
              <div className="relative">
                <span
                  className={`text-[#DEE4E4] font-bold text-lg transition-all duration-300 ${
                    pulseEffect ? "scale-110 text-[#1AD6BB]" : ""
                  }`}
                >
                  {formatNumber(totalPower)}
                </span>
                {pulseEffect && (
                  <div className="absolute inset-0 bg-[#1AD6BB]/20 rounded-lg animate-ping" />
                )}
              </div>
            </div>

            {/* Power level bar */}
            <div className="mt-2 w-full bg-[#1a1a2e]/60 rounded-full h-1 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#CB399E] via-[#2E5677] to-[#1AD6BB] transition-all duration-2000 ease-out"
                style={{
                  width: `${Math.min((totalPower / 1000) * 100, 100)}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

StatBar.displayName = 'StatBar';
FloatingParticles.displayName = 'FloatingParticles';
StatCard.displayName = 'StatCard';