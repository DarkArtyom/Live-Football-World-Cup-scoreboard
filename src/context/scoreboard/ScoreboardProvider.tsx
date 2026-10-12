import { useEffect, useReducer, type PropsWithChildren } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchInitialMatches } from "../../api/fetchInitialMatches";
import { Messages } from "../../matches/constants";
import { type Scoreboard } from "../../matches/types";
import { ScoreboardContext } from "./ScoreboardContext";
import {
  INITIAL_MATCHES_QUERY_KEY,
  initialState,
  ScoreboardActionType,
} from "./constants";
import { scoreboardReducer } from "./scoreboardReducer";

export const ScoreboardProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(scoreboardReducer, initialState);
  const matchesQuery = useQuery({
    queryKey: INITIAL_MATCHES_QUERY_KEY,
    queryFn: async () => {
      try {
        return await fetchInitialMatches();
      } catch (error) {
        throw error instanceof Error
          ? error
          : new Error(Messages.MATCHES_LOAD_FAILED);
      }
    },
    retry: false,
  });

  useEffect(() => {
    if (!matchesQuery.isSuccess) {
      return;
    }

    dispatch({
      type: ScoreboardActionType.HYDRATE,
      matches: matchesQuery.data,
    });
  }, [matchesQuery.data, matchesQuery.isSuccess]);

  useEffect(() => {
    if (!matchesQuery.isError) {
      return;
    }

    dispatch({
      type: ScoreboardActionType.FAIL,
      error:
        matchesQuery.error instanceof Error
          ? matchesQuery.error.message
          : Messages.MATCHES_LOAD_FAILED,
    });
  }, [matchesQuery.error, matchesQuery.isError]);

  const scoreboard: Scoreboard = {
    matches: state.matches,
    events: state.events,
    status: state.status,
    error: state.error,
    retry: () => {
      dispatch({ type: ScoreboardActionType.RETRY });
      void matchesQuery.refetch();
    },
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
