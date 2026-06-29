"use client";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ScoreDisplay from "./ScoreDisplay";
import { PersonaResult } from "@/types/evaluation";

interface PersonaCardProps {
  persona: PersonaResult;
}

export default function PersonaCard({ persona }: PersonaCardProps) {
  if (!persona.completed) {
    return (
      <Card className="animate-pulse">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="flex-1">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-1" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        </div>
      </Card>
    );
  }

  const getInitial = (name: string) => name.charAt(0).toUpperCase();
  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-indigo-500",
      "bg-emerald-500",
      "bg-amber-500",
      "bg-rose-500",
      "bg-violet-500",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full ${getAvatarColor(persona.name)} flex items-center justify-center text-white font-medium`}>
            {getInitial(persona.name)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">{persona.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{persona.role}</p>
          </div>
        </div>
        {persona.score !== null && <ScoreDisplay score={persona.score} size="sm" />}
      </div>

      <Badge variant="info" className="mb-3">{persona.perspective}</Badge>

      {persona.reaction && (
        <p className="text-sm italic text-gray-700 dark:text-gray-300 mb-4 border-l-2 border-indigo-300 pl-3">
          &ldquo;{persona.reaction}&rdquo;
        </p>
      )}

      {persona.strengths && (
        <div className="mb-3">
          <h4 className="text-xs font-semibold uppercase text-green-700 dark:text-green-400 mb-1">Strengths</h4>
          <p className="text-sm text-gray-700 dark:text-gray-300">{persona.strengths}</p>
        </div>
      )}

      {persona.improvements && (
        <div className="mb-3">
          <h4 className="text-xs font-semibold uppercase text-amber-700 dark:text-amber-400 mb-1">Improvements</h4>
          <p className="text-sm text-gray-700 dark:text-gray-300">{persona.improvements}</p>
        </div>
      )}

      {persona.suggestions && (
        <div>
          <h4 className="text-xs font-semibold uppercase text-blue-700 dark:text-blue-400 mb-1">Suggestions</h4>
          <p className="text-sm text-gray-700 dark:text-gray-300">{persona.suggestions}</p>
        </div>
      )}
    </Card>
  );
}
