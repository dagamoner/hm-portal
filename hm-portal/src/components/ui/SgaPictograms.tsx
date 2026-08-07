import React from 'react';
import { 
  Flame, 
  Skull, 
  Droplet, 
  Bomb, 
  HeartCrack,
  Wind,
  CircleDashed,
  Leaf
} from 'lucide-react';

export type SgaCode = 'SGA01' | 'SGA02' | 'SGA03' | 'SGA04' | 'SGA05' | 'SGA06' | 'SGA07' | 'SGA08' | 'SGA09';

const pictogramData: Record<SgaCode, { icon: React.ReactNode, title: string, color: string }> = {
  SGA01: { icon: <Bomb className="w-8 h-8 text-black" />, title: 'Explosivo', color: 'border-red-600' },
  SGA02: { icon: <Flame className="w-8 h-8 text-black" />, title: 'Inflamable', color: 'border-red-600' },
  SGA03: { icon: <CircleDashed className="w-8 h-8 text-black" />, title: 'Comburente', color: 'border-red-600' },
  SGA04: { icon: <Wind className="w-8 h-8 text-black" />, title: 'Gas a presión', color: 'border-red-600' },
  SGA05: { icon: <Droplet className="w-8 h-8 text-black" />, title: 'Corrosivo', color: 'border-red-600' },
  SGA06: { icon: <Skull className="w-8 h-8 text-black" />, title: 'Tóxico', color: 'border-red-600' },
  SGA07: { icon: null, title: 'Atención (Nocivo)', color: 'border-red-600' }, 
  SGA08: { icon: <HeartCrack className="w-8 h-8 text-black" />, title: 'Peligro para la salud', color: 'border-red-600' },
  SGA09: { icon: <Leaf className="w-8 h-8 text-black" />, title: 'Peligro para el medio ambiente', color: 'border-red-600' },
};

export function SgaPictogram({ code, size = "md" }: { code: string, size?: "sm" | "md" | "lg" }) {
  const safeCode = code as SgaCode;
  const data = pictogramData[safeCode];
  if (!data) return null;

  const sizeClasses = {
    sm: "w-12 h-12 p-2",
    md: "w-16 h-16 p-3",
    lg: "w-24 h-24 p-5"
  };

  const renderIcon = () => {
    if (code === 'SGA07') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="15"></line>
          <line x1="12" y1="19" x2="12.01" y2="19"></line>
        </svg>
      );
    }
    return data.icon;
  };

  return (
    <div className="flex flex-col items-center gap-1" title={data.title}>
      <div className={`rotate-45 border-4 bg-white flex items-center justify-center shadow-sm ${data.color} ${sizeClasses[size]}`}>
        <div className="-rotate-45 flex items-center justify-center">
          {renderIcon()}
        </div>
      </div>
      <span className="text-xs font-bold text-slate-700 mt-2">{code}</span>
    </div>
  );
}
