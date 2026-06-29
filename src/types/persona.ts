export interface GeneratedPersona {
  name: string;
  role: string;
  background: string;
  perspective: string;
  tone: string;
}

export interface AgentFeedback {
  score: number;
  reaction: string;
  strengths: string;
  improvements: string;
  suggestions: string;
}

export interface SeniorSynthesis {
  summary: string;
  overallScore: number;
  strengths: string;
  improvements: string;
  actionItems: string;
  rewrite?: string;
}
