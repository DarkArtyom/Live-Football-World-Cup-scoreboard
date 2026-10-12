import { createContext } from "react";
import type { Scoreboard } from "../../matches/types";

export const ScoreboardContext = createContext<Scoreboard | null>(null);
