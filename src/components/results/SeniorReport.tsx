"use client";

import Card from "@/components/ui/Card";
import ScoreDisplay from "./ScoreDisplay";
import { SeniorReportResult } from "@/types/evaluation";

interface SeniorReportProps {
  report: SeniorReportResult;
}

export default function SeniorReport({ report }: SeniorReportProps) {
  return (
    <Card padding="lg" className="border-indigo-200 dark:border-indigo-800">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Senior Evaluator Report</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Synthesized from all panel feedback</p>
        </div>
        <ScoreDisplay score={report.overallScore} size="md" label="Overall Score" />
      </div>

      <div className="mb-6">
        <p className="text-gray-700 dark:text-gray-300">{report.summary}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="font-semibold text-green-700 dark:text-green-400 mb-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Strengths
          </h3>
          <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
            {report.strengths}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Areas for Improvement
          </h3>
          <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
            {report.improvements}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold text-indigo-700 dark:text-indigo-400 mb-2 flex items-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          Action Items
        </h3>
        <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
          {report.actionItems}
        </div>
      </div>

      {report.rewrite && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="font-semibold text-purple-700 dark:text-purple-400 mb-2">Suggested Rewrite</h3>
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-sm text-gray-800 dark:text-gray-200 whitespace-pre-line">
            {report.rewrite}
          </div>
        </div>
      )}
    </Card>
  );
}
