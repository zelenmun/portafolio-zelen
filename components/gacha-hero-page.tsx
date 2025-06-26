"use client";

import { useState } from "react";
import {
  Mail,
  Linkedin,
  Github,
  Info,
} from "lucide-react";
import { SkillEquipmentModal } from "./skill-equipment-modal";
import { StatsPanel } from "./stats-panel";
import { EquipmentSlot } from "./equipment-slot";
import { GitHubProfile } from './githubprofile';
import { GitHubContributions } from "./github-contributions";
import { AboutMeModal } from "./aboutme-modal";

interface DeveloperData {
  nombre: string;
  titulo: string;
  nivel: number;
  experiencia_actual: string;
  experiencia_maxima: string;
  rareza_nivel: number;
  avatar_url: string;
  attack: number;
  defense: number;
  stamina: number;
}

interface Equipment {
  id: number;
  nombre: string;
  tipo: string;
  rareza: string;
  icono: string;
  anos_uso: number;
  proyectos_relacionados: number;
  nivel: number;
  skill1: string;
  skill2: string;
  skill3: string;
}

// Static developer data
const developerData: DeveloperData = {
  nombre: "OSCAR MORÁN",
  titulo: "Full Stack Developer",
  nivel: 85,
  experiencia_actual: "Junior",
  experiencia_maxima: "Senior",
  rareza_nivel: 5,
  avatar_url: "/001.jpg?height=400&width=300",
  attack: 2850,
  defense: 1240,
  stamina: 45600,
};

// Static equipment data
const equipmentData: Equipment[] = [
  {
    id: 1,
    nombre: "Python | Django",
    tipo: "Backend",
    rareza: "Legendario",
    icono: "python",
    anos_uso: 1,
    proyectos_relacionados: 3,
    nivel: 45,
    skill1: "Análisis de Datos",
    skill2: "Desarrollo Web",
    skill3: "Automatización",
  },
  {
    id: 2,
    nombre: "React",
    tipo: "Fullstack",
    rareza: "Épico",
    icono: "react",
    anos_uso: 1,
    proyectos_relacionados: 3,
    nivel: 20,
    skill1: "Desarrollo de Interfaces",
    skill2: "Componentes Reutilizables",
    skill3: "Gestión de Estado",
  },
  {
    id: 3,
    nombre: "Javascript | jQuery",
    tipo: "Frontend",
    rareza: "Raro",
    icono: "javascript",
    anos_uso: 2,
    proyectos_relacionados: 6,
    nivel: 60,
    skill1: "Manipulación del DOM",
    skill2: "Eventos y Asincronía",
    skill3: "Desarrollo de Plugins",
  },
  {
    id: 4,
    nombre: "Docker | Containerization",
    tipo: "DevOps",
    rareza: "Raro",
    icono: "docker",
    anos_uso: 0,
    proyectos_relacionados: 1,
    nivel: 10,
    skill1: "Despliegue de Aplicaciones",
    skill2: "Aislamiento de Entornos",
    skill3: "Escalabilidad",
  },
  {
    id: 5,
    nombre: "Database Management",
    tipo: "Database",
    rareza: "Épico",
    icono: "database",
    anos_uso: 2,
    proyectos_relacionados: 7,
    nivel: 60,
    skill1: "SQL",
    skill2: "Optimización de Consultas",
    skill3: "PostgreSQL, MySQL, MongoDB",
  },
  {
    id: 6,
    nombre: "Mantenimiento y Soporte",
    tipo: "Logro",
    rareza: "Legendario",
    icono: "devops",
    anos_uso: 2,
    proyectos_relacionados: 7,
    nivel: 70,
    skill1: "Resolución de Problemas",
    skill2: "Actualizaciones de Seguridad",
    skill3: "Documentación",
  },
  {
    id: 7,
    nombre: "Adaptabilidad",
    tipo: "Logro",
    rareza: "Épico",
    icono: "medal",
    anos_uso: 1,
    proyectos_relacionados: 0,
    nivel: 85,
    skill1: "Aprendizaje Continuo",
    skill2: "Aprendizaje Rápido",
    skill3: "Trabajo en Equipo",
  },
  {
    id: 8,
    nombre: "Optimización de Código",
    tipo: "Habilidad",
    rareza: "Raro",
    icono: "tendencia",
    anos_uso: 2,
    proyectos_relacionados: 3,
    nivel: 75,
    skill1: "Refactorización",
    skill2: "Mejora de Rendimiento",
    skill3: "Código Limpio",
  },
];

export function GachaHeroPage() {
  const [selectedSkill, setSelectedSkill] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="min-h-screen bg-[#0C0B0C] overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23CB399E' fillOpacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
          }}
        ></div>
      </div>

      {/* Header - Improved responsive design */}
      <header className="relative z-10 flex items-center justify-between p-3 sm:p-4 lg:p-6">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-[#1AD6BB] to-[#CB399E] bg-clip-text text-transparent leading-tight">
              ZELEN DEVELOPMENT
            </div>
            <div className="w-6 sm:w-8 h-1 bg-gradient-to-r from-[#1AD6BB] to-[#CB399E] rounded-full"></div>
          </div>
        </div>
      </header>

      {/* Main Content - Improved mobile layout */}
      <div className="relative z-10 flex flex-col lg:flex-row pb-20 lg:pb-0">
        {/* Left Panel - Equipment (Mobile: appears at top) */}
        <div className="w-full lg:w-[400px] xl:w-[500px] order-4 lg:order-none">
          <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
            {/* Equipment Section */}
            <div className="bg-[#29293f]/30 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-[#848792]/30">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-[#DEE4E4] font-bold text-sm sm:text-base">
                  SKILLS
                </h3>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
                {equipmentData.map((item) => (
                  <EquipmentSlot key={item.id} equipment={item} />
                ))}
              </div>
            </div>

            {/* GitHub Section */}
            <GitHubProfile />
          </div>
        </div>

        {/* Mobile-first: Character section comes first */}
        <div className="flex-1 order-2 lg:order-none">
          {/* Character Display */}
          <div className="flex flex-col items-center justify-center p-3 sm:p-4 lg:p-8">
            {/* Character Info & Avatar */}
            <div className="flex flex-col items-center space-y-3 sm:space-y-4 lg:space-y-6 w-full max-w-sm sm:max-w-md lg:max-w-none">
              {/* Name and Title */}
              <div className="text-center w-full">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-[#DEE4E4] mb-1 sm:mb-2 leading-tight">
                  {developerData.nombre}
                </h1>
                <p className="text-[#848792] text-xs sm:text-sm lg:text-base">
                  {developerData.titulo}
                </p>
              </div>

              {/* Character Avatar - Responsive sizing */}
              <div className="relative w-full max-w-xs sm:max-w-sm lg:max-w-none">
                {/* Main Avatar Container */}
                <div className="relative w-full aspect-[4/5] sm:w-64 sm:h-80 md:w-80 md:h-96 lg:w-96 lg:h-[550px] mx-auto rounded-xl sm:rounded-2xl overflow-hidden border-2 sm:border-4 border-[#1AD6BB] shadow-[0_10px_30px_rgba(214,26,114,0.125)] transition delay-200 m-1">
                <img
                  src={developerData.avatar_url || "/placeholder.svg"}
                  alt={developerData.nombre}
                  className="w-full h-full object-cover"
                />

                {/* About Me Button - Positioned at top-right of image */}
                <button
                  onClick={() => setIsAboutModalOpen(true)}
                  className="absolute top-2 right-2 sm:top-3 sm:right-3 lg:top-4 lg:right-4 bg-[#D61A72]/20 backdrop-blur-sm border border-[#D61A72]/50 rounded-lg p-2 sm:p-2.5 lg:p-3 hover:bg-[#D61A72]/30 transition-all duration-300 hover:scale-105 group"
                >
                  <Info className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-[#D61A72] group-hover:text-white transition-colors duration-300" />
                </button>

                {/* Floating Particles Effect */}
                <div className="absolute inset-0 opacity-30 pointer-events-none overflow-hidden">
                  <div className="absolute w-2 h-2 bg-[#1AD6BB] rounded-full animate-float-1" style={{ top: '20%', left: '10%', animationDelay: '0s' }}></div>
                  <div className="absolute w-1.5 h-1.5 bg-[#D61A72] rounded-full animate-float-2" style={{ top: '60%', left: '80%', animationDelay: '1s' }}></div>
                  <div className="absolute w-1 h-1 bg-[#D3D61A] rounded-full animate-float-3" style={{ top: '40%', left: '70%', animationDelay: '2s' }}></div>
                  <div className="absolute w-2.5 h-2.5 bg-[#1AD6BB]/50 rounded-full animate-float-1" style={{ top: '80%', left: '20%', animationDelay: '0.5s' }}></div>
                  <div className="absolute w-1.5 h-1.5 bg-[#D61A72]/60 rounded-full animate-float-2" style={{ top: '30%', left: '90%', animationDelay: '1.5s' }}></div>
                  <div className="absolute w-1 h-1 bg-[#D3D61A]/70 rounded-full animate-float-3" style={{ top: '70%', left: '15%', animationDelay: '2.5s' }}></div>
                </div>

                {/* Gradient Overlay Animation */}
                <div
                  className="absolute inset-0 opacity-10 pointer-events-none"
                  style={{
                    background: `
                      radial-gradient(circle at 30% 40%, rgba(26, 214, 187, 0.4) 0%, transparent 50%),
                      radial-gradient(circle at 70% 60%, rgba(214, 26, 114, 0.3) 0%, transparent 50%),
                      radial-gradient(circle at 50% 80%, rgba(211, 214, 26, 0.2) 0%, transparent 50%)
                    `,
                    animation: "gradientShift 4s ease-in-out infinite alternate"
                  }}
                ></div>
              </div>
                {/* Social Buttons */}
                <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4 mt-4 relative w-full lg:w-96 mx-auto">
                  <button onClick={() => window.open("https://github.com/zelenmun", "_blank")} className="hover:drop-shadow-[0_0_20px_rgba(203,57,158,1)] w-full text-white font-bold py-3 sm:py-4 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-[#B1336E] text-sm sm:text-base drop-shadow-[0_0_8px_rgba(203,57,158,0.8)] hover:scale-110 hover:rotate-1 hover:z-10 active:scale-95 active:rotate-0">
                    <Github className="inline-block w-8 h-8 hover:drop-shadow-[0_0_8px_rgba(203,57,158,0.8)] transition-all duration-300" />
                  </button>
                  <button onClick={() => window.open("https://www.linkedin.com/in/oscar-moran-gomez/", "_blank")} className="hover:drop-shadow-[0_0_20px_rgba(26,214,187,1)] w-full text-white font-bold py-3 sm:py-4 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-[#26AA9B] text-sm sm:text-base drop-shadow-[0_0_8px_rgba(26,214,187,0.6)] hover:scale-110 hover:rotate-1 hover:z-10 active:scale-95 active:rotate-0">
                    <Linkedin className="inline-block w-8 h-8 hover:drop-shadow-[0_0_8px_rgba(26,214,187,0.6)] transition-all duration-300" />
                  </button>
                  <button onClick={() => window.open("mailto:oscar_gomez2018@hotmail.com")} className="hover:drop-shadow-[0_0_20px_rgba(211,214,26,1)] w-full text-white font-bold py-3 sm:py-4 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-[#B4B636] text-sm sm:text-base drop-shadow-[0_0_8px_rgba(211,214,26,0.7)] hover:scale-110 hover:rotate-1 hover:z-10 active:scale-95 active:rotate-0">
                    <Mail className="inline-block w-8 h-8 hover:drop-shadow-[0_0_8px_rgba(211,214,26,0.7)] transition-all duration-300" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Level and Stats */}
        <div className="w-full lg:w-[400px] xl:w-[600px] order-3 lg:order-none">
          <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
            {/* Level Info */}
            <GitHubContributions username="zelenmun" showMockData={false} />

            {/* Stats Panel */}
            <StatsPanel />
          </div>
        </div>
      </div>

      {/* Modals */}
      <SkillEquipmentModal
        skill={selectedSkill}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <AboutMeModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />

      {/* Add shimmer animation styles */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
      

      <style jsx>{`
        @keyframes float-1 {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.3; }
          25% { transform: translateY(-20px) translateX(10px); opacity: 0.8; }
          50% { transform: translateY(-40px) translateX(-5px); opacity: 0.5; }
          75% { transform: translateY(-20px) translateX(-15px); opacity: 0.9; }
        }
        
        @keyframes float-2 {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); opacity: 0.4; }
          33% { transform: translateY(-30px) translateX(-10px) rotate(120deg); opacity: 0.7; }
          66% { transform: translateY(-15px) translateX(15px) rotate(240deg); opacity: 0.6; }
        }
        
        @keyframes float-3 {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.2; }
          50% { transform: translateY(-50px) scale(1.5); opacity: 0.8; }
        }
        
        @keyframes gradientShift {
          0% { 
            background: radial-gradient(circle at 30% 40%, rgba(26, 214, 187, 0.4) 0%, transparent 50%),
                        radial-gradient(circle at 70% 60%, rgba(214, 26, 114, 0.3) 0%, transparent 50%),
                        radial-gradient(circle at 50% 80%, rgba(211, 214, 26, 0.2) 0%, transparent 50%);
          }
          100% { 
            background: radial-gradient(circle at 70% 30%, rgba(26, 214, 187, 0.3) 0%, transparent 50%),
                        radial-gradient(circle at 40% 70%, rgba(214, 26, 114, 0.4) 0%, transparent 50%),
                        radial-gradient(circle at 60% 20%, rgba(211, 214, 26, 0.3) 0%, transparent 50%);
          }
        }
        
        .animate-float-1 { animation: float-1 6s ease-in-out infinite; }
        .animate-float-2 { animation: float-2 8s ease-in-out infinite; }
        .animate-float-3 { animation: float-3 5s ease-in-out infinite; }
      `}</style>
    </div>
  );
}