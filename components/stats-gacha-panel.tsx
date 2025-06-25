import { Code, Database, Server, Zap } from "lucide-react"
import { RarityProgressBar } from "./rarity-progress-bar"

interface StatsGachaPanelProps {
  frontendLevel: number
  backendLevel: number
  databaseLevel: number
  devopsLevel: number
}

export function StatsGachaPanel({ frontendLevel, backendLevel, databaseLevel, devopsLevel }: StatsGachaPanelProps) {
  const stats = [
    { name: "FRONTEND", level: frontendLevel, icon: Code, color: "#1AD6BB" },
    { name: "BACKEND", level: backendLevel, icon: Server, color: "#2E5677" },
    { name: "DATABASE", level: databaseLevel, icon: Database, color: "#572F63" },
    { name: "DEVOPS", level: devopsLevel, icon: Zap, color: "#CB399E" },
  ]

  return (
    <div className="px-6 py-4 border-t border-[#848792]/30">
      <h3 className="text-[#DEE4E4] font-bold mb-4 text-center">Estadísticas de Combate</h3>
      <div className="space-y-4">
        {stats.map((stat) => (
          <div key={stat.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <stat.icon className="w-4 h-4 mr-2" style={{ color: stat.color }} />
                <span className="text-[#DEE4E4] text-sm font-semibold">{stat.name}</span>
              </div>
              <span className="text-sm font-bold" style={{ color: stat.color }}>
                {stat.level}
              </span>
            </div>
            <RarityProgressBar value={stat.level} color={stat.color} />
          </div>
        ))}
      </div>
    </div>
  )
}
