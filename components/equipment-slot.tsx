"use client"

import { 
  Atom, 
  FileCode, 
  Cloud, 
  Code, 
  Database, 
  Server,
  FileCode2,
  Layers,
  Container,
  DatabaseBackup,
  Trophy,
  Medal,
  Lightbulb,
  Cog,
  Award,
  Plus,
  Zap,
  Drill,
  TrendingUp
} from 'lucide-react';
import { useState, useEffect } from "react"
import { SkillEquipmentModal } from "./skill-equipment-modal"

interface Equipment {
  id: number
  nombre: string
  tipo: string
  rareza: string
  icono: string
  anos_uso: number
  proyectos_relacionados: number
  nivel: number
  skill1: string
  skill2: string
  skill3: string
}

interface EquipmentSlotProps {
  equipment: Equipment | null
  index?: number
}

export function EquipmentSlot({ equipment, index = 0 }: EquipmentSlotProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Animación de entrada escalonada
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, index * 150) // Delay basado en el índice

    return () => clearTimeout(timer)
  }, [index])

  const handleClick = () => {
    setIsClicked(true)
    setTimeout(() => setIsClicked(false), 200)
    if (equipment) setIsModalOpen(true)
  }

  const getRarityColor = (rareza: string) => {
    switch (rareza) {
      case "Legendario": return "#CB399E"
      case "Épico": return "#CCC039"
      case "Raro": return "#39C0CC"
      default: return "#848792"
    }
  }

  const getIconComponent = (iconType: string) => {
    switch (iconType?.toLowerCase()) {
      case "react": return <Atom className="w-6 h-6" />
      case "python": return <FileCode className="w-6 h-6" />
      case "cloud":
      case "aws": return <Cloud className="w-6 h-6" />
      case "frontend": return <Code className="w-6 h-6" />
      case "backend": return <Database className="w-6 h-6" />
      case "server": return <Server className="w-6 h-6" />
      case "javascript": return <FileCode2 className="w-6 h-6" />
      case "fullstack": return <Layers className="w-6 h-6" />
      case "docker": return <Container className="w-6 h-6" />
      case "database": return <DatabaseBackup className="w-6 h-6" />
      case "trophy": return <Trophy className="w-6 h-6" />
      case "medal": return <Medal className="w-6 h-6" />
      case "lightbulb": return <Lightbulb className="w-6 h-6" />
      case "devops": return <Cog className="w-6 h-6" />
      case "logro": return <Award className="w-6 h-6" />
      case "habilidad": return <Zap className="w-6 h-6" />
      case "drill": return <Drill className="w-6 h-6" />
      case "tendencia": return <TrendingUp className="w-6 h-6" />
      default: return <Code className="w-6 h-6" />
    }
  }

  const getRarityGlow = (rareza: string) => {
    const baseGlow = isHovered ? "shadow-2xl" : "shadow-lg"
    switch (rareza) {
      case "Legendario": return `${baseGlow} shadow-[#CB399E]/60 ${isHovered ? 'drop-shadow-[0_0_25px_rgba(203,57,158,0.8)]' : ''}`
      case "Épico": return `${baseGlow} shadow-[#572F63]/60 ${isHovered ? 'drop-shadow-[0_0_20px_rgba(87,47,99,0.7)]' : ''}`
      case "Raro": return `${baseGlow} shadow-[#2E5677]/60 ${isHovered ? 'drop-shadow-[0_0_15px_rgba(46,86,119,0.6)]' : ''}`
      default: return `${baseGlow} shadow-[#848792]/40`
    }
  }

  const getParticles = (rareza: string) => {
    if (!isHovered && !isClicked) return null

    const particleCount = rareza === "Legendario" ? 12 : rareza === "Épico" ? 8 : 6
    const particles = []

    for (let i = 0; i < particleCount; i++) {
      const delay = i * 100
      const randomX = Math.random() * 100
      const randomY = Math.random() * 100
      const randomSize = Math.random() * 4 + 2

      let particleClass = ""
      let particleColor = ""

      switch (rareza) {
        case "Legendario":
          particleClass = "animate-ping"
          particleColor = "bg-gradient-to-r from-pink-400 to-purple-500"
          break
        case "Épico":
          particleClass = "animate-pulse"
          particleColor = "bg-gradient-to-r from-yellow-400 to-orange-500"
          break
        case "Raro":
          particleClass = "animate-bounce"
          particleColor = "bg-gradient-to-r from-cyan-400 to-blue-500"
          break
        default:
          particleClass = "animate-pulse"
          particleColor = "bg-gray-400"
      }

      particles.push(
        <div
          key={i}
          className={`absolute rounded-full ${particleColor} ${particleClass} opacity-60`}
          style={{
            left: `${randomX}%`,
            top: `${randomY}%`,
            width: `${randomSize}px`,
            height: `${randomSize}px`,
            animationDelay: `${delay}ms`,
            animationDuration: rareza === "Legendario" ? "1s" : rareza === "Épico" ? "1.5s" : "2s"
          }}
        />
      )
    }

    return particles
  }

  if (!equipment) {
    return (
      <div 
        className={`aspect-square bg-[#29293f]/30 rounded-lg border-2 border-dashed border-[#848792]/50 flex items-center justify-center transition-all duration-500 cursor-pointer group relative
          hover:border-[#1AD6BB]/70 hover:bg-[#29293f]/50 hover:scale-105 hover:shadow-lg hover:shadow-[#1AD6BB]/30
          active:scale-95 active:border-[#1AD6BB] active:shadow-xl active:shadow-[#1AD6BB]/50
          ${isClicked ? 'animate-pulse' : ''}
          ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        style={{ 
          transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
          transitionDelay: isLoaded ? '0ms' : `${index * 150}ms`
        }}
      >
        <Plus className={`w-6 h-6 text-[#848792] transition-all duration-300 group-hover:text-[#1AD6BB] group-hover:scale-110 group-hover:rotate-90
          ${isHovered ? 'drop-shadow-[0_0_8px_rgba(26,214,187,0.6)]' : ''}
        `} />
      </div>
    )
  }

  const icono = equipment.icono || "default"
  const nombre = equipment.nombre || "Texto 6"
  const rareza = equipment.rareza || "Épico"

  return (
    <>
      <div
        className={`relative aspect-square bg-gradient-to-b from-[#29293f] to-[#572F63] rounded-lg border-2 p-2 transition-all duration-500 cursor-pointer group overflow-hidden
          hover:scale-110 hover:rotate-1 hover:z-10 active:scale-95 active:rotate-0
          ${getRarityGlow(rareza)}
          ${isClicked ? 'animate-bounce' : ''}
          ${isLoaded ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-50 translate-y-8'}
        `}
        style={{ 
          borderColor: getRarityColor(rareza),
          transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
          transitionDelay: isLoaded ? '0ms' : `${index * 150}ms`
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        {/* Partículas de rareza */}
        <div className="absolute inset-0 pointer-events-none">
          {getParticles(rareza)}
        </div>

        {/* Efecto de brillo de fondo animado */}
        {(isHovered || isClicked) && (
          <div 
            className="absolute inset-0 rounded-lg opacity-20 animate-pulse"
            style={{ 
              background: `radial-gradient(circle, ${getRarityColor(rareza)}40 0%, transparent 70%)`,
              animationDuration: rareza === "Legendario" ? "0.8s" : rareza === "Épico" ? "1.2s" : "1.6s"
            }}
          />
        )}

        <div className="w-full h-full flex flex-col items-center justify-center relative z-10">
          <div className={`mb-1 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12 text-[#DEE4E4] group-hover:text-white
            ${isHovered ? 'drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]' : ''}
            ${isClicked ? 'animate-spin' : ''}
          `}>
            {getIconComponent(icono)}
          </div>
          <div className={`text-xs text-[#DEE4E4] text-center font-medium leading-tight transition-all duration-300 group-hover:text-white group-hover:font-bold
            ${isHovered ? `drop-shadow-[0_0_6px_${getRarityColor(rareza)}]` : ''}
          `}>
            {nombre.split(" ")[0]}
          </div>
        </div>

        {/* Efecto de loading inicial */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse rounded-lg" />
        )}
      </div>

      {/* Modal al hacer clic */}
      <SkillEquipmentModal
        skill={{
          id: equipment.id,
          nombre: equipment.nombre,
          nivel: equipment.nivel,
          rareza: equipment.rareza,
          anos_uso: equipment.anos_uso,
          proyectos_relacionados: equipment.proyectos_relacionados,
          skill1: equipment.skill1,
          skill2: equipment.skill2,
          skill3: equipment.skill3,
        }}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}