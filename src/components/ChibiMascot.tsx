import React from 'react';
import {
  Compass,
  Map as MapIcon,
  Search,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  PartyPopper,
  Zap,
  Atom,
  Bot,
} from 'lucide-react';

export type ChibiExpression =
  | 'idle'
  | 'waving'
  | 'pointing'
  | 'thinking'
  | 'surprised'
  | 'celebrating'
  | 'excited'
  | 'warning'
  | 'greeting'
  | 'scanning'
  | 'treasure';

interface ChibiMascotProps {
  expression?: ChibiExpression;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'chibi_scientist' | 'chibi_robot' | 'svg_scientist';
  type?: 'chibi_scientist' | 'chibi_robot' | 'svg_scientist';
  className?: string;
  showSpeechBubble?: boolean;
  speechText?: string;
  accessory?: 'magnifier' | 'map' | 'compass' | 'backpack' | 'flask';
  showHoloPedestal?: boolean;
}

export const ChibiMascot: React.FC<ChibiMascotProps> = ({
  expression = 'idle',
  size = 'md',
  variant,
  type,
  className = '',
  showSpeechBubble = false,
  speechText,
  accessory,
  showHoloPedestal = true,
}) => {
  const activeVariant = variant || type || 'chibi_scientist';
  const sizeMap = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-44 h-44',
  };

  const imageMap = {
    chibi_scientist: '/src/assets/images/chibi_mascot_1791188388736.jpg',
    chibi_robot: '/src/assets/images/chibi_robot_1791188420275.jpg',
    svg_scientist: '',
  };

  // Expression Badge Icon & Animation
  const getExpressionBadge = () => {
    switch (expression) {
      case 'celebrating':
      case 'excited':
        return { icon: <PartyPopper className="w-3.5 h-3.5 text-amber-300" />, label: 'Tuyệt đỉnh!', border: 'border-amber-400 bg-amber-950', anim: 'animate-bounce' };
      case 'warning':
        return { icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-300" />, label: 'Cẩn thận!', border: 'border-rose-400 bg-rose-950', anim: 'animate-pulse' };
      case 'thinking':
        return { icon: <Lightbulb className="w-3.5 h-3.5 text-yellow-300" />, label: 'Suy ngẫm...', border: 'border-yellow-400 bg-yellow-950', anim: 'animate-spin' };
      case 'surprised':
        return { icon: <Zap className="w-3.5 h-3.5 text-cyan-300" />, label: 'Đột phá!', border: 'border-cyan-400 bg-cyan-950', anim: 'animate-ping' };
      case 'pointing':
        return { icon: <Compass className="w-3.5 h-3.5 text-indigo-300" />, label: 'Hướng kia!', border: 'border-indigo-400 bg-indigo-950', anim: 'animate-pulse' };
      case 'waving':
      case 'greeting':
        return { icon: <Sparkles className="w-3.5 h-3.5 text-sky-300" />, label: 'Chào bạn!', border: 'border-sky-400 bg-sky-950', anim: 'animate-pulse' };
      case 'scanning':
        return { icon: <Search className="w-3.5 h-3.5 text-cyan-300" />, label: 'Đang quét...', border: 'border-cyan-400 bg-cyan-950', anim: 'animate-spin' };
      case 'treasure':
        return { icon: <span className="text-xs">💎</span>, label: 'Kho báu!', border: 'border-amber-400 bg-amber-950', anim: 'animate-bounce' };
      case 'idle':
      default:
        return { icon: <Atom className="w-3.5 h-3.5 text-cyan-300" />, label: 'Sẵn sàng', border: 'border-cyan-400 bg-cyan-950', anim: '' };
    }
  };

  const badge = getExpressionBadge();

  return (
    <div className={`relative inline-flex flex-col items-center select-none ${className}`}>
      {/* Sci-Fi Holographic Speech Bubble */}
      {showSpeechBubble && speechText && (
        <div className="mb-3 relative bg-slate-900/95 border-2 border-cyan-400 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.4)] max-w-xs text-center animate-bounce-gentle z-20 backdrop-blur-md">
          <div className="flex items-center justify-center gap-1.5 mb-1 text-[10px] font-mono uppercase text-cyan-300 tracking-wider">
            <Bot className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>AI COMPANION • ROBO-PEK</span>
          </div>
          <p className="leading-relaxed text-slate-100 font-medium">{speechText}</p>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-slate-900 border-r-2 border-b-2 border-cyan-400 rotate-45" />
        </div>
      )}

      {/* Main Avatar Container with 3D Depth */}
      <div className={`${sizeMap[size]} relative filter drop-shadow-2xl transition-transform hover:scale-110 duration-300 group`}>
        {/* Glow Ring & Theme Rim */}
        <div className="w-full h-full rounded-full p-1 bg-gradient-to-tr from-cyan-400 via-indigo-500 to-purple-500 shadow-[0_0_20px_rgba(6,182,212,0.5)]">
          <img
            src={imageMap[activeVariant === 'chibi_robot' ? 'chibi_robot' : 'chibi_scientist']}
            alt="PeK Science Companion"
            referrerPolicy="no-referrer"
            onError={(e) => {
              // Graceful fallback if offline local path isn't reached
              (e.target as HTMLElement).style.display = 'none';
            }}
            className="w-full h-full object-cover rounded-full border-2 border-cyan-200/80 shadow-inner bg-slate-900"
          />
        </div>

        {/* Expression Badge */}
        <span
          className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-full border-2 ${badge.border} flex items-center justify-center text-xs shadow-lg z-10 ${badge.anim}`}
          title={badge.label}
        >
          {badge.icon}
        </span>

        {/* Optional Accessory Pin */}
        {accessory && (
          <span className="absolute -top-1 -left-1 w-6 h-6 rounded-full bg-slate-900 border border-amber-400 flex items-center justify-center text-xs shadow-md z-10">
            {accessory === 'magnifier' && '🔍'}
            {accessory === 'map' && '🗺️'}
            {accessory === 'compass' && '🧭'}
            {accessory === 'backpack' && '🎒'}
            {accessory === 'flask' && '🧪'}
          </span>
        )}
      </div>

      {/* 3D Holographic Base Pedestal (Sci-Fi Light Emitter) */}
      {showHoloPedestal && (
        <div className="relative -mt-2 w-16 h-3 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-2 rounded-full bg-cyan-400/40 blur-sm animate-pulse" />
          <div className="absolute inset-0 w-12 h-1 mx-auto rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
        </div>
      )}
    </div>
  );
};
