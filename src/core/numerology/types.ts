export interface NumberResult {
  value: number;           // Final value (1-9, 11, 22, 33)
  masterNumber: boolean;   // Is it a Master Number?
  karmicDebt: boolean;     // Is it a Karmic Debt number?
  reductionPath: string;   // Reduction process: "29 → 2+9 → 11"
  steps: number[];         // Numeric reduction steps: [29, 11]
}

export interface PinnacleResult {
  number: number;
  startAge: number;
  endAge: number | null;   // null = rest of life
  description: string;
}

export interface ChallengeResult {
  number: number;
  startAge: number;
  endAge: number | null;
  description: string;
}

export interface NumerologyChart {
  // From birth date
  lifePath: NumberResult;
  birthday: NumberResult;
  attitude: NumberResult;

  // From full name
  expression: NumberResult;
  soulUrge: NumberResult;
  personality: NumberResult;

  // Advanced
  personalYear: NumberResult;
  personalMonth: NumberResult;
  pinnacles: PinnacleResult[];
  challenges: ChallengeResult[];
  karmicDebt: number[];
  karmicLesson: number[];
  hiddenPassion: number[];

  // Charts
  birthChart: number[][];
  inclusionChart: Record<number, number>;
}
