interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
}

export default function Progress({ value, max = 100, className = "" }: ProgressProps) {
  const percentage = Math.min(100, (value / max) * 100);

  return (
    <div className={`w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 ${className}`}>
      <div
        className="bg-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
