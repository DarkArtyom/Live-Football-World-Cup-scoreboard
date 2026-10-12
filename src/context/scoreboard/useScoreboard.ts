import { useContext } from "react";
import { ScoreboardContext } from "./ScoreboardContext";
import { Messages } from "../../matches/constants";

export const useScoreboard = () => {
  const scoreboard = useContext(ScoreboardContext);

  if (!scoreboard) {
    throw new Error(Messages.USE_SCOREBOARD_ERROR);
  }

  return scoreboard;
};
