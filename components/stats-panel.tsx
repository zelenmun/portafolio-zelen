"use client"

import { Sword, Shield, Heart, Sparkles, TrendingUp, Eye, Zap } from "lucide-react"
import { useState, useEffect, useCallback, useMemo, memo } from "react"

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
    // Generar los estilos aleatorios solo en el cliente
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

FloatingParticles.displayName = 'FloatingParticles';
export default FloatingParticles;

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

export function StatsPanel() {
  const stats = useMemo(() => ({
    attack: 1250,
    defense: 850,
    stamina: 2100
  }), [])

  const [animatedStats, setAnimatedStats] = useState({ attack: 0, defense: 0, stamina: 0 })
  const [showSparkles, setShowSparkles] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [pulseEffect, setPulseEffect] = useState(false)

  const totalPower = useMemo(() => 
    animatedStats.attack + animatedStats.defense + animatedStats.stamina,
    [animatedStats]
  )

  const formatNumber = useCallback((num: number) => num.toLocaleString(), [])

  // Animación de entrada mejorada
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Animación de stats con easing personalizado
  useEffect(() => {
    if (!isVisible) return

    const duration = 2000
    const steps = 80
    const stepDuration = duration / steps

    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      const progress = currentStep / steps
      // Easing function más suave
      const easeOut = 1 - Math.pow(1 - progress, 4)

      setAnimatedStats({
        attack: Math.floor(stats.attack * easeOut),
        defense: Math.floor(stats.defense * easeOut),
        stamina: Math.floor(stats.stamina * easeOut),
      })

      if (currentStep >= steps) {
        clearInterval(timer)
        setShowSparkles(true)
        setPulseEffect(true)
        
        // Auto-hide sparkles
        setTimeout(() => {
          setShowSparkles(false)
          setPulseEffect(false)
        }, 3000)
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [isVisible, stats])

  const handleRefresh = useCallback(() => {
    setAnimatedStats({ attack: 0, defense: 0, stamina: 0 })
    setShowSparkles(false)
    setPulseEffect(false)
    
    setTimeout(() => {
      setAnimatedStats({
        attack: stats.attack,
        defense: stats.defense,
        stamina: stats.stamina,
      })
      setShowSparkles(true)
      setPulseEffect(true)
      
      setTimeout(() => {
        setShowSparkles(false)
        setPulseEffect(false)
      }, 2000)
    }, 100)
  }, [stats])

  return (
    <div className="relative rounded-2xl p-6 border-2 border-[#848792]/20 shadow-2xl backdrop-blur-sm overflow-hidden">
      {/* Background animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#CB399E]/5 via-transparent to-[#1AD6BB]/5 animate-pulse" />
      
      {/* Floating particles */}
      <FloatingParticles />

      {/* Header */}
      

      {/* Stats Cards */}
      <div className="space-y-4">
        <StatCard
          icon={Sword}
          label="ATTACK"
          sublabel="Physical Power"
          value={animatedStats.attack}
          maxValue={3000}
          color="#D61A72"
          bgColor="from-[#CB399E]/10 to-transparent"
          isVisible={isVisible}
          delay={200}
        />

        <StatCard
          icon={Shield}
          label="DEFENSE"
          sublabel="Damage Reduction"
          value={animatedStats.defense}
          maxValue={2000}
          color="#D3D61A"
          bgColor="from-[#2E5677]/10 to-transparent"
          isVisible={isVisible}
          delay={400}
        />

        <StatCard
          icon={Heart}
          label="STAMINA"
          sublabel="Health Points"
          value={animatedStats.stamina}
          maxValue={4000}
          color="#1AD6BB"
          bgColor="from-[#1AD6BB]/10 to-transparent"
          isVisible={isVisible}
          delay={600}
        />
      </div>

      {/* Total Power Section */}
      <div className={`mt-6 pt-4 border-t border-[#848792]/20 transform transition-all duration-700 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`} style={{ transitionDelay: '800ms' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-[#1AD6BB]" />
            <span className="text-[#848792] text-sm font-medium">TOTAL POWER</span>
          </div>
          <div className="relative">
            <span className={`text-[#DEE4E4] font-bold text-lg transition-all duration-300 ${
              pulseEffect ? 'scale-110 text-[#1AD6BB]' : ''
            }`}>
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
            style={{ width: `${Math.min((totalPower / 8000) * 100, 100)}%` }}
          />
        </div>
      </div>
      
    </div>
  )
}

StatBar.displayName = 'StatBar'
FloatingParticles.displayName = 'FloatingParticles'
StatCard.displayName = 'StatCard'