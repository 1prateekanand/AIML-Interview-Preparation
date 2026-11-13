import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useUserProfile } from '../../services/userService';
import { Problem } from '../../types';

interface DashboardHeroProps {
  problems?: Problem[];
  onNavigateToProblems?: () => void;
}

export const DashboardHero: React.FC<DashboardHeroProps> = ({
  onNavigateToProblems,
}) => {
  const { currentTheme } = useTheme();
  const userProfile = useUserProfile();
  const firstName = userProfile.firstName || 'Alex';

  // State to manage smooth crossfade transition between theme hero images
  const [activeImage, setActiveImage] = useState<string>(currentTheme.heroImage);
  const [prevImage, setPrevImage] = useState<string | null>(null);
  const [isCrossfading, setIsCrossfading] = useState<boolean>(false);

  useEffect(() => {
    if (currentTheme.heroImage && currentTheme.heroImage !== activeImage) {
      setPrevImage(activeImage);
      setActiveImage(currentTheme.heroImage);
      setIsCrossfading(true);

      const timer = setTimeout(() => {
        setIsCrossfading(false);
        setPrevImage(null);
      }, 450);

      return () => clearTimeout(timer);
    }
  }, [currentTheme.heroImage, activeImage]);

  return (
    <div
      className="relative w-full rounded-2xl md:rounded-3xl border overflow-hidden shadow-2xl transition-all duration-300 min-h-[250px] sm:min-h-[270px] md:min-h-[285px] lg:min-h-[300px] flex items-center"
      style={{
        backgroundColor: '#060B14',
        borderColor: currentTheme.tokens.borderAccent,
        boxShadow: `0 16px 40px -10px ${currentTheme.tokens.accentGlow}, 0 0 0 1px ${currentTheme.tokens.borderSubtle}, inset 0 1px 0 rgba(255,255,255,0.12)`,
      }}
    >
      {/* BACKGROUND ARTWORK LAYER: Theme-Specific Robot-in-Space Hero Image */}
      <div className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden">
        {/* Previous Image fading out during theme transition */}
        {prevImage && isCrossfading && (
          <img
            src={prevImage}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover object-right sm:object-[right_center] transition-opacity duration-500 ease-in-out opacity-0 pointer-events-none select-none"
          />
        )}

        {/* Current Active Theme Image with prominent robot on the right */}
        <img
          key={activeImage}
          src={activeImage}
          alt={`Sabevia ${currentTheme.name} Hero`}
          className="absolute inset-0 w-full h-full object-cover object-right sm:object-[right_center] transition-opacity duration-500 ease-in-out opacity-100 pointer-events-none select-none"
        />

        {/* Tailored Dark Gradient Overlay: Preserves text contrast on left while leaving robot crystal clear on right */}
        <div
          className="absolute inset-0 pointer-events-none z-1"
          style={{
            background: `linear-gradient(
              90deg,
              rgba(6, 11, 20, 0.98) 0%,
              rgba(6, 11, 20, 0.92) 28%,
              rgba(6, 11, 20, 0.68) 46%,
              rgba(6, 11, 20, 0.22) 62%,
              transparent 74%
            )`,
          }}
        />

        {/* Responsive Mobile / Tablet Top-Down Readability Gradient */}
        <div
          className="absolute inset-0 pointer-events-none z-1 sm:hidden"
          style={{
            background: `linear-gradient(
              180deg,
              rgba(6, 11, 20, 0.92) 0%,
              rgba(6, 11, 20, 0.65) 55%,
              rgba(6, 11, 20, 0.3) 100%
            )`,
          }}
        />

        {/* Theme Accent Lighting Ambience */}
        <div
          className="absolute -left-12 -bottom-12 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-colors duration-500 z-1"
          style={{
            backgroundColor: currentTheme.tokens.accent,
            opacity: 0.18,
          }}
        />
      </div>

      {/* FOREGROUND CONTENT: Left content area matching Image 9 reference */}
      <div className="relative z-10 w-full px-6 sm:px-8 md:px-10 py-6 sm:py-8 flex flex-col justify-between items-start">
        {/* Brand Label: Small Sabevia Emblem + SABEVIA PATH */}
        <div className="flex items-center gap-2 mb-2 sm:mb-2.5">
          <div
            className="w-5 h-5 rounded-full p-0.5 flex items-center justify-center shrink-0 border transition-all duration-300"
            style={{
              borderColor: currentTheme.tokens.borderAccent,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              boxShadow: `0 0 10px ${currentTheme.tokens.accentGlow}`,
            }}
          >
            <img
              src="/assets/aistudio/sabevia_logo.png"
              alt="Sabevia"
              className="w-full h-full object-contain"
            />
          </div>
          <span
            className="text-[11px] font-bold tracking-widest uppercase transition-colors duration-300"
            style={{ color: currentTheme.tokens.accent }}
          >
            SABEVIA PATH
          </span>
        </div>

        {/* Welcome Heading with Dynamic Authenticated First Name */}
        <h1 className="text-2xl sm:text-3xl md:text-[32px] lg:text-[34px] font-extrabold tracking-tight leading-tight text-white drop-shadow-md">
          Welcome back,{' '}
          <span
            className="transition-colors duration-300 drop-shadow-sm font-black"
            style={{ color: currentTheme.tokens.accent }}
          >
            {firstName}!
          </span>
        </h1>

        {/* Supporting Copy */}
        <p className="mt-2 sm:mt-2.5 max-w-md sm:max-w-lg text-xs sm:text-sm leading-relaxed text-slate-300/95 font-normal drop-shadow-sm">
          Continue your AI/ML journey. Practice, learn, and master interview concepts with curated questions and detailed insights.
        </p>

        {/* Primary Call to Action Button: "Continue Practice →" */}
        <div className="mt-5 sm:mt-6">
          <button
            type="button"
            onClick={onNavigateToProblems}
            className="glow-btn inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 cursor-pointer shadow-lg active:scale-95 hover:brightness-110"
            style={{
              backgroundColor: currentTheme.tokens.accent,
              color: '#0B0B0C',
              borderColor: currentTheme.tokens.accent,
              boxShadow: `0 4px 18px -2px ${currentTheme.tokens.accentGlow}`,
            }}
            data-keep-dark="true"
          >
            <span>Continue Practice</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
