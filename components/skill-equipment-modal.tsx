"use client"

import { X, Star, Calendar, Trophy, Target, Code, Users, Book, TrendingUp, Sparkles } from "lucide-react"
import { useEffect, useState, memo, useMemo, useCallback } from "react"

interface Skill {
  id: number
  nombre: string
  nivel: number
  rareza: string
  anos_uso: number
  proyectos_relacionados: number
}

interface SkillEquipmentModalProps {
  skill: Skill | null
  isOpen: boolean
  onClose: () => void
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
      Array.from({ length: 8 }).map(() => ({
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
  unit,
  color, 
  bgColor, 
  isVisible,
  delay 
}: {
  icon: any,
  label: string,
  sublabel: string,
  value: number,
  unit: string,
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
            {typeof value === 'number' ? formatNumber(value) : value}{unit}
          </span>
          {/* Pulse effect on value */}
          <div 
            className="absolute right-0 top-0 w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 animate-ping"
            style={{ backgroundColor: color }}
          />
        </div>
      </div>
      <StatBar value={typeof value === 'number' ? value : 0} maxValue={100} color={color} isVisible={isVisible} />
    </div>
  )
})

export function SkillEquipmentModal({ skill, isOpen, onClose }: SkillEquipmentModalProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [showSparkles, setShowSparkles] = useState(false)
  const [pulseEffect, setPulseEffect] = useState(false)

  // Mover useMemo antes del return condicional
  const totalPower = useMemo(() => {
    if (!skill) return 0;
    return skill.nivel + skill.anos_uso * 10 + skill.proyectos_relacionados * 5;
  }, [skill]);


  useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }

  return () => {
    document.body.style.overflow = "";
  };
}, [isOpen]);


  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      setIsClosing(false)
      // Trigger sparkles after a delay
      setTimeout(() => {
        setShowSparkles(true)
        setPulseEffect(true)
        
        // Auto-hide sparkles
        setTimeout(() => {
          setShowSparkles(false)
          setPulseEffect(false)
        }, 3000)
      }, 800)
    }
  }, [isOpen])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsVisible(false)
      onClose()
    }, 300)
  }

  if (!isOpen || !skill) return null

  const getRarityColor = (rareza: string) => {
    switch (rareza) {
      case "Legendario":
        return "#D61A72"
      case "Épico":
        return "#D3D61A"
      case "Raro":
        return "#1AD6BB"
      default:
        return "#1AD6BB"
    }
  }

  const getRarityStars = (rareza: string) => {
    const stars = rareza === "Legendario" ? 5 : rareza === "Épico" ? 4 : rareza === "Raro" ? 3 : 2
    return Array.from({ length: stars }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 fill-current transform transition-all duration-300 hover:scale-125 animate-pulse`}
        style={{ 
          color: getRarityColor(rareza),
          animationDelay: `${i * 100}ms`
        }} 
      />
    ))
  }

  return (
    <div 
      className={`fixed inset-0 bg-black/60 backdrop-blur-[6px] z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={handleClose}
    >
      <div 
        className={`relative h-full max-h-[100dvh] max-w-md w-full transform transition-all duration-500 overflow-y-auto ${
          isClosing 
            ? 'scale-75 opacity-0 rotate-3 translate-y-8' 
            : 'scale-100 opacity-100 rotate-0 translate-y-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative rounded-2xl p-6 border-2 border-[#848792]/20 shadow-2xl backdrop-blur-sm overflow-hidden"
             style={{
               background: 'linear-gradient(135deg, #29293f90, #29293f70, #1a1a2e90)',
               boxShadow: `0 0 30px ${getRarityColor(skill.rareza)}40, 0 0 60px ${getRarityColor(skill.rareza)}20`
             }}>

          {/* Background animated gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#CB399E]/5 via-transparent to-[#1AD6BB]/5 animate-pulse" />

          {/* Floating particles */}
          <FloatingParticles />

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-20 text-white hover:text-[#1AD6BB] transition-all duration-200 hover:scale-110 hover:rotate-90 active:scale-95"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Header */}
          <div className={`text-center mb-6 transform transition-all duration-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <h2 className="text-2xl font-bold text-white mb-2 animate-title-glow">{skill.nombre}</h2>
            <div className="flex justify-center space-x-1 mb-2">{getRarityStars(skill.rareza)}</div>
            <span
              className="inline-block px-3 py-1 rounded-full text-sm font-bold text-white transition-all duration-300 hover:scale-105 animate-badge-pulse"
              style={{ backgroundColor: getRarityColor(skill.rareza) }}
            >
              {skill.rareza}
            </span>
            
            {/* Sparkles effect */}
            {showSparkles && (
              <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Sparkles
                    key={i}
                    className="absolute w-4 h-4 text-[#1AD6BB] animate-ping"
                    style={{
                      left: `${20 + Math.random() * 60}%`,
                      top: `${20 + Math.random() * 60}%`,
                      animationDelay: `${i * 200}ms`
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Stats Cards */}
          <div className="space-y-4 mb-6">
            <StatCard
              icon={TrendingUp}
              label="NIVEL DE DOMINIO"
              sublabel="Skill Mastery"
              value={skill.nivel}
              unit="%"
              color="#D61A72"
              bgColor="from-[#CB399E]/10 to-transparent"
              isVisible={isVisible}
              delay={200}
            />

            <StatCard
              icon={Calendar}
              label="EXPERIENCIA"
              sublabel="Years of Practice"
              value={skill.anos_uso}
              unit=" años"
              color="#D3D61A"
              bgColor="from-[#2E5677]/10 to-transparent"
              isVisible={isVisible}
              delay={400}
            />

            <StatCard
              icon={Trophy}
              label="PROYECTOS"
              sublabel="Professional Work"
              value={skill.proyectos_relacionados}
              unit=""
              color="#1AD6BB"
              bgColor="from-[#1AD6BB]/10 to-transparent"
              isVisible={isVisible}
              delay={600}
            />
          </div>

          {/* Total Power Section */}
          <div
            className={`pt-4 border-t border-[#848792]/20 transform transition-all duration-700 mb-6 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
            style={{ transitionDelay: "800ms" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-[#1AD6BB] animate-spin-slow" />
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
                  {totalPower.toLocaleString()}
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
                  width: `${Math.min((totalPower / 500) * 100, 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-[#29293f]/30 rounded-xl p-4 border border-[#1AD6BB]/30 animate-slide-up transition-all duration-300 hover:bg-[#29293f]/50 hover:border-[#1AD6BB]/50" style={{ animationDelay: '900ms' }}>
            <h3 className="text-[#DEE4E4] font-bold mb-3 flex items-center text-sm tracking-wide">
              <Target className="w-4 h-4 mr-2 text-[#1AD6BB] animate-spin-slow" />
              LOGROS DESTACADOS
            </h3>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-[#DEE4E4] transition-all duration-200 hover:text-[#D61A72] hover:translate-x-2 animate-achievement" style={{ animationDelay: '1000ms' }}>
                <div className="w-2 h-2 bg-[#D61A72] rounded-full mr-3 animate-pulse"></div>
                Certificación profesional obtenida
              </div>
              <div className="flex items-center text-sm text-[#DEE4E4] transition-all duration-200 hover:text-[#1AD6BB] hover:translate-x-2 animate-achievement" style={{ animationDelay: '1100ms' }}>
                <div className="w-2 h-2 bg-[#1AD6BB] rounded-full mr-3 animate-pulse"></div>
                Proyectos enterprise completados
              </div>
              <div className="flex items-center text-sm text-[#DEE4E4] transition-all duration-200 hover:text-[#D3D61A] hover:translate-x-2 animate-achievement" style={{ animationDelay: '1200ms' }}>
                <div className="w-2 h-2 bg-[#D3D61A] rounded-full mr-3 animate-pulse"></div>
                Mentor de equipo de desarrollo
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-gradient-to-r from-[#572F63]/30 to-[#2E5677]/30 rounded-xl p-4 border border-[#848792]/20 animate-slide-up transition-all duration-300 hover:from-[#572F63]/50 hover:to-[#2E5677]/50 hover:border-[#848792]/40 mt-4" style={{ animationDelay: '1000ms' }}>
            <p className="text-[#DEE4E4] text-sm leading-relaxed">
              Tecnología dominada con {skill.anos_uso} años de experiencia práctica. Utilizada en{" "}
              {skill.proyectos_relacionados} proyectos profesionales, demostrando un nivel de expertise{" "}
              {skill.rareza.toLowerCase()} en el ecosistema de desarrollo.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes modalEnter {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(20px) rotate(-5deg);
          }
          50% {
            transform: scale(1.05) translateY(-5px) rotate(1deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0) rotate(0deg);
          }
        }

        @keyframes title-glow {
          0%, 100% {
            text-shadow: 0 0 5px rgba(26, 214, 187, 0.5);
          }
          50% {
            text-shadow: 0 0 20px rgba(26, 214, 187, 0.8), 0 0 30px rgba(26, 214, 187, 0.4);
          }
        }

        @keyframes badge-pulse {
          0%, 100% {
            box-shadow: 0 0 5px rgba(203, 57, 158, 0.3);
          }
          50% {
            box-shadow: 0 0 20px rgba(203, 57, 158, 0.6), 0 0 30px rgba(203, 57, 158, 0.3);
          }
        }

        @keyframes slide-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes achievement {
          0% {
            opacity: 0;
            transform: translateX(-10px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes spin-slow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .animate-title-glow {
          animation: title-glow 3s ease-in-out infinite;
        }

        .animate-badge-pulse {
          animation: badge-pulse 2s ease-in-out infinite;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-achievement {
          animation: achievement 0.5s ease-out forwards;
          opacity: 0;
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  )
}

StatBar.displayName = 'StatBar';
FloatingParticles.displayName = 'FloatingParticles';
StatCard.displayName = 'StatCard';