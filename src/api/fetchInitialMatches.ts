import { Messages } from "../matches/constants";
import type { Match } from "../matches/types";
import { INITIAL_MATCHES } from "./initialMatches";

const LOAD_DELAY_MS = 600;

const wait = (delay: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, delay);
  });

export const toLoadError = (error: unknown) =>
  error instanceof Error ? error : new Error(Messages.MATCHES_LOAD_FAILED);

export const fetchInitialMatches = async (): Promise<Match[]> => {
  try {
    await wait(LOAD_DELAY_MS);

    return INITIAL_MATCHES.map((match) => ({ ...match }));
  } catch (error) {
    throw toLoadError(error);
  }
};
