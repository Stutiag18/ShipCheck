"use client";

import { EvaluationStatus } from "@/types/evaluation";

interface ProgressTrackerProps {
  status: EvaluationStatus;
  completedPersonas: number;
  totalPersonas: number;
}

const STAGES = [
  { key: "PENDING", label: "Starting" },
  { key: "ANALYZING", label: "Analyzing" },
  { key: "GENERATING_PERSONAS", label: "Creating Panel" },
  { key: "EVALUATING", label: "Evaluating" },
  { key: "SYNTHESIZING", label: "Synthesizing" },
  { key: "COMPLETED", label: "Complete" },
] as const;

export default function ProgressTracker({ status, completedPersonas, totalPersonas }: ProgressTrackerProps) {
  const currentIndex = STAGES.findIndex((s) => s.key === status);
  const isFailed = status === "FAILED";

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        {STAGES.map((stage, i) => {
          const isActive = stage.key === status;
          const isComplete = i < currentIndex || status === "COMPLETED";

          return (
            <div key={stage.key} className="flex flex-col items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                  isComplete
                    ? "bg-indigo-600 text-white"
                    : isActive
                    ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 ring-2 ring-indigo-600"
                    : isFailed && isActive
                    ? "bg-red-100 text-red-700 ring-2 ring-red-500"
                    : "bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                }`}
              >
                {isComplete ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span className={`text-xs mt-1 text-center ${isActive ? "font-medium text-indigo-700 dark:text-indigo-300" : "text-gray-500 dark:text-gray-400"}`}>
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>

      {status === "ANALYZING" && (
        <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-3">
          Identifying content type and target audience...
        </p>
      )}

      {status === "EVALUATING" && totalPersonas > 0 && (
        <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-3">
          Agent {completedPersonas + 1} of {totalPersonas} evaluating...
        </p>
      )}

      {isFailed && (
        <p className="text-sm text-center text-red-600 dark:text-red-400 mt-3">
          Evaluation failed. Please try again.
        </p>
      )}
    </div>
  );
}
