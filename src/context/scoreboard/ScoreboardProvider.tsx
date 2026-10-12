import { useReducer, type PropsWithChildren } from "react";
import {
  createMatch,
  finishMatch,
  updateMatchScore,
} from "../../matches/utils";
import type {
  CreateMatchInput,
  Match,
  Scoreboard,
  UpdateScoreInput,
} from "../../matches/types";
import { ScoreboardContext } from "./ScoreboardContext";

const ScoreboardActionType = {
  ADD: "add",
  UPDATE_SCORE: "update-score",
  FINISH: "finish",
} as const;

interface ScoreboardState {
  matches: Match[];
  nextId: number;
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
    }
  | {
      type: typeof ScoreboardActionType.FINISH;
      matchId: number;
      timestamp: number;
    };

const initialState: ScoreboardState = {
  matches: [],
  nextId: 1,
};

const scoreboardReducer = (
  state: ScoreboardState,
  action: ScoreboardAction,
): ScoreboardState => {
  switch (action.type) {
    case ScoreboardActionType.ADD:
      return {
        matches: createMatch(
          state.matches,
          action.input,
          state.nextId,
          action.timestamp,
        ),
        nextId: state.nextId + 1,
      };
    case ScoreboardActionType.UPDATE_SCORE:
      return {
        ...state,
        matches: updateMatchScore(state.matches, action.matchId, action.score),
      };
    case ScoreboardActionType.FINISH:
      return {
        ...state,
        matches: finishMatch(state.matches, action.matchId, action.timestamp),
      };
  }
};

export const ScoreboardProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(scoreboardReducer, initialState);
  const scoreboard: Scoreboard = {
    matches: state.matches,
    addMatch: (input) =>
      dispatch({
        type: ScoreboardActionType.ADD,
        input,
        timestamp: Date.now(),
      }),
    updateScore: (matchId, score) =>
      dispatch({ type: ScoreboardActionType.UPDATE_SCORE, matchId, score }),
    finish: (matchId) =>
      dispatch({
        type: ScoreboardActionType.FINISH,
        matchId,
        timestamp: Date.now(),
      }),
  };

  return <ScoreboardContext value={scoreboard}>{children}</ScoreboardContext>;
};
