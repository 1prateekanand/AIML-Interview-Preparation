import React from 'react';
import {
  Brain,
  Cpu,
  Sparkles,
  Search,
  Bot,
  BarChart3,
  ShieldCheck,
  Activity,
  Zap,
  Network,
  Code2,
  Box,
} from 'lucide-react';

interface ConstellationNodeIconProps {
  name: string;
  className?: string;
  style?: React.CSSProperties;
}

export const ConstellationNodeIcon: React.FC<ConstellationNodeIconProps> = ({
  name,
  className = 'w-4 h-4',
  style,
}) => {
  switch (name) {
    case 'Brain':
      return <Brain className={className} style={style} />;
    case 'Cpu':
      return <Cpu className={className} style={style} />;
    case 'Sparkles':
      return <Sparkles className={className} style={style} />;
    case 'Search':
      return <Search className={className} style={style} />;
    case 'Bot':
      return <Bot className={className} style={style} />;
    case 'BarChart3':
      return <BarChart3 className={className} style={style} />;
    case 'ShieldCheck':
      return <ShieldCheck className={className} style={style} />;
    case 'Activity':
      return <Activity className={className} style={style} />;
    case 'Zap':
      return <Zap className={className} style={style} />;
    case 'Network':
      return <Network className={className} style={style} />;
    case 'Code2':
      return <Code2 className={className} style={style} />;
    default:
      return <Box className={className} style={style} />;
  }
};
