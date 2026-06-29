"use client";

import { useEffect, useState, useCallback, use } from "react";
import ProgressTracker from "@/components/results/ProgressTracker";
import PersonaCard from "@/components/results/PersonaCard";
import SeniorReport from "@/components/results/SeniorReport";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { EvaluationResult, EvaluationStatus } from "@/types/evaluation";

export default function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  const fetchEvaluation = useCallback(async () => {
    try {
      const res = await fetch(`/api/evaluate/${id}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setEvaluation(data);
      return data.status as EvaluationStatus;
    } catch {
      setError("Failed to load evaluation");
      return "FAILED" as EvaluationStatus;
    }
  }, [id]);

  const processNextStage = useCallback(async () => {
    if (processing) return;
    setProcessing(true);
    try {
      const res = await fetch(`/api/evaluate/${id}/process`, { method: "POST" });
      if (!res.ok) throw new Error("Processing failed");
      const data = await res.json();
      return data.status as EvaluationStatus;
    } catch {
      // Will retry on next poll
      return null;
    } finally {
      setProcessing(false);
    }
  }, [id, processing]);

  useEffect(() => {
    let active = true;
    let timeoutId: NodeJS.Timeout;

    const poll = async () => {
      if (!active) return;

      const status = await fetchEvaluation();

      if (!active) return;

      if (status === "COMPLETED" || status === "FAILED") {
        return; // Done polling
      }

      // Trigger next processing stage
      await processNextStage();

      // Poll again
      timeoutId = setTimeout(poll, 2000);
    };

    poll();

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [fetchEvaluation, processNextStage]);

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <Card>
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <a href="/evaluate">
            <Button>Try Again</Button>
          </a>
        </Card>
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Card>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
          </div>
        </Card>
      </div>
    );
  }

  const completedPersonas = evaluation.personas.filter((p) => p.completed).length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Evaluation Results</h1>
        <div className="flex flex-wrap gap-2 text-sm text-gray-500 dark:text-gray-400">
          {evaluation.contentType && (
            <span className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded">
              {evaluation.contentType}
            </span>
          )}
          {evaluation.targetAudience && (
            <span className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded">
              {evaluation.targetAudience}
            </span>
          )}
          {evaluation.platform && (
            <span className="text-gray-500 dark:text-gray-400">on {evaluation.platform}</span>
          )}
        </div>
      </div>

      {/* Progress Tracker */}
      <Card className="mb-8">
        <ProgressTracker
          status={evaluation.status}
          completedPersonas={completedPersonas}
          totalPersonas={evaluation.personas.length}
        />
      </Card>

      {/* Persona Cards */}
      {evaluation.personas.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Panel Feedback
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {evaluation.personas.map((persona) => (
              <PersonaCard key={persona.id} persona={persona} />
            ))}
          </div>
        </div>
      )}

      {/* Senior Report */}
      {evaluation.seniorReport && (
        <div className="mb-8">
          <SeniorReport report={evaluation.seniorReport} />
        </div>
      )}

      {/* Error State */}
      {evaluation.status === "FAILED" && evaluation.error && (
        <Card className="border-red-200 dark:border-red-800">
          <p className="text-red-600 dark:text-red-400 text-sm">{evaluation.error}</p>
          <a href="/evaluate" className="inline-block mt-4">
            <Button variant="secondary">Start New Evaluation</Button>
          </a>
        </Card>
      )}

      {/* Completed Actions */}
      {evaluation.status === "COMPLETED" && (
        <div className="text-center mt-8">
          <a href="/evaluate">
            <Button variant="secondary">Evaluate Another</Button>
          </a>
        </div>
      )}
    </div>
  );
}
