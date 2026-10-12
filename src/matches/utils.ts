import { MatchStatus, Messages } from "./constants";
import {
  type CreateMatchInput,
  type Match,
  type ScoreInputValidation,
  type UpdateScoreInput,
} from "./types";

const normalizeTeamName = (teamName: string) => teamName.trim();
const WHOLE_NUMBER_PATTERN = /^\d+$/;

export const getTotalGoals = (match: Match) =>
  match.homeScore + match.awayScore;

export const sortMatchesForSummary = (matches: Match[]) =>
  matches.toSorted(
    (first, second) =>
      getTotalGoals(second) - getTotalGoals(first) ||
      second.startedAt - first.startedAt ||
      second.id - first.id,
  );

export const filterMatches = (matches: Match[], query: string) => {
  const normalizedQuery = query.trim().toLocaleLowerCase();

  if (!normalizedQuery) {
    return matches;
  }

  return matches.filter((match) =>
    [String(match.id), `#${match.id}`, match.homeTeam, match.awayTeam].some(
      (value) => value.toLocaleLowerCase().includes(normalizedQuery),
    ),
  );
};

export const validateNewMatch = (
  matches: Match[],
  input: CreateMatchInput,
): string | null => {
  const homeTeam = normalizeTeamName(input.homeTeam);
  const awayTeam = normalizeTeamName(input.awayTeam);

  if (!homeTeam || !awayTeam) {
    return Messages.BOTH_TEAM_NAMES_REQUIRED;
  }

  if (
    homeTeam.localeCompare(awayTeam, undefined, { sensitivity: "base" }) === 0
  ) {
    return Messages.TEAMS_MUST_BE_DIFFERENT;
  }

  const activeTeamNames = new Set(
    matches
      .filter((match) => match.status === MatchStatus.IN_PROGRESS)
      .flatMap((match) => [match.homeTeam, match.awayTeam])
      .map((teamName) => teamName.toLocaleLowerCase()),
  );

  if (
    activeTeamNames.has(homeTeam.toLocaleLowerCase()) ||
    activeTeamNames.has(awayTeam.toLocaleLowerCase())
  ) {
    return Messages.TEAM_ALREADY_PLAYING;
  }

  return null;
};

export const validateScoreInput = (
  homeScore: string,
  awayScore: string,
): ScoreInputValidation => {
  if (!homeScore || !awayScore) {
    return { isValid: false, error: Messages.BOTH_SCORES_REQUIRED };
  }

  if (
    !WHOLE_NUMBER_PATTERN.test(homeScore) ||
    !WHOLE_NUMBER_PATTERN.test(awayScore)
  ) {
    return {
      isValid: false,
      error: Messages.SCORES_MUST_BE_WHOLE_NUMBERS,
    };
  }

  const score = {
    homeScore: Number(homeScore),
    awayScore: Number(awayScore),
  };

  if (
    !Number.isSafeInteger(score.homeScore) ||
    !Number.isSafeInteger(score.awayScore)
  ) {
    return { isValid: false, error: Messages.SCORES_TOO_LARGE };
  }

  return { isValid: true, score };
};

export const toMatchMap = (matches: readonly Match[]) =>
  new Map(matches.map((match) => [match.id, match]));

export const nextMatchId = (matches: readonly Match[]) =>
  matches.reduce((maxId, match) => Math.max(maxId, match.id), 0) + 1;

export const createMatch = (
  matches: Map<number, Match>,
  input: CreateMatchInput,
  id: number,
  startedAt: number,
): Map<number, Match> => {
  const next = new Map(matches);

  next.set(id, {
    id,
    homeTeam: normalizeTeamName(input.homeTeam),
    awayTeam: normalizeTeamName(input.awayTeam),
    homeScore: 0,
    awayScore: 0,
    status: MatchStatus.IN_PROGRESS,
    startedAt,
  });

  return next;
};

export const updateMatchScore = (
  matches: Map<number, Match>,
  matchId: number,
  score: UpdateScoreInput,
): Map<number, Match> => {
  const match = matches.get(matchId);

  if (!match || match.status !== MatchStatus.IN_PROGRESS) {
    return matches;
  }

  const next = new Map(matches);
  next.set(matchId, { ...match, ...score });

  return next;
};

export const finishMatch = (
  matches: Map<number, Match>,
  matchId: number,
  finishedAt: number,
): Map<number, Match> => {
  const match = matches.get(matchId);

  if (!match || match.status !== MatchStatus.IN_PROGRESS) {
    return matches;
  }

  const next = new Map(matches);
  next.set(matchId, {
    ...match,
    status: MatchStatus.FINISHED,
    finishedAt,
  });

  return next;
};
