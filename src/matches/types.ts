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

export const HistoryAction = {
  MATCH_CREATED: "match-created",
  SCORE_UPDATED: "score-updated",
  MATCH_FINISHED: "match-finished",
} as const;

export type HistoryAction = (typeof HistoryAction)[keyof typeof HistoryAction];

interface HistoryEventBase {
  id: number;
  matchId: number;
  homeTeam: string;
  awayTeam: string;
  occurredAt: number;
}

export interface MatchCreatedEvent extends HistoryEventBase {
  type: typeof HistoryAction.MATCH_CREATED;
  homeScore: number;
  awayScore: number;
}

export interface ScoreUpdatedEvent extends HistoryEventBase {
  type: typeof HistoryAction.SCORE_UPDATED;
  previousHomeScore: number;
  previousAwayScore: number;
  homeScore: number;
  awayScore: number;
}

export interface MatchFinishedEvent extends HistoryEventBase {
  type: typeof HistoryAction.MATCH_FINISHED;
}

export type HistoryEvent =
  MatchCreatedEvent | ScoreUpdatedEvent | MatchFinishedEvent;

export interface HistoryRecord {
  events: HistoryEvent[];
  nextEventId: number;
}

export interface Scoreboard {
  matches: Match[];
  events: HistoryEvent[];
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
