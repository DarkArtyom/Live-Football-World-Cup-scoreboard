export const MatchStatus = {
  IN_PROGRESS: "in-progress",
  FINISHED: "finished",
} as const;

export type MatchStatus = ConstType<typeof MatchStatus>;

export const MAX_SCORE = 20;

export const MatchEditorMode = {
  CREATE: "create",
  EDIT: "edit",
} as const;

export const MatchRowAction = {
  EDIT: "edit",
  FINISH: "finish",
} as const;

export type MatchRowAction = ConstType<typeof MatchRowAction>;

export type MatchEditorMode = ConstType<typeof MatchEditorMode>;

export const HistoryAction = {
  MATCH_CREATED: "match-created",
  SCORE_UPDATED: "score-updated",
  MATCH_FINISHED: "match-finished",
} as const;

export type HistoryAction = ConstType<typeof HistoryAction>;

export const Messages = {
  BOTH_TEAM_NAMES_REQUIRED: "Both team names are required.",
  TEAMS_MUST_BE_DIFFERENT: "Home and away teams must be different.",
  TEAM_ALREADY_PLAYING: "A team cannot play in two matches at the same time.",
  BOTH_SCORES_REQUIRED: "Both scores are required.",
  SCORES_MUST_BE_WHOLE_NUMBERS: "Scores must be non-negative whole numbers.",
  SCORES_TOO_LARGE: "Scores are too large.",
  SCORE_ABOVE_LIMIT: `A score cannot be higher than ${MAX_SCORE}.`,
  USE_SCOREBOARD_ERROR: "useScoreboard must be used within ScoreboardProvider.",
  NO_MATCHES_IN_PROGRESS:
    "No matches in progress. Create a match to get started.",
  NO_ACTIVE_MATCHES_FOR_QUERY: (query: string) =>
    `No active matches found for "${query}".`,
  FINISHED_MATCHES_EMPTY: "Finished matches will appear here.",
  CHANGELOG_EMPTY: "No changelog entries yet.",
  FINISH_MATCH_CONFIRMATION: (matchId: number) =>
    `Are you sure you want to finish match #${matchId}?`,
  MATCH_CREATED: "Match created successfully.",
  MATCH_FINISHED: (matchId: number) =>
    `Match #${matchId} finished successfully.`,
  MATCH_UPDATED: (matchId: number) => `Match #${matchId} updated successfully.`,
  LOADING_MATCHES: "Loading matches",
  MATCHES_LOAD_FAILED: "Could not load matches.",
  TRY_AGAIN: "Try again",
} as const;
