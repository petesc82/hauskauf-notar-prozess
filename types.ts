export type Language = 'es' | 'de';

export type GateLevel = 0 | 1 | 2 | 3;

export type StepStatus = 'locked' | 'available' | 'completed_pos' | 'completed_neg' | 'mitigated';

export interface EvidenceReq {
  code: string;
  label_es: string;
  label_de: string;
  required: boolean;
}

export interface Enemy {
  name_es: string;
  icon: string; // Emoji
  severity: 'high' | 'med' | 'low';
}

export interface Outcome {
  text_es: string;
  text_de: string;
  xp: number;
  next?: string[]; // IDs of next steps to unlock
  mitigation?: string[]; // IDs of mitigation steps to unlock
  stopFlag?: boolean;
}

export interface QuestStep {
  id: string;
  gate: GateLevel;
  sectionRef: string; // e.g., "A1"
  title_es: string;
  title_de: string;
  description_es: string;
  description_de: string;
  enemy?: Enemy;
  evidenceRequired?: EvidenceReq[];
  positiveOutcome: Outcome;
  negativeOutcome: Outcome;
  dependsOn?: string[]; // IDs required before this unlocks
}

export interface StepState {
  status: StepStatus;
  evidence: Record<string, boolean>; // code -> checked
  notes: string;
  date?: string;
  chosenPath?: 'pos' | 'neg';
}

export interface GameState {
  version: number;
  updatedAt: string;
  language: Language;
  steps: Record<string, StepState>; // Map stepId to state
  xp: number;
  level: number;
}

export const INITIAL_STATE: GameState = {
  version: 1,
  updatedAt: new Date().toISOString(),
  language: 'es',
  steps: {},
  xp: 0,
  level: 1,
};