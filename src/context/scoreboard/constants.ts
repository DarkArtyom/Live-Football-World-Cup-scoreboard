import type { ScoreboardState } from "./types";

export const ScoreboardActionType = {
  HYDRATE: "hydrate",
  FAIL: "fail",
  RETRY: "retry",
  ADD: "add",
  UPDATE_SCORE: "update-score",
  FINISH: "finish",
} as const;

export const INITIAL_MATCHES_QUERY_KEY = ["initial-matches"] as const;

export const ScoreboardStatus = {
  LOADING: "loading",
  READY: "ready",
  ERROR: "error",
} as const;

export type ScoreboardStatus =
  (typeof ScoreboardStatus)[keyof typeof ScoreboardStatus];

export const initialState: ScoreboardState = {
  matches: new Map(),
  events: [],
  nextId: 1,
  nextEventId: 1,
  status: ScoreboardStatus.LOADING,
  error: null,
};
