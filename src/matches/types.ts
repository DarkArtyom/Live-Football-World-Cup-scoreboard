import type { HistoryAction, MatchStatus } from "./constants";

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

export const ScoreboardStatus = {
  LOADING: "loading",
  READY: "ready",
  ERROR: "error",
} as const;

export type ScoreboardStatus =
  (typeof ScoreboardStatus)[keyof typeof ScoreboardStatus];

export interface Scoreboard {
  matches: Map<number, Match>;
  events: HistoryEvent[];
  status: ScoreboardStatus;
  error: string | null;
  retry: () => void;
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
