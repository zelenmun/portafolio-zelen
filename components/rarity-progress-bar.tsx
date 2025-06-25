interface RarityProgressBarProps {
  value: number
  color: string
  className?: string
}

export function RarityProgressBar({ value, color, className = "" }: RarityProgressBarProps) {
  return (
    <div
      className={`relative w-full h-3 bg-[#29293f] rounded-full border border-[#848792]/30 overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      <div
        className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
        style={{
          width: `${value}%`,
          background: `linear-gradient(90deg, ${color}CC, ${color})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
      </div>
      <div className="absolute inset-0 rounded-full shadow-inner"></div>
    </div>
  )
}
