import { X, User, Code, Sparkles, Eye } from "lucide-react"
import { useState, useEffect, memo } from "react"

// Componente de partículas flotantes
const FloatingParticles = memo(() => {
  const [particles, setParticles] = useState<Array<React.CSSProperties>>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 8 }).map(() => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animation: `float ${4 + Math.random() * 3}s linear infinite`,
        animationDelay: `${Math.random() * 2}s`
      }))
    );
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((style, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-[#1AD6BB] rounded-full opacity-20"
          style={style}
        />
      ))}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); opacity: 0; }
          10% { opacity: 0.2; }
          90% { opacity: 0.2; }
          100% { transform: translateY(-30px) rotate(180deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
});

FloatingParticles.displayName = 'FloatingParticles';

export const AboutMeModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showContent, setShowContent] = useState(false);
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
      setTimeout(() => setIsVisible(true), 50);
      setTimeout(() => setShowContent(true), 300);
    } else {
      setShowContent(false);
      setIsVisible(false);
    }
  }, [isOpen]);

  return (
    <>
      {/* Enhanced Overlay with gradient and backdrop blur */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-500 backdrop-blur-md ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        style={{
          background: isOpen
            ? "radial-gradient(circle at center, rgba(35, 71, 70, 0.15), rgba(0, 0, 0, 0.7))"
            : "transparent",
        }}
      />

      {/* Enhanced Modal */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-lg z-50 transform transition-all duration-500 ease-out overflow-hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Background with animated gradient and blur */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e] via-[#1a1a2e]/95 to-[#1a1a2e] backdrop-blur-xl" />

        {/* Animated border gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#1AD6BB]/20 opacity-60" />
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#CB399E] via-[#2E5677] to-transparent" />

        {/* Floating particles */}
        <FloatingParticles />

        {/* Content container */}
        <div className="relative h-full flex flex-col max-h-screen">
          {/* Enhanced Header */}
          <div
            className={`relative flex items-center justify-between p-6 border-b border-[#848792]/20 transform transition-all duration-700 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "-translate-y-4 opacity-0"
            }`}
          >
            {/* Header background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#CB399E]/5 to-[#1AD6BB]/5 opacity-50" />

            <div className="flex items-center space-x-3 relative z-10">
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#CB399E]/20 to-[#1AD6BB]/20 flex items-center justify-center border border-[#1AD6BB]/20 shadow-lg">
                <User className="w-5 h-5 text-[#1AD6BB]" />
                {/* Icon glow */}
                <div className="absolute inset-0 bg-[#1AD6BB]/10 rounded-xl blur-sm" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#DEE4E4] tracking-wide">
                  Sobre mí
                </h2>
                <div className="flex items-center space-x-1 mt-1">
                  <Eye className="w-3 h-3 text-[#848792] opacity-60" />
                  <span className="text-xs text-[#848792] opacity-80">
                    Desarrollador Full-Stack
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="group relative p-3 rounded-xl hover:bg-[#29293f]/60 transition-all duration-300 border border-transparent hover:border-[#848792]/20 shadow-lg hover:shadow-xl"
            >
              <X className="w-5 h-5 text-[#848792] group-hover:text-[#DEE4E4] transition-colors duration-300 group-hover:scale-110" />
              {/* Button glow effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#CB399E]/0 to-[#1AD6BB]/0 group-hover:from-[#CB399E]/10 group-hover:to-[#1AD6BB]/10 transition-all duration-300" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#1AD6BB]/30 scrollbar-track-transparent">
            <div
              className={`p-6 transform transition-all duration-1000 ${
                showContent
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
            >
              {/* Content card with gradient background */}
              <div className="relative rounded-2xl p-6 border border-[#848792]/20 bg-gradient-to-br from-[#1a1a2e]/80 to-[#1a1a2e]/60 backdrop-blur-sm shadow-2xl overflow-hidden">
                {/* Card background effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#CB399E]/3 via-transparent to-[#1AD6BB]/3" />
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#CB399E] via-[#2E5677] to-[#1AD6BB] opacity-60" />

                {/* Content */}
                <div className="relative z-10">
                  {/* Sparkles icon for visual interest */}
                  <div className="flex items-center space-x-2 mb-4">
                    <Sparkles className="w-4 h-4 text-[#1AD6BB] animate-pulse" />
                    <span className="text-[#848792] text-sm font-medium tracking-wide">
                      PERFIL PROFESIONAL
                    </span>
                  </div>

                  {/* Main content with enhanced styling */}
                  <div className="space-y-6">
                    <div className="relative">
                      <p className="text-[#DEE4E4] leading-relaxed text-base">
                        ¡Hola! Soy{" "}
                        <span className="font-semibold text-cyan-300">
                          Zelen
                        </span>
                        , un desarrollador fullstack con pasión por crear
                        soluciones web que realmente sirvan. No solo me enfoco
                        en que se vean bien, sino en que funcionen y resuelvan
                        problemas reales.
                      </p>
                      {/* Subtle glow line */}
                      <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-[#1AD6BB]/40 to-transparent rounded-full" />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-[#1AD6BB] rounded-full animate-pulse" />
                        <h3 className="text-[#1AD6BB] font-bold text-lg tracking-wide">
                          Stack principal
                        </h3>
                      </div>
                      <div className="grid gap-2 pl-4">
                        <div className="flex items-start space-x-3 group">
                          <div className="w-1.5 h-1.5 bg-[#CB399E] rounded-full mt-2 group-hover:scale-150 transition-transform duration-300" />
                          <span className="text-[#DEE4E4] leading-relaxed group-hover:text-[#1AD6BB] transition-colors duration-300">
                            Backend con{" "}
                            <span className="text-yellow-300">
                              Python/Django
                            </span>
                          </span>
                        </div>
                        <div className="flex items-start space-x-3 group">
                          <div className="w-1.5 h-1.5 bg-[#CB399E] rounded-full mt-2 group-hover:scale-150 transition-transform duration-300" />
                          <span className="text-[#DEE4E4] leading-relaxed group-hover:text-[#1AD6BB] transition-colors duration-300">
                            Frontend con{" "}
                            <span className="text-yellow-300">
                              JavaScript/jQuery
                            </span>
                          </span>
                        </div>
                        <div className="flex items-start space-x-3 group">
                          <div className="w-1.5 h-1.5 bg-[#CB399E] rounded-full mt-2 group-hover:scale-150 transition-transform duration-300" />
                          <span className="text-[#DEE4E4] leading-relaxed group-hover:text-[#1AD6BB] transition-colors duration-300">
                            Contenedores y despliegue con{" "}
                            <span className="text-blue-300">Docker</span>
                          </span>
                        </div>
                        <div className="flex items-start space-x-3 group">
                          <div className="w-1.5 h-1.5 bg-[#CB399E] rounded-full mt-2 group-hover:scale-150 transition-transform duration-300" />
                          <span className="text-[#DEE4E4] leading-relaxed group-hover:text-[#1AD6BB] transition-colors duration-300">
                            Optimización de código y experiencia de usuario
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-[#CB399E] rounded-full animate-pulse" />
                        <h3 className="text-[#CB399E] font-bold text-lg tracking-wide">
                          Formación & Filosofía
                        </h3>
                      </div>
                      <div className="relative pl-4">
                        <p className="text-[#DEE4E4] leading-relaxed text-base">
                          Actualmente estudio{" "}
                          <span className="text-green-300">
                            Ciencia de Datos
                          </span>
                          , porque creo que el desarrollo va más allá del
                          código: se trata de entender datos, contextos y
                          usuarios.
                        </p>
                        <p className="text-[#DEE4E4] leading-relaxed text-base mt-2">
                          Me gusta construir software lógico, útil y mantenible,
                          sin perder de vista el lado humano del desarrollo.
                        </p>
                        {/* Quote-like accent */}
                        <div className="absolute -left-2 top-0 w-1 h-full bg-gradient-to-b from-[#CB399E]/40 to-transparent rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating accent elements */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-[#1AD6BB] rounded-full opacity-60 animate-ping" />
                <div className="absolute bottom-4 left-4 w-1 h-1 bg-[#CB399E] rounded-full opacity-40" />
              </div>

              {/* Bottom accent bar */}
              <div className="mt-6 flex items-center justify-center space-x-2">
                <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-[#CB399E] to-transparent opacity-60" />
                <Code className="w-4 h-4 text-[#1AD6BB] opacity-80" />
                <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-[#1AD6BB] to-transparent opacity-60" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
