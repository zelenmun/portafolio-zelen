"use client"

import { Code } from "lucide-react"

interface Skill {
  id: number
  nombre: string
  nivel: number
  rareza: string
  anos_uso: number
  proyectos_relacionados: number
}

interface SkillGemProps {
  skill: Skill
  onClick: () => void
}

export function SkillGem({ skill, onClick }: SkillGemProps) {
  const getRarityColor = (rareza: string) => {
    switch (rareza) {
      case "Legendario":
        return "#CB399E"
      case "Épico":
        return "#572F63"
      case "Raro":
        return "#2E5677"
      default:
        return "#848792"
    }
  }

  const getRarityGlow = (rareza: string) => {
    switch (rareza) {
      case "Legendario":
        return "shadow-lg shadow-[#CB399E]/50"
      case "Épico":
        return "shadow-lg shadow-[#572F63]/50"
      case "Raro":
        return "shadow-lg shadow-[#2E5677]/50"
      default:
        return "shadow-lg shadow-[#848792]/30"
    }
  }

  return (
    <button
      onClick={onClick}
      className={`relative bg-gradient-to-b from-[#29293f] to-[#572F63] rounded-lg p-3 border-2 transition-all duration-300 hover:scale-105 hover:brightness-110 ${getRarityGlow(skill.rareza)}`}
      style={{ borderColor: getRarityColor(skill.rareza) }}
    >
      {/* Gem effect */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>

      {/* Icon */}
      <div className="flex justify-center mb-2">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${getRarityColor(skill.rareza)}20` }}
        >
          <Code className="w-4 h-4" style={{ color: getRarityColor(skill.rareza) }} />
        </div>
      </div>

      {/* Skill name */}
      <div className="text-[#DEE4E4] text-xs font-semibold text-center mb-1">{skill.nombre}</div>

      {/* Level indicator */}
      <div className="text-xs text-center" style={{ color: getRarityColor(skill.rareza) }}>
        Lv.{skill.nivel}
      </div>

      {/* Rarity indicator */}
      <div
        className="absolute top-1 right-1 w-2 h-2 rounded-full"
        style={{ backgroundColor: getRarityColor(skill.rareza) }}
      ></div>
    </button>
  )
}
