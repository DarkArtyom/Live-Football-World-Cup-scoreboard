import { Messages } from "./constants";
import {
  createMatch,
  filterMatches,
  finishMatch,
  sortMatchesForSummary,
  toMatchMap,
  updateMatchScore,
  validateNewMatch,
  validateScoreInput,
} from "./utils";
import { type Match } from "./types";
import { MatchStatus } from "./constants";

const match = (overrides: Partial<Match> = {}): Match => ({
  id: 1,
  homeTeam: "Mexico",
  awayTeam: "Canada",
  homeScore: 0,
  awayScore: 0,
  status: MatchStatus.IN_PROGRESS,
  startedAt: 100,
  ...overrides,
});

describe("match utilities", () => {
  it("creates a match with a zero score without mutating the source", () => {
    const source = new Map<number, Match>();
    const result = createMatch(
      source,
      { homeTeam: " Mexico ", awayTeam: " Canada " },
      4,
      200,
    );

    expect(source.size).toBe(0);
    expect(result.get(4)).toEqual(
      match({
        id: 4,
        homeTeam: "Mexico",
        awayTeam: "Canada",
        startedAt: 200,
      }),
    );
  });

  it("rejects invalid or conflicting active teams", () => {
    const matches = [match()];

    expect(
      validateNewMatch(matches, { homeTeam: " ", awayTeam: "Spain" }),
    ).toBe(Messages.BOTH_TEAM_NAMES_REQUIRED);
    expect(
      validateNewMatch(matches, { homeTeam: "Spain", awayTeam: "spain" }),
    ).toBe(Messages.TEAMS_MUST_BE_DIFFERENT);
    expect(
      validateNewMatch(matches, { homeTeam: "mexico", awayTeam: "Spain" }),
    ).toBe(Messages.TEAM_ALREADY_PLAYING);
  });

  it("updates only the selected active match score", () => {
    const finished = match({ id: 2, status: MatchStatus.FINISHED });
    const source = toMatchMap([match(), finished]);
    const result = updateMatchScore(source, 1, {
      homeScore: 2,
      awayScore: 1,
    });
    const unchanged = updateMatchScore(source, 2, {
      homeScore: 4,
      awayScore: 4,
    });

    expect(result.get(1)).toMatchObject({ homeScore: 2, awayScore: 1 });
    expect(result.get(2)).toBe(finished);
    expect(source.get(1)).toMatchObject({ homeScore: 0, awayScore: 0 });
    expect(unchanged).toBe(source);
  });

  it("parses valid scores and rejects malformed score input", () => {
    expect(validateScoreInput("2", "1")).toEqual({
      isValid: true,
      score: { homeScore: 2, awayScore: 1 },
    });
    expect(validateScoreInput("", "1")).toEqual({
      isValid: false,
      error: Messages.BOTH_SCORES_REQUIRED,
    });
    expect(validateScoreInput("1a2", "1")).toEqual({
      isValid: false,
      error: Messages.SCORES_MUST_BE_WHOLE_NUMBERS,
    });
    expect(validateScoreInput("-1", "1")).toEqual({
      isValid: false,
      error: Messages.SCORES_MUST_BE_WHOLE_NUMBERS,
    });
    expect(validateScoreInput("9007199254740992", "1")).toEqual({
      isValid: false,
      error: Messages.SCORES_TOO_LARGE,
    });
  });

  it("orders matches in progress and finished matches by total score and then most recent start", () => {
    const result = sortMatchesForSummary([
      match({
        id: 1,
        homeScore: 2,
        startedAt: 100,
        status: MatchStatus.FINISHED,
        finishedAt: 300,
      }),
      match({
        id: 2,
        awayScore: 3,
        startedAt: 50,
        status: MatchStatus.FINISHED,
        finishedAt: 100,
      }),
      match({
        id: 3,
        homeScore: 2,
        startedAt: 200,
        status: MatchStatus.FINISHED,
        finishedAt: 200,
      }),
    ]);

    expect(result.map(({ id }) => id)).toEqual([2, 3, 1]);
  });

  it("finishes a match and supports case-insensitive free-text filtering", () => {
    const active = match();
    const source = toMatchMap([active]);
    const finished = finishMatch(source, 1, 300);

    expect(finished.get(1)).toMatchObject({
      status: MatchStatus.FINISHED,
      finishedAt: 300,
    });
    expect(source.get(1)).toBe(active);
    expect(filterMatches([active], "CAN")).toEqual([active]);
    expect(filterMatches([active], "#1")).toEqual([active]);
    expect(filterMatches([active], "0:0")).toEqual([]);
    expect(filterMatches([active], "3")).toEqual([]);
  });
});
