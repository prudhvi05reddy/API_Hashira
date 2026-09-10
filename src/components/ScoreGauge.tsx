import React from 'react';

interface ScoreGaugeProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  size = 110,
  strokeWidth = 9,
  label = 'ATS Score',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.min(100, Math.max(0, Math.round(score)));
  const offset = circumference - (clampedScore / 100) * circumference;

  let strokeColor = '#10b981'; // Emerald >= 85
  let bgBadgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';

  if (clampedScore < 50) {
    strokeColor = '#ef4444'; // Red
    bgBadgeColor = 'bg-rose-50 text-rose-700 border-rose-200';
  } else if (clampedScore < 75) {
    strokeColor = '#f59e0b'; // Amber
    bgBadgeColor = 'bg-amber-50 text-amber-700 border-amber-200';
  } else if (clampedScore < 85) {
    strokeColor = '#3b82f6'; // Blue
    bgBadgeColor = 'bg-blue-50 text-blue-700 border-blue-200';
  }

  return (
    <div id={`score-gauge-${clampedScore}`} className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-black text-slate-800 tracking-tight leading-none font-mono">
            {clampedScore}
          </span>
          <span className="text-[10px] uppercase font-bold text-slate-400 mt-0.5 tracking-wider">
            / 100
          </span>
        </div>
      </div>
      {label && (
        <span
          className={`mt-2 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${bgBadgeColor}`}
        >
          {label}
        </span>
      )}
    </div>
  );
};
