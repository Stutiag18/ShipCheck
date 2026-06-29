"use client";

interface ScoreDisplayProps {
  score: number;
  size?: "sm" | "md" | "lg";
  label?: string;
}

export default function ScoreDisplay({ score, size = "md", label }: ScoreDisplayProps) {
  const getColor = (s: number) => {
    if (s >= 8) return "text-green-600 dark:text-green-400";
    if (s >= 6) return "text-yellow-600 dark:text-yellow-400";
    if (s >= 4) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };

  const sizes = {
    sm: "text-2xl",
    md: "text-4xl",
    lg: "text-6xl",
  };

  return (
    <div className="flex flex-col items-center">
      <span className={`${sizes[size]} font-bold ${getColor(score)}`}>
        {score.toFixed(1)}
      </span>
      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        {label || "out of 10"}
      </span>
    </div>
  );
}
