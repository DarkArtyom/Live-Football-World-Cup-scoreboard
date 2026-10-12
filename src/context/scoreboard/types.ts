import type {
  CreateMatchInput,
  HistoryEvent,
  Match,
  UpdateScoreInput,
} from "../../matches/types";
import type { ScoreboardStatus, ScoreboardActionType } from "./constants";

export interface ScoreboardState {
  matches: Map<number, Match>;
  events: HistoryEvent[];
  nextId: number;
  nextEventId: number;
  status: ScoreboardStatus;
  error: string | null;
}

export type ScoreboardAction =
  | {
      type: typeof ScoreboardActionType.HYDRATE;
      matches: Match[];
    }
  | {
      type: typeof ScoreboardActionType.FAIL;
      error: string;
    }
  | {
      type: typeof ScoreboardActionType.RETRY;
    }
  | {
      type: typeof ScoreboardActionType.ADD;
      input: CreateMatchInput;
      timestamp: number;
    }
  | {
      type: typeof ScoreboardActionType.UPDATE_SCORE;
      matchId: number;
      score: UpdateScoreInput;
      timestamp: number;
    }
  | {
      type: typeof ScoreboardActionType.FINISH;
      matchId: number;
      timestamp: number;
    };
