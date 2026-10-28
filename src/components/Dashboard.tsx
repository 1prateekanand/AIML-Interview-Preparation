import React from 'react';
import { DashboardHero } from './dashboard/DashboardHero';
import { CategoryCards } from './dashboard/CategoryCards';
import { BottomPanels } from './dashboard/BottomPanels';
import { PageId, Problem } from '../types';

interface DashboardProps {
  onNavigate: (page: PageId) => void;
  onOpenProblem: (problem: Problem) => void;
  onSelectCategory?: (category: string) => void;
  problems?: Problem[];
}

export const Dashboard: React.FC<DashboardProps> = ({
  onNavigate,
  onOpenProblem,
  onSelectCategory,
  problems = [],
}) => {
  const handleCategoryClick = (categoryIdentifier: string) => {
    if (onSelectCategory) {
      onSelectCategory(categoryIdentifier);
    } else {
      onNavigate('problems');
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* 1. Full-Bleed 3D Animated AI Hero Banner matching reference image */}
      <DashboardHero
        problems={problems}
        onNavigateToProblems={() => onNavigate('problems')}
      />

      {/* 2. Explore AI/ML Categories (11 Category Cards) */}
      <CategoryCards problems={problems} onSelectCategory={handleCategoryClick} />

      {/* 3. Bottom Dashboard Panels: Continue Learning, Recommended for You, Recent Activity */}
      <BottomPanels
        onOpenProblem={onOpenProblem}
        onNavigateToProblems={() => onNavigate('problems')}
      />
    </div>
  );
};
