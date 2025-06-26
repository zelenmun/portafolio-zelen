import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { Github, TrendingUp, Calendar, Eye, Sparkles, Zap, Activity, RefreshCw } from 'lucide-react';

// Interfaces TypeScript
interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface GitHubContributionsProps {
  username?: string;
  showMockData?: boolean;
}

interface ContributionResponse {
  contributions: ContributionDay[];
  totalContributions: number;
  longestStreak: number;
  currentStreak: number;
}

// Componente de partículas flotantes
const FloatingParticles = memo(() => {
  const [particles, setParticles] = useState<Array<React.CSSProperties>>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 15 }).map(() => ({
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
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
});

// 1. AGREGAR: Nuevo componente de Shimmer (insertar después de FloatingParticles)
const Shimmer = memo(() => (
  <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
));

// 2. AGREGAR: Nuevo componente SkeletonBox (insertar después de Shimmer)
const SkeletonBox = memo(({ className, children }: { className?: string; children?: React.ReactNode }) => (
  <div className={`relative overflow-hidden bg-[#848792]/10 rounded-lg ${className}`}>
    <Shimmer />
    {children}
  </div>
));

// Componente de barra de intensidad
const IntensityBar = memo(({ level, isVisible }: { level: number, isVisible: boolean }) => {
  const colors = [
      '#0C0B0C', // 0 contributions
      '#3F0F26', // 1-2 contributions
      '#71133F', // 3-5 contributions
      '#A41759', // 6-10 contributions
      '#1AD6C3'  // 11+ contributions
    ];
  
  return (
    <div className="flex items-center gap-1 text-xs text-[#848792]">
      <span>Less</span>
      {Array.from({ length: 5 }, (_, i) => (
        <div
          key={i}
          className={`w-3 h-3 rounded-sm transition-all duration-300 ${
            isVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
          }`}
          style={{
            backgroundColor: colors[i],
            transitionDelay: `${i * 100}ms`,
            boxShadow: i === level ? `0 0 8px ${colors[i]}` : 'none'
          }}
        />
      ))}
      <span>More</span>
    </div>
  );
});

// Componente de estadísticas
const ContributionStats = memo(({ 
  totalContributions, 
  currentStreak, 
  longestStreak, 
  isVisible 
}: { 
  totalContributions: number, 
  currentStreak: number, 
  longestStreak: number, 
  isVisible: boolean 
}) => {
  const [animatedTotal, setAnimatedTotal] = useState(0);
  const [animatedCurrent, setAnimatedCurrent] = useState(0);
  const [animatedLongest, setAnimatedLongest] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setAnimatedTotal(Math.floor(totalContributions * easeOut));
      setAnimatedCurrent(Math.floor(currentStreak * easeOut));
      setAnimatedLongest(Math.floor(longestStreak * easeOut));

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isVisible, totalContributions, currentStreak, longestStreak]);

  return (
  <div className="grid grid-cols-1 gap-3 mb-4">
    <div className={`group bg-gradient-to-r from-[#1AD6BB]/10 to-transparent rounded-lg p-3 border border-[#1AD6BB]/20 transition-all duration-500 ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
    }`}>
      <div className="flex items-center gap-2 mb-1 justify-between">
        <Activity className="w-4 h-4 text-[#1AD6BB]" />
        <span className="text-xs text-[#1AD6BB] font-bold">TOTAL COMMITS:</span>
        <span className="text-[#1AD6BB] font-bold text-lg">{animatedTotal.toLocaleString()}</span>
      </div>
    </div>

    {/*
    <div className={`group bg-gradient-to-r from-[#CB399E]/10 to-transparent rounded-lg p-3 border border-[#CB399E]/20 transition-all duration-500 ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
    }`} style={{ transitionDelay: '200ms' }}>
      <div className="flex items-center gap-2 mb-1">
        <Zap className="w-4 h-4 text-[#CB399E]" />
        <span className="text-xs text-[#848792]">CURRENT</span>
      </div>
      <span className="text-[#CB399E] font-bold text-lg">
        {animatedCurrent}
      </span>
    </div>

    <div className={`group bg-gradient-to-r from-[#FFD700]/10 to-transparent rounded-lg p-3 border border-[#FFD700]/20 transition-all duration-500 ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
    }`} style={{ transitionDelay: '400ms' }}>
      <div className="flex items-center gap-2 mb-1">
        <TrendingUp className="w-4 h-4 text-[#FFD700]" />
        <span className="text-xs text-[#848792]">LONGEST</span>
      </div>
      <span className="text-[#FFD700] font-bold text-lg">
        {animatedLongest}
      </span>
    </div>
    */}
  </div>
);

});

export const GitHubContributions: React.FC<GitHubContributionsProps> = ({ 
  username = 'octocat',
  showMockData = false
}) => {
  const [contributions, setContributions] = useState<ContributionDay[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalContributions, setTotalContributions] = useState<number>(0);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [longestStreak, setLongestStreak] = useState<number>(0);
  const [isVisible, setIsVisible] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);

  // Obtener color basado en el nivel
  const getColorClass = (level: number): string => {
    const colors = [
      '#0C0B0C', // 0 contributions
      '#3F0F26', // 1-2 contributions
      '#71133F', // 3-5 contributions
      '#A41759', // 6-10 contributions
      '#1AD6C3'  // 11+ contributions
    ];
    return colors[level] || colors[0];
  };

  // Organizar contribuciones por semanas
  const organizeByWeeks = (): (ContributionDay | null)[][] => {
  if (contributions.length === 0) return [];
  
  const weeks: (ContributionDay | null)[][] = [];
  
  // Crear un mapa de fechas para búsqueda rápida
  const contributionMap = new Map<string, ContributionDay>();
  contributions.forEach(contribution => {
    contributionMap.set(contribution.date, contribution);
  });
  
  // Obtener la fecha más antigua y más reciente
  const dates = contributions.map(c => new Date(c.date)).sort((a, b) => a.getTime() - b.getTime());
  const startDate = dates[0];
  const endDate = dates[dates.length - 1];
  
  // Encontrar el domingo anterior al primer día (para empezar la semana correctamente)
  const firstSunday = new Date(startDate);
  firstSunday.setDate(startDate.getDate() - startDate.getDay());
  
  // Encontrar el sábado posterior al último día (para terminar la semana correctamente)
  const lastSaturday = new Date(endDate);
  lastSaturday.setDate(endDate.getDate() + (6 - endDate.getDay()));
  
  // Generar todas las semanas
  let currentDate = new Date(firstSunday);
  
  while (currentDate <= lastSaturday) {
    const week: (ContributionDay | null)[] = [];
    
    // Generar los 7 días de la semana
    for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
      const dateString = currentDate.toISOString().split('T')[0];
      const contribution = contributionMap.get(dateString);
      
      week.push(contribution || null);
      
      // Avanzar al siguiente día
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    weeks.push(week);
  }
  
  return weeks;
};

  const fetchContributions = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const endpoint = showMockData
      ? `/api/github/contributions?username=${username}&mock=true`
      : `/api/github/contributions?username=${username}`;


      const response = await fetch(endpoint);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data: ContributionResponse = await response.json();
      
      setContributions(data.contributions);
      setTotalContributions(data.totalContributions);
      setCurrentStreak(data.currentStreak);
      setLongestStreak(data.longestStreak);
      
      // Mostrar efectos cuando termine de cargar
      setTimeout(() => {
        setShowSparkles(true);
        setTimeout(() => setShowSparkles(false), 3000);
      }, 500);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar las contribuciones';
      setError(errorMessage);
      console.error('Error fetching contributions:', err);
    } finally {
      setLoading(false);
    }
  }, [username, showMockData]);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetchContributions();
  }, [fetchContributions]);

  const handleRefresh = useCallback(() => {
    setContributions([]);
    setTotalContributions(0);
    setCurrentStreak(0);
    setLongestStreak(0);
    fetchContributions();
  }, [fetchContributions]);

  const weeks = contributions.length > 0 ? organizeByWeeks() : [];
  const dayLabels: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // 4. REEMPLAZAR: Todo el bloque del loading (desde "if (loading) {" hasta el primer "}" que cierra ese bloque)
if (loading) {
  return (
    <div className="relative rounded-2xl p-6 border-2 border-[#848792]/20 shadow-2xl backdrop-blur-sm overflow-hidden">
      {/* Background gradient más dinámico */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1AD6BB]/5 via-[#CB399E]/5 to-[#1AD6BB]/5 animate-pulse-glow" />
      
      {/* Floating particles durante carga */}
      <FloatingParticles />
      
      <div className="relative z-10">
        {/* Stats skeleton mejorado */}
        <div className="grid grid-cols-1 gap-3 mb-4">
          <div className="group bg-gradient-to-r from-[#1AD6BB]/10 to-transparent rounded-lg p-3 border border-[#1AD6BB]/20 transition-all duration-500 animate-pulse">
            <div className="flex items-center gap-2 mb-1 justify-between">
              <div className="w-4 h-4 bg-[#1AD6BB]/30 rounded animate-pulse"></div>
              <div className="h-3 w-24 bg-[#1AD6BB]/20 rounded animate-pulse"></div>
              <div className="h-5 w-16 bg-[#1AD6BB]/30 rounded animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Contribution grid skeleton más realista */}
        <div className="space-y-2">
          {/* Month labels skeleton */}
          <div className="flex mb-2 ml-8 gap-1">
            {Array.from({ length: 12 }, (_, i) => (
              <SkeletonBox 
                key={i} 
                className="h-3 w-8"
              />
            ))}
          </div>

          {/* Grid skeleton con patrón más realista */}
          <div className="flex">
            {/* Day labels skeleton */}
            <div className="flex flex-col pr-2 space-y-1">
              {Array.from({ length: 7 }, (_, i) => (
                <SkeletonBox 
                  key={i} 
                  className="h-3 w-6"
                />
              ))}
            </div>

            {/* Contribution squares con animación escalonada */}
            <div className="flex gap-1">
              {Array.from({ length: 53 }, (_, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {Array.from({ length: 7 }, (_, dayIndex) => (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      className="w-3 h-3 rounded-sm bg-[#848792]/20 animate-pulse"
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend skeleton */}
        <div className="flex items-center justify-between mt-4">
          <SkeletonBox className="h-3 w-48" />
          <div className="flex items-center gap-1">
            <SkeletonBox className="h-3 w-8" />
            {Array.from({ length: 5 }, (_, i) => (
              <SkeletonBox 
                key={i} 
                className="w-3 h-3 rounded-sm"
              />
            ))}
            <SkeletonBox className="h-3 w-8" />
          </div>
        </div>

        {/* Loading message */}
        <div className="mt-3 flex items-center gap-2 text-xs text-[#1AD6BB]">
          <div className="w-2 h-2 bg-[#1AD6BB] rounded-full animate-bounce" />
          <span className="animate-pulse">Loading GitHub contributions...</span>
        </div>
      </div>
    </div>
  );
}

  if (error) {
    return (
      <div className="relative rounded-2xl p-6 border-2 border-[#D61A72]/20 shadow-2xl backdrop-blur-sm overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#D61A72]/5 via-transparent to-[#CB399E]/5" />
        <div className="text-center">
          <div className="w-10 h-10 bg-[#D61A72]/20 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Github className="w-5 h-5 text-[#D61A72]" />
          </div>
          <p className="font-medium text-[#DEE4E4] mb-1">Error loading contributions</p>
          <p className="text-sm text-[#848792] mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-[#1AD6BB]/20 text-[#1AD6BB] rounded-lg hover:bg-[#1AD6BB]/30 transition-colors flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl p-6 border-2 border-[#848792]/20 shadow-2xl backdrop-blur-sm overflow-hidden">
      {/* Background animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1AD6BB]/5 via-transparent to-[#CB399E]/5 animate-pulse" />

      {/* Floating particles */}
      <FloatingParticles />

      {/* Header */}

      {/* Stats */}
      <ContributionStats
        totalContributions={totalContributions}
        currentStreak={currentStreak}
        longestStreak={longestStreak}
        isVisible={isVisible}
      />

      {/* Contribution Grid */}
      <div
        className={`overflow-x-auto scrollbar-thin scrollbar-thumb-[#1AD6BB]/50 scrollbar-track-transparent ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
        style={{ transitionDelay: "400ms" }}
      >
        <div className="inline-block min-w-full">
          {/* Month labels dinámicos */}
          <div className="flex mb-2 ml-8 gap-1">
            {weeks.map((week, i) => {
              const firstDay = week.find((day) => day !== null);
              const label = firstDay
                ? new Date(firstDay.date).toLocaleString("default", {
                    month: "short",
                  })
                : "";
              const showLabel =
                i === 0 ||
                (() => {
                  const prevWeek = weeks[i - 1];
                  const prevDay = prevWeek.find((day) => day !== null);
                  const prevMonth = prevDay
                    ? new Date(prevDay.date).getMonth()
                    : null;
                  const currentMonth = firstDay
                    ? new Date(firstDay.date).getMonth()
                    : null;
                  return prevMonth !== currentMonth;
                })();

              return (
                <div key={i} className="text-xs text-[#848792] w-3 text-center">
                  {showLabel ? label : ""}
                </div>
              );
            })}
          </div>

          {/* Grid */}
          <div className="flex">
            {/* Day labels */}
            <div className="flex flex-col pr-2">
              {dayLabels.map((day, index) => (
                <div
                  key={day}
                  className="h-3 mb-1 text-xs text-[#848792] text-right pr-1"
                >
                  {index % 2 === 1 ? day : ""}
                </div>
              ))}
            </div>

            {/* Contribution squares */}
            <div className="flex gap-1">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((day, dayIndex) => (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      className={`w-3 h-3 rounded-sm cursor-pointer hover:ring-1 hover:ring-[#1AD6BB] transition-all duration-300 hover:scale-110 transform ${
                        day ? "opacity-100" : "opacity-50"
                      }`}
                      style={{
                        backgroundColor: day
                          ? getColorClass(day.level)
                          : "#1a1a2e",
                        boxShadow:
                          day && day.count > 0
                            ? `0 0 4px ${getColorClass(day.level)}40`
                            : "none",
                      }}
                      title={
                        day ? `${day.count} contributions on ${day.date}` : ""
                      }
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div
        className={`flex items-center justify-between text-xs text-[#848792] transform transition-all duration-700 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
        style={{ transitionDelay: "600ms" }}
      >
        <span className="hover:text-[#1AD6BB] cursor-pointer transition-colors">
          Learn how we count contributions
        </span>
        <IntensityBar level={2} isVisible={isVisible} />
      </div>

      {/* Status indicator */}
      <div
        className={`mt-3 text-xs transform transition-all duration-700 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
        style={{ transitionDelay: "800ms" }}
      >
        {showMockData ? (
          <span className="text-[#CB399E] flex items-center gap-1">
            <div className="w-2 h-2 bg-[#CB399E] rounded-full animate-pulse"></div>
            Using mock data. Connect to real GitHub data from backend.
          </span>
        ) : (
          <span className="text-[#1AD6BB] flex items-center gap-1">
            <div className="w-2 h-2 bg-[#1AD6BB] rounded-full animate-pulse"></div>
            Using real GitHub data for @{username}
          </span>
        )}
      </div>
    </div>
  );
};

FloatingParticles.displayName = 'FloatingParticles';
IntensityBar.displayName = 'IntensityBar';
ContributionStats.displayName = 'ContributionStats';
// 5. AGREGAR: Al final del archivo, después de las asignaciones displayName
Shimmer.displayName = 'Shimmer';
SkeletonBox.displayName = 'SkeletonBox';