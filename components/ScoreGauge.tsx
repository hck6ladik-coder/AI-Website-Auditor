"use client";

import React from "react";
import { getScoreColor } from "@/lib/utils";

interface ScoreGaugeProps {
  score: number;
  label: string;
  sublabel?: string;
  size?: "sm" | "md" | "lg";
}

export function ScoreGauge({ score, label, sublabel, size = "md" }: ScoreGaugeProps) {
  const colors = getScoreColor(score);

  const dimensions = {
    sm: { size: 90, stroke: 8, radius: 36, fontSize: "text-xl", labelSize: "text-xs" },
    md: { size: 130, stroke: 10, radius: 52, fontSize: "text-3xl", labelSize: "text-sm" },
    lg: { size: 170, stroke: 12, radius: 68, fontSize: "text-4xl", labelSize: "text-base" },
  }[size];

  const circumference = 2 * Math.PI * dimensions.radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-lg backdrop-blur-sm transition-all hover:border-slate-700">
      <div className="relative flex items-center justify-center" style={{ width: dimensions.size, height: dimensions.size }}>
        <svg className="transform -rotate-90" width={dimensions.size} height={dimensions.size}>
          {/* Background circle */}
          <circle
            cx={dimensions.size / 2}
            cy={dimensions.size / 2}
            r={dimensions.radius}
            className="text-slate-800"
            strokeWidth={dimensions.stroke}
            stroke="currentColor"
            fill="transparent"
          />
          {/* Animated score circle */}
          <circle
            cx={dimensions.size / 2}
            cy={dimensions.size / 2}
            r={dimensions.radius}
            className={`transition-all duration-1000 ease-out ${colors.text}`}
            strokeWidth={dimensions.stroke}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-bold font-mono tracking-tight ${dimensions.fontSize} text-white`}>
            {score}
          </span>
          <span className="text-[10px] uppercase font-semibold text-slate-400 -mt-1">/ 100</span>
        </div>
      </div>
      <div className="text-center mt-2">
        <h4 className={`font-semibold ${dimensions.labelSize} text-slate-200`}>{label}</h4>
        {sublabel && <p className="text-xs text-slate-400 mt-0.5">{sublabel}</p>}
      </div>
    </div>
  );
}
