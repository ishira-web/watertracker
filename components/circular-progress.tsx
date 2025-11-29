// water-tracker-client/components/circular-progress.tsx
import React from 'react';
import { cn } from "@/lib/utils"; // Assuming you have cn utility from Shadcn/ui setup

interface CircularProgressProps {
  progress: number; // Current progress percentage (0-100)
  size?: number; // Size of the circle (width/height), default 150
  strokeWidth?: number; // Thickness of the progress arc, default 10
  circleColor?: string; // Color of the background circle, default "stroke-gray-200"
  progressColor?: string; // Color of the progress arc, default "stroke-blue-500"
  textColor?: string; // Color of the text inside, default "text-blue-600"
  children?: React.ReactNode; // Optional content to render inside the circle
  className?: string; // Optional class name for the outer div
}

export function CircularProgress({
  progress,
  size = 150,
  strokeWidth = 10,
  circleColor = "stroke-gray-200",
  progressColor = "stroke-blue-500",
  textColor = "text-blue-600",
  children,
  className,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div
      className={cn("relative flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg
        className="transform -rotate-90" // Rotates the circle to start from the top
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Background circle */}
        <circle
          strokeWidth={strokeWidth}
          stroke="currentColor" // Uses current color to allow tailwind classes to work
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          className={circleColor}
        />
        {/* Progress arc */}
        <circle
          strokeWidth={strokeWidth}
          stroke="currentColor" // Uses current color
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          strokeLinecap="round"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
            transition: 'stroke-dashoffset 0.35s ease-out', // Smooth transition
          }}
          className={progressColor}
        />
      </svg>
      {/* Content inside the circle (e.g., text, percentage) */}
      <div className={cn("absolute flex flex-col items-center justify-center", textColor)}>
        {children ? children : <span className="text-3xl font-bold">{Math.round(progress)}%</span>}
      </div>
    </div>
  );
}