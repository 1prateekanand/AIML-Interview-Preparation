import React from 'react';
import { AimCategory } from '../../data/categories';

interface CategoryArtworkProps {
  type: AimCategory['artworkType'];
  color?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const CategoryArtwork: React.FC<CategoryArtworkProps> = ({
  type,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
  }[size];

  switch (type) {
    case 'ml-fundamentals':
      return (
        <svg viewBox="0 0 64 64" className={`${sizeClasses} shrink-0 overflow-visible`}>
          <defs>
            <filter id="glow-ml-art" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <ellipse cx="32" cy="52" rx="26" ry="7" fill="#0C1F17" />
          <path d="M12 48 L12 36 L18 32 L18 44 Z" fill="#059669" />
          <path d="M18 32 L22 35 L22 47 L18 44 Z" fill="#047857" />
          <path d="M24 48 L24 24 L30 20 L30 44 Z" fill="#10B981" filter="url(#glow-ml-art)" />
          <path d="M30 20 L34 23 L34 47 L30 44 Z" fill="#059669" />
          <path d="M36 48 L36 14 L42 10 L42 44 Z" fill="#34D399" filter="url(#glow-ml-art)" />
          <path d="M42 10 L46 13 L46 47 L42 44 Z" fill="#10B981" />
          <path d="M48 48 L48 28 L54 24 L54 44 Z" fill="#059669" />
          <path d="M54 24 L58 27 L58 47 L54 44 Z" fill="#047857" />
        </svg>
      );

    case 'deep-learning':
      return (
        <svg viewBox="0 0 64 64" className={`${sizeClasses} shrink-0 overflow-visible`}>
          <defs>
            <filter id="glow-dl-art" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <ellipse cx="32" cy="52" rx="22" ry="6" fill="#082F49" opacity="0.6" />
          <g filter="url(#glow-dl-art)">
            <path
              d="M30 18 C22 14, 12 20, 14 30 C10 36, 12 46, 22 48 C26 49, 29 46, 30 44"
              fill="none"
              stroke="#06B6D4"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M34 18 C42 14, 52 20, 50 30 C54 36, 52 46, 42 48 C38 49, 35 46, 34 44"
              fill="none"
              stroke="#38BDF8"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="24" cy="28" r="2.5" fill="#E0F2FE" />
            <circle cx="40" cy="28" r="2.5" fill="#E0F2FE" />
            <circle cx="26" cy="38" r="2.5" fill="#38BDF8" />
            <circle cx="38" cy="38" r="2.5" fill="#38BDF8" />
            <circle cx="32" cy="22" r="2" fill="#22D3EE" />
            <line x1="24" y1="28" x2="32" y2="22" stroke="#22D3EE" strokeWidth="1" />
            <line x1="40" y1="28" x2="32" y2="22" stroke="#22D3EE" strokeWidth="1" />
            <line x1="24" y1="28" x2="26" y2="38" stroke="#06B6D4" strokeWidth="1" />
            <line x1="40" y1="28" x2="38" y2="38" stroke="#06B6D4" strokeWidth="1" />
            <line x1="26" y1="38" x2="38" y2="38" stroke="#0284C7" strokeWidth="1" />
          </g>
        </svg>
      );

    case 'llm':
      return (
        <svg viewBox="0 0 64 64" className={`${sizeClasses} shrink-0 overflow-visible`}>
          <defs>
            <filter id="glow-llm-art" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <ellipse cx="32" cy="54" rx="20" ry="5" fill="#2E1065" opacity="0.6" />
          <g filter="url(#glow-llm-art)">
            <polygon points="32,10 20,30 32,24" fill="#C084FC" opacity="0.9" />
            <polygon points="32,10 44,30 32,24" fill="#A855F7" opacity="0.8" />
            <polygon points="20,30 32,24 44,30 32,36" fill="#7E22CE" opacity="0.7" />
            <polygon points="20,30 32,36 32,48 20,42" fill="#6B21A8" />
            <polygon points="44,30 32,36 32,48 44,42" fill="#581C87" />
            <rect x="23" y="34" width="18" height="10" rx="2" fill="#3B0764" stroke="#D8B4FE" strokeWidth="0.8" />
            <text x="32" y="41.5" textAnchor="middle" fill="#F3E8FF" fontSize="7" fontWeight="bold" fontFamily="monospace">
              LLM
            </text>
          </g>
        </svg>
      );

    case 'rag':
      return (
        <svg viewBox="0 0 64 64" className={`${sizeClasses} shrink-0 overflow-visible`}>
          <defs>
            <filter id="glow-rag-art" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <ellipse cx="28" cy="52" rx="16" ry="4" fill="#042F2E" opacity="0.6" />
          <g filter="url(#glow-rag-art)">
            <path d="M16 22 L16 30 C16 33 28 35 28 35 C28 35 40 33 40 30 L40 22 Z" fill="#0D9488" opacity="0.8" />
            <ellipse cx="28" cy="22" rx="12" ry="4" fill="#2DD4BF" />
            <path d="M16 32 L16 40 C16 43 28 45 28 45 C28 45 40 43 40 40 L40 32 Z" fill="#0F766E" opacity="0.8" />
            <ellipse cx="28" cy="32" rx="12" ry="4" fill="#14B8A6" />
            <path d="M16 42 L16 50 C16 53 28 55 28 55 C28 55 40 53 40 50 L40 42 Z" fill="#115E59" opacity="0.8" />
            <ellipse cx="28" cy="42" rx="12" ry="4" fill="#0D9488" />
            <circle cx="44" cy="26" r="9" fill="rgba(45, 212, 191, 0.2)" stroke="#5EEAD4" strokeWidth="2.5" />
            <line x1="51" y1="33" x2="59" y2="41" stroke="#5EEAD4" strokeWidth="3" strokeLinecap="round" />
            <circle cx="44" cy="26" r="3" fill="#FFFFFF" opacity="0.9" />
          </g>
        </svg>
      );

    case 'agents':
      return (
        <svg viewBox="0 0 64 64" className={`${sizeClasses} shrink-0 overflow-visible`}>
          <defs>
            <filter id="glow-agent-art" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <ellipse cx="32" cy="54" rx="18" ry="4" fill="#451A03" opacity="0.6" />
          <g filter="url(#glow-agent-art)">
            <circle cx="32" cy="12" r="3.5" fill="#F59E0B" />
            <line x1="32" y1="15" x2="32" y2="22" stroke="#D97706" strokeWidth="2" />
            <rect x="18" y="22" width="28" height="22" rx="8" fill="#1E293B" stroke="#F59E0B" strokeWidth="2" />
            <rect x="22" y="27" width="20" height="9" rx="3.5" fill="#0F172A" stroke="#78350F" strokeWidth="1" />
            <circle cx="27" cy="31.5" r="2.5" fill="#22D3EE" />
            <circle cx="37" cy="31.5" r="2.5" fill="#22D3EE" />
            <rect x="14" y="28" width="4" height="10" rx="2" fill="#B45309" />
            <rect x="46" y="28" width="4" height="10" rx="2" fill="#B45309" />
            <path d="M26 47 L38 47 L35 52 L29 52 Z" fill="#92400E" />
          </g>
        </svg>
      );

    case 'eval':
      return (
        <svg viewBox="0 0 64 64" className={`${sizeClasses} shrink-0 overflow-visible`}>
          <defs>
            <filter id="glow-eval-art" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <ellipse cx="32" cy="54" rx="20" ry="4" fill="#0C4A6E" opacity="0.6" />
          <g filter="url(#glow-eval-art)">
            <rect x="14" y="16" width="36" height="26" rx="4" fill="#082F49" stroke="#38BDF8" strokeWidth="2" />
            <rect x="28" y="42" width="8" height="6" fill="#0369A1" />
            <rect x="22" y="48" width="20" height="3" rx="1.5" fill="#0284C7" />
            <rect x="19" y="30" width="4" height="8" rx="1" fill="#38BDF8" />
            <rect x="25" y="24" width="4" height="14" rx="1" fill="#7DD3FC" />
            <rect x="31" y="27" width="4" height="11" rx="1" fill="#38BDF8" />
            <rect x="37" y="21" width="4" height="17" rx="1" fill="#BAE6FD" />
            <circle cx="45" cy="38" r="8" fill="rgba(14, 165, 233, 0.25)" stroke="#38BDF8" strokeWidth="2" />
            <line x1="51" y1="44" x2="57" y2="50" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        </svg>
      );

    case 'safety':
      return (
        <svg viewBox="0 0 64 64" className={`${sizeClasses} shrink-0 overflow-visible`}>
          <defs>
            <filter id="glow-sec-art" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <ellipse cx="32" cy="54" rx="18" ry="4" fill="#4C0519" opacity="0.6" />
          <g filter="url(#glow-sec-art)">
            <path
              d="M32 12 L48 18 C48 34 38 46 32 50 C26 46 16 34 16 18 Z"
              fill="#881337"
              stroke="#F43F5E"
              strokeWidth="2.5"
            />
            <rect x="26" y="29" width="12" height="10" rx="2" fill="#FFE4E6" />
            <path
              d="M28 29 L28 24 C28 21.5 36 21.5 36 24 L36 29"
              fill="none"
              stroke="#FFE4E6"
              strokeWidth="2"
            />
            <circle cx="32" cy="33.5" r="1.5" fill="#881337" />
          </g>
        </svg>
      );

    case 'mlops':
      return (
        <svg viewBox="0 0 64 64" className={`${sizeClasses} shrink-0 overflow-visible`}>
          <defs>
            <filter id="glow-ops-art" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <ellipse cx="32" cy="54" rx="20" ry="4" fill="#172554" opacity="0.6" />
          <g filter="url(#glow-ops-art)">
            <path
              d="M24 28 C24 23 29 19 34 20 C37 17 43 18 45 22 C49 22 52 26 51 30 C53 34 50 39 46 40 L22 40 C17 40 14 36 15 31 C15 28 18 25 21 25"
              fill="#1E3A8A"
              stroke="#60A5FA"
              strokeWidth="2"
            />
            <rect x="22" y="38" width="20" height="5" rx="1" fill="#3B82F6" stroke="#93C5FD" strokeWidth="1" />
            <rect x="22" y="45" width="20" height="5" rx="1" fill="#1D4ED8" stroke="#60A5FA" strokeWidth="1" />
            <circle cx="26" cy="40.5" r="1" fill="#10B981" />
            <circle cx="29" cy="40.5" r="1" fill="#38BDF8" />
            <circle cx="26" cy="47.5" r="1" fill="#10B981" />
            <circle cx="29" cy="47.5" r="1" fill="#F59E0B" />
          </g>
        </svg>
      );

    case 'inference':
      return (
        <svg viewBox="0 0 64 64" className={`${sizeClasses} shrink-0 overflow-visible`}>
          <defs>
            <filter id="glow-inf-art" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <ellipse cx="32" cy="54" rx="20" ry="4" fill="#1E1B4B" opacity="0.6" />
          <g filter="url(#glow-inf-art)">
            <polygon points="32,16 50,22 32,28 14,22" fill="#818CF8" />
            <polygon points="14,22 32,28 32,32 14,26" fill="#4338CA" />
            <polygon points="50,22 32,28 32,32 50,26" fill="#3730A3" />
            <polygon points="32,28 50,34 32,40 14,34" fill="#6366F1" />
            <polygon points="14,34 32,40 32,44 14,38" fill="#3730A3" />
            <polygon points="50,34 32,40 32,44 50,38" fill="#312E81" />
            <polygon points="32,40 50,46 32,52 14,46" fill="#4F46E5" />
            <polygon points="14,46 32,52 32,56 14,50" fill="#312E81" />
            <polygon points="50,46 32,52 32,56 50,50" fill="#1E1B4B" />
            <circle cx="32" cy="22" r="1.5" fill="#FFFFFF" />
            <circle cx="32" cy="34" r="1.5" fill="#FFFFFF" />
            <circle cx="32" cy="46" r="1.5" fill="#FFFFFF" />
          </g>
        </svg>
      );

    case 'system-design':
      return (
        <svg viewBox="0 0 64 64" className={`${sizeClasses} shrink-0 overflow-visible`}>
          <defs>
            <filter id="glow-arch-art" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <ellipse cx="32" cy="54" rx="20" ry="4" fill="#064E3B" opacity="0.6" />
          <g filter="url(#glow-arch-art)">
            <polygon points="32,14 44,20 32,26 20,20" fill="#34D399" />
            <polygon points="20,20 32,26 32,36 20,30" fill="#059669" />
            <polygon points="44,20 32,26 32,36 44,30" fill="#047857" />
            <polygon points="14,32 24,37 14,42 4,37" fill="#6EE7B7" opacity="0.9" />
            <polygon points="4,37 14,42 14,49 4,44" fill="#059669" />
            <polygon points="24,37 14,42 14,49 24,44" fill="#047857" />
            <polygon points="50,32 60,37 50,42 40,37" fill="#6EE7B7" opacity="0.9" />
            <polygon points="40,37 50,42 50,49 40,44" fill="#059669" />
            <polygon points="60,37 50,42 50,49 60,44" fill="#047857" />
            <line x1="20" y1="28" x2="14" y2="35" stroke="#34D399" strokeWidth="1.5" strokeDasharray="2 2" />
            <line x1="44" y1="28" x2="50" y2="35" stroke="#34D399" strokeWidth="1.5" strokeDasharray="2 2" />
          </g>
        </svg>
      );

    case 'coding':
      return (
        <svg viewBox="0 0 64 64" className={`${sizeClasses} shrink-0 overflow-visible`}>
          <defs>
            <filter id="glow-code-art" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <ellipse cx="32" cy="54" rx="22" ry="4" fill="#064E3B" opacity="0.6" />
          <g filter="url(#glow-code-art)">
            <rect x="15" y="16" width="34" height="23" rx="3" fill="#022C22" stroke="#10B981" strokeWidth="2" />
            <polygon points="10,41 54,41 58,47 6,47" fill="#064E3B" stroke="#34D399" strokeWidth="1" />
            <rect x="27" y="43" width="10" height="2.5" rx="0.5" fill="#047857" />
            <text
              x="32"
              y="30"
              textAnchor="middle"
              fill="#6EE7B7"
              fontSize="12"
              fontWeight="bold"
              fontFamily="monospace"
            >
              &lt;/&gt;
            </text>
          </g>
        </svg>
      );

    default:
      return null;
  }
};
