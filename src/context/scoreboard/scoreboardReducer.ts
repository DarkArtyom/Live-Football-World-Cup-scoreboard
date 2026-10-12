import {
  recordMatchCreated,
  recordMatchFinished,
  recordScoreUpdated,
} from "../../matches/historyChanges/history";
import { ScoreboardStatus } from "../../matches/types";
import {
  createMatch,
  finishMatch,
  nextMatchId,
  toMatchMap,
  updateMatchScore,
} from "../../matches/utils";
import { ScoreboardActionType } from "./constants";
import type { ScoreboardAction, ScoreboardState } from "./types";

export const scoreboardReducer = (
  state: ScoreboardState,
  action: ScoreboardAction,
): ScoreboardState => {
  switch (action.type) {
    case ScoreboardActionType.HYDRATE: {
      if (state.status === ScoreboardStatus.READY) {
        return state;
      }

      return {
        ...state,
        matches: toMatchMap(action.matches),
        nextId: nextMatchId(action.matches),
        status: ScoreboardStatus.READY,
        error: null,
      };
    }
    case ScoreboardActionType.FAIL: {
      if (state.status === ScoreboardStatus.READY) {
        return state;
      }

      return {
        ...state,
        status: ScoreboardStatus.ERROR,
        error: action.error,
      };
    }
    case ScoreboardActionType.RETRY: {
      if (state.status === ScoreboardStatus.READY) {
        return state;
      }

      return {
        ...state,
        status: ScoreboardStatus.LOADING,
        error: null,
      };
    }
    case ScoreboardActionType.ADD: {
      const matches = createMatch(
        state.matches,
        action.input,
        state.nextId,
        action.timestamp,
      );
      const created = matches.get(state.nextId);

      if (!created) {
        return state;
      }

      const history = recordMatchCreated(
        state.events,
        created,
        state.nextEventId,
      );

      return {
        ...state,
        matches,
        events: history.events,
        nextId: state.nextId + 1,
        nextEventId: history.nextEventId,
      };
    }
    case ScoreboardActionType.UPDATE_SCORE: {
      const current = state.matches.get(action.matchId);
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
      const current = state.matches.get(action.matchId);
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
