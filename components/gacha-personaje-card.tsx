"use client"

import { useState, useEffect } from "react"
import { Star, Sparkles, Zap, Trophy, Calendar } from "lucide-react"
import { SkillEquipmentModal } from "./skill-equipment-modal"
import { SkillGem } from "./skill-gem"
import { StatsGachaPanel } from "./stats-gacha-panel"

interface DeveloperData {
  id: number
  nombre: string
  titulo: string
  anos_experiencia: number
  rareza_nivel: number
  avatar_url: string
}

interface Skill {
  id: number
  nombre: string
  nivel: number
  rareza: string
  anos_uso: number
  proyectos_relacionados: number
}

export function GachaPersonajeCard() {
  const [developer, setDeveloper] = useState<DeveloperData | null>(null)
  const [skills, setSkills] = useState<Skill[]>([])
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Simulated data - in real app, this would come from SQLite
  useEffect(() => {
    const mockDeveloper: DeveloperData = {
      id: 1,
      nombre: "Alex Rodriguez",
      titulo: "Senior Full Stack Developer",
      anos_experiencia: 8,
      rareza_nivel: 5,
      avatar_url: "/placeholder.svg?height=120&width=120",
    }

    const mockSkills: Skill[] = [
      { id: 1, nombre: "React", nivel: 95, rareza: "Legendario", anos_uso: 5, proyectos_relacionados: 25 },
      { id: 2, nombre: "Python", nivel: 90, rareza: "Legendario", anos_uso: 6, proyectos_relacionados: 30 },
      { id: 3, nombre: "Django", nivel: 85, rareza: "Épico", anos_uso: 4, proyectos_relacionados: 18 },
      { id: 4, nombre: "PostgreSQL", nivel: 80, rareza: "Épico", anos_uso: 5, proyectos_relacionados: 22 },
      { id: 5, nombre: "Docker", nivel: 75, rareza: "Raro", anos_uso: 3, proyectos_relacionados: 15 },
      { id: 6, nombre: "AWS", nivel: 70, rareza: "Raro", anos_uso: 3, proyectos_relacionados: 12 },
    ]

    setDeveloper(mockDeveloper)
    setSkills(mockSkills)
  }, [])

  const handleSkillClick = (skill: Skill) => {
    setSelectedSkill(skill)
    setIsModalOpen(true)
  }

  const getRarityStars = (level: number) => {
    return Array.from({ length: level }, (_, i) => <Star key={i} className="w-4 h-4 fill-[#CB399E] text-[#CB399E]" />)
  }

  if (!developer) return null

  return (
    <>
      <div className="relative bg-gradient-to-b from-[#29293f] via-[#572F63] to-[#2E5677] rounded-3xl overflow-hidden shadow-2xl border-4 border-[#CB399E] gacha-card">
        {/* Particle Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-4 left-4 w-2 h-2 bg-[#1AD6BB] rounded-full animate-pulse opacity-60"></div>
          <div className="absolute top-12 right-8 w-1 h-1 bg-[#CB399E] rounded-full animate-ping"></div>
          <div className="absolute bottom-20 left-6 w-1.5 h-1.5 bg-[#1AD6BB] rounded-full animate-pulse delay-300"></div>
          <div className="absolute top-1/3 right-4 w-1 h-1 bg-[#CB399E] rounded-full animate-ping delay-700"></div>
        </div>

        {/* Ornate Header */}
        <div className="relative bg-gradient-to-r from-[#CB399E] to-[#572F63] p-4 border-b-2 border-[#1AD6BB]">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          <div className="relative text-center">
            <h1 className="text-xl font-bold text-[#DEE4E4] mb-1">{developer.nombre}</h1>
            <p className="text-sm text-[#DEE4E4]/80">{developer.titulo}</p>
            <div className="flex justify-center mt-2 space-x-1">{getRarityStars(developer.rareza_nivel)}</div>
          </div>

          {/* Ornate corners */}
          <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-[#1AD6BB] rounded-tl-lg"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-[#1AD6BB] rounded-tr-lg"></div>
        </div>

        {/* Avatar Section */}
        <div className="relative p-6 text-center">
          <div className="relative inline-block">
            <div className="w-32 h-32 rounded-full border-4 border-[#1AD6BB] overflow-hidden mx-auto shadow-lg shadow-[#1AD6BB]/30">
              <img
                src={developer.avatar_url || "/placeholder.svg"}
                alt={developer.nombre}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-[#CB399E] to-[#1AD6BB] rounded-full p-2">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Level Badge */}
          <div className="mt-4 inline-flex items-center bg-gradient-to-r from-[#26AA9B] to-[#1AD6BB] rounded-full px-4 py-2 text-white font-bold">
            <Trophy className="w-4 h-4 mr-2" />
            Nivel {developer.rareza_nivel * 20}
          </div>
        </div>

        {/* Stats Panel */}
        <StatsGachaPanel frontendLevel={85} backendLevel={90} databaseLevel={80} devopsLevel={75} />

        {/* Experience Section */}
        <div className="px-6 py-4 border-t border-[#848792]/30">
          <div className="flex items-center justify-between text-[#DEE4E4]">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-[#1AD6BB]" />
              <span className="text-sm">Experiencia</span>
            </div>
            <span className="font-bold text-[#1AD6BB]">{developer.anos_experiencia} años</span>
          </div>
        </div>

        {/* Skills Grid */}
        <div className="p-6 border-t border-[#848792]/30">
          <h3 className="text-[#DEE4E4] font-bold mb-4 text-center">Arsenal Tecnológico</h3>
          <div className="grid grid-cols-3 gap-3">
            {skills.map((skill) => (
              <SkillGem key={skill.id} skill={skill} onClick={() => handleSkillClick(skill)} />
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="p-6">
          <button className="w-full bg-gradient-to-r from-[#1AD6BB] to-[#26AA9B] text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-[#1AD6BB]/50">
            <div className="flex items-center justify-center">
              <Zap className="w-5 h-5 mr-2" />
              Reclutar Desarrollador
            </div>
          </button>
        </div>

        {/* Ornate bottom border */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-[#1AD6BB] via-[#CB399E] to-[#1AD6BB]"></div>
      </div>

      {/* Skill Modal */}
      <SkillEquipmentModal skill={selectedSkill} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
