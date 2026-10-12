export const MatchStatus = {
  IN_PROGRESS: "in-progress",
  FINISHED: "finished",
} as const;

export type MatchStatus = (typeof MatchStatus)[keyof typeof MatchStatus];

export const MatchEditorMode = {
  CREATE: "create",
  EDIT: "edit",
} as const;

export const MatchRowAction = {
  EDIT: "edit",
  FINISH: "finish",
} as const;

export type MatchRowAction =
  (typeof MatchRowAction)[keyof typeof MatchRowAction];

export type MatchEditorMode =
  (typeof MatchEditorMode)[keyof typeof MatchEditorMode];

export interface Match {
  id: number;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: MatchStatus;
  startedAt: number;
  finishedAt?: number;
}

export interface CreateMatchInput {
  homeTeam: string;
  awayTeam: string;
}

export interface UpdateScoreInput {
  homeScore: number;
  awayScore: number;
}

export interface Scoreboard {
  matches: Match[];
  addMatch: (input: CreateMatchInput) => void;
  updateScore: (matchId: number, score: UpdateScoreInput) => void;
  finish: (matchId: number) => void;
}
export type ScoreInputValidation =
  | { isValid: true; score: UpdateScoreInput }
  | { isValid: false; error: string };

export interface PendingFinish {
  matchId: number;
  anchor: HTMLButtonElement;
}
