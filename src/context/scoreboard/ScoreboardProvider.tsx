import { useReducer, type PropsWithChildren } from "react";
import {
  recordMatchCreated,
  recordMatchFinished,
  recordScoreUpdated,
} from "../../matches/history";
import type {
  CreateMatchInput,
  HistoryEvent,
  Match,
  Scoreboard,
  UpdateScoreInput,
} from "../../matches/types";
import {
  createMatch,
  finishMatch,
  updateMatchScore,
} from "../../matches/utils";
import { ScoreboardContext } from "./ScoreboardContext";

const ScoreboardActionType = {
  ADD: "add",
  UPDATE_SCORE: "update-score",
  FINISH: "finish",
} as const;

interface ScoreboardState {
  matches: Match[];
  events: HistoryEvent[];
  nextId: number;
  nextEventId: number;
}

type ScoreboardAction =
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

const initialState: ScoreboardState = {
  matches: [],
  events: [],
  nextId: 1,
  nextEventId: 1,
};

const scoreboardReducer = (
  state: ScoreboardState,
  action: ScoreboardAction,
): ScoreboardState => {
  switch (action.type) {
    case ScoreboardActionType.ADD: {
      const matches = createMatch(
        state.matches,
        action.input,
        state.nextId,
        action.timestamp,
      );
      const created = matches[matches.length - 1];
      const history = recordMatchCreated(
        state.events,
        created,
        state.nextEventId,
      );

      return {
        matches,
        events: history.events,
        nextId: state.nextId + 1,
        nextEventId: history.nextEventId,
      };
    }
    case ScoreboardActionType.UPDATE_SCORE: {
      const current = state.matches.find(
        (match) => match.id === action.matchId,
      );
      const history = recordScoreUpdated(
        state.events,
        current,
        action.score,
        action.timestamp,
        state.nextEventId,
      );

      return {
        ...state,
        matches: updateMatchScore(state.matches, action.matchId, action.score),
        events: history.events,
        nextEventId: history.nextEventId,
      };
    }
    case ScoreboardActionType.FINISH: {
      const current = state.matches.find(
        (match) => match.id === action.matchId,
      );
      const history = recordMatchFinished(
        state.events,
        current,
        action.timestamp,
        state.nextEventId,
      );

      return {
        ...state,
        matches: finishMatch(state.matches, action.matchId, action.timestamp),
        events: history.events,
        nextEventId: history.nextEventId,
      };
    }
  }
};

export const ScoreboardProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(scoreboardReducer, initialState);
  const scoreboard: Scoreboard = {
    matches: state.matches,
    events: state.events,
    addMatch: (input) =>
      dispatch({
        type: ScoreboardActionType.ADD,
        input,
        timestamp: Date.now(),
      }),
    updateScore: (matchId, score) =>
      dispatch({
        type: ScoreboardActionType.UPDATE_SCORE,
        matchId,
        score,
        timestamp: Date.now(),
      }),
    finish: (matchId) =>
      dispatch({
        type: ScoreboardActionType.FINISH,
        matchId,
        timestamp: Date.now(),
      }),
  };

  return <ScoreboardContext value={scoreboard}>{children}</ScoreboardContext>;
};
