export type EvaluationStatus =
  | "PENDING"
  | "ANALYZING"
  | "GENERATING_PERSONAS"
  | "EVALUATING"
  | "SYNTHESIZING"
  | "COMPLETED"
  | "FAILED";

export type InputType = "text" | "image";

export interface EvaluationInput {
  content: string;
  inputType: InputType;
  imageBase64?: string;
  platform?: string;
  goal?: string;
}

export interface EvaluationResult {
  id: string;
  content: string;
  inputType: string;
  contentType: string | null;
  targetAudience: string | null;
  platform: string | null;
  goal: string | null;
  status: EvaluationStatus;
  overallScore: number | null;
  error: string | null;
  personas: PersonaResult[];
  seniorReport: SeniorReportResult | null;
  createdAt: string;
}

export interface PersonaResult {
  id: string;
  name: string;
  role: string;
  background: string;
  perspective: string;
  tone: string;
  score: number | null;
  reaction: string | null;
  strengths: string | null;
  improvements: string | null;
  suggestions: string | null;
  completed: boolean;
}

export interface SeniorReportResult {
  id: string;
  summary: string;
  overallScore: number;
  strengths: string;
  improvements: string;
  actionItems: string;
  rewrite: string | null;
}
