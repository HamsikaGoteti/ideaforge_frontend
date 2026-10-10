import React from 'react';
import { Sparkles, GraduationCap, Rocket, CheckCircle2, Globe2 } from 'lucide-react';

const MODE_CONFIG = {
  HACKATHON: {
    label: 'Hackathon',
    badgeClass: 'badge-hackathon',
    icon: Sparkles,
  },
  COLLEGE_PROJECT: {
    label: 'College Project',
    badgeClass: 'badge-college',
    icon: GraduationCap,
  },
  STARTUP: {
    label: 'Startup',
    badgeClass: 'badge-startup',
    icon: Rocket,
  },
  VALIDATE_IDEA: {
    label: 'Validate Idea',
    badgeClass: 'badge-validate',
    icon: CheckCircle2,
  },
  OPEN_INNOVATION: {
    label: 'Open Innovation',
    badgeClass: 'badge-open',
    icon: Globe2,
  },
};

export default function ModeBadge({ mode }) {
  const config = MODE_CONFIG[mode] || {
    label: mode,
    badgeClass: 'badge-hackathon',
    icon: Sparkles,
  };
  const IconComponent = config.icon;

  return (
    <span className={`badge ${config.badgeClass}`}>
      <IconComponent size={13} />
      <span>{config.label}</span>
    </span>
  );
}
