import { Messages } from "./constants";
import {
  MatchStatus,
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

export const createMatch = (
  matches: Match[],
  input: CreateMatchInput,
  id: number,
  startedAt: number,
): Match[] => [
  ...matches,
  {
    id,
    homeTeam: normalizeTeamName(input.homeTeam),
    awayTeam: normalizeTeamName(input.awayTeam),
    homeScore: 0,
    awayScore: 0,
    status: MatchStatus.IN_PROGRESS,
    startedAt,
  },
];

export const updateMatchScore = (
  matches: Match[],
  matchId: number,
  score: UpdateScoreInput,
): Match[] =>
  matches.map((match) =>
    match.id === matchId && match.status === MatchStatus.IN_PROGRESS
      ? { ...match, ...score }
      : match,
  );

export const finishMatch = (
  matches: Match[],
  matchId: number,
  finishedAt: number,
): Match[] =>
  matches.map((match) =>
    match.id === matchId && match.status === MatchStatus.IN_PROGRESS
      ? { ...match, status: MatchStatus.FINISHED, finishedAt }
      : match,
  );
