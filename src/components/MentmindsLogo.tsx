import React, { useState } from 'react';

interface MentmindsLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const MentmindsLogo: React.FC<MentmindsLogoProps> = ({
  className = '',
  size = 'md',
  showText = false,
}) => {
  const [imgError, setImgError] = useState(false);

  const dimensionMap = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const dim = dimensionMap[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {!imgError ? (
        <img
          src="/mentmindslogo.svg"
          alt="MENTMINDS Official Logo"
          className={`${dim} object-contain`}
          onError={() => setImgError(true)}
        />
      ) : (
        <div className={`${dim} rounded-xl bg-[#0C1836] border-2 border-[#0B6291] flex items-center justify-center p-1 shadow-md`}>
          <svg viewBox="0 0 500 500" className="w-full h-full">
            <g transform="translate(0, 20)">
              <path d="M 165 440 C 210 380 290 380 335 440 C 330 460 320 465 315 450 C 280 405 220 405 185 450 Z" fill="#7B2D8C" />
              <circle cx="85" cy="335" r="16" fill="#9E1B4E" />
              <path d="M 85 355 L 140 400 L 190 280 L 145 285 Z" fill="#9E1B4E" />
              <circle cx="420" cy="335" r="16" fill="#0C1836" />
              <path d="M 420 355 L 365 400 L 315 280 L 360 285 Z" fill="#0C1836" />
              <circle cx="120" cy="170" r="32" fill="#0B6291" />
              <path d="M 155 50 L 260 380 L 205 380 L 45 L 225 Z" fill="#0B6291" />
              <circle cx="380" cy="170" r="32" fill="#3D781D" />
              <path d="M 345 50 L 240 380 L 295 380 L 455 225 Z" fill="#3D781D" />
              <circle cx="245" cy="70" r="26" fill="#B87E13" />
              <path d="M 175 50 L 250 250 L 315 50 L 250 170 Z" fill="#B87E13" />
            </g>
          </svg>
        </div>
      )}

      {showText && (
        <div className="flex flex-col">
          <span className="font-black text-2xl tracking-tight text-white font-['Outfit'] leading-none">
            MENT<span className="text-[#3D781D]">MINDS</span>
          </span>
          <span className="text-[10px] text-slate-300 font-extrabold tracking-widest uppercase mt-1">
            Youth Mentorship & Advocacy
          </span>
        </div>
      )}
    </div>
  );
};
