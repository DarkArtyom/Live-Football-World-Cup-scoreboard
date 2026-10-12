import {
  formatHistoryAction,
  formatHistoryChanges,
  formatHistoryDateTime,
  formatHistoryMatch,
  recordMatchCreated,
  recordMatchFinished,
  recordScoreUpdated,
  sortHistoryEvents,
} from "./history";
import { HistoryAction, MatchStatus } from "../constants";
import { type Match } from "../types";

const match = (overrides: Partial<Match> = {}): Match => ({
  id: 101,
  homeTeam: "Mexico",
  awayTeam: "Canada",
  homeScore: 0,
  awayScore: 0,
  status: MatchStatus.IN_PROGRESS,
  startedAt: 1_000,
  ...overrides,
});

describe("history events", () => {
  it("records match creation with the match id, teams, and start time", () => {
    const created = match({ startedAt: 1_700 });
    const result = recordMatchCreated([], created, 4);

    expect(result.nextEventId).toBe(5);
    expect(result.events).toEqual([
      {
        id: 4,
        type: HistoryAction.MATCH_CREATED,
        matchId: 101,
        homeTeam: "Mexico",
        awayTeam: "Canada",
        occurredAt: 1_700,
        homeScore: 0,
        awayScore: 0,
      },
    ]);
    expect(formatHistoryAction(result.events[0])).toBe("Match Created");
    expect(formatHistoryChanges(result.events[0])).toBe("Initial score: 0–0");
    expect(formatHistoryMatch(result.events[0])).toBe("Mexico vs Canada");
  });

  it("records the previous and next scores for a score update", () => {
    const current = match({ homeScore: 1, awayScore: 0 });
    const result = recordScoreUpdated(
      [],
      current,
      { homeScore: 2, awayScore: 1 },
      2_500,
      8,
    );

    expect(result.events).toEqual([
      {
        id: 8,
        type: HistoryAction.SCORE_UPDATED,
        matchId: 101,
        homeTeam: "Mexico",
        awayTeam: "Canada",
        occurredAt: 2_500,
        previousHomeScore: 1,
        previousAwayScore: 0,
        homeScore: 2,
        awayScore: 1,
      },
    ]);
    expect(formatHistoryChanges(result.events[0])).toBe("1–0 → 2–1");
  });

  it("records an unchanged score when the active match is saved again", () => {
    const result = recordScoreUpdated(
      [],
      match({ homeScore: 2, awayScore: 1 }),
      { homeScore: 2, awayScore: 1 },
      3_000,
      1,
    );

    expect(result.events).toHaveLength(1);
    expect(formatHistoryChanges(result.events[0])).toBe("2–1 → 2–1");
  });

  it("records match completion as a status transition", () => {
    const result = recordMatchFinished([], match(), 4_000, 2);

    expect(result.events[0]).toMatchObject({
      id: 2,
      type: HistoryAction.MATCH_FINISHED,
      matchId: 101,
      occurredAt: 4_000,
    });
    expect(formatHistoryAction(result.events[0])).toBe("Match Finished");
    expect(formatHistoryChanges(result.events[0])).toBe(
      "In Progress → Finished",
    );
  });

  it("does not record a score update or finish for a missing or finished match", () => {
    const events = recordMatchCreated([], match(), 1).events;
    const finished = match({ status: MatchStatus.FINISHED });

    expect(
      recordScoreUpdated(
        events,
        undefined,
        { homeScore: 1, awayScore: 0 },
        5,
        2,
      ),
    ).toEqual({ events, nextEventId: 2 });
    expect(
      recordScoreUpdated(
        events,
        finished,
        { homeScore: 1, awayScore: 0 },
        5,
        2,
      ),
    ).toEqual({ events, nextEventId: 2 });
    expect(recordMatchFinished(events, undefined, 5, 2)).toEqual({
      events,
      nextEventId: 2,
    });
    expect(recordMatchFinished(events, finished, 5, 2)).toEqual({
      events,
      nextEventId: 2,
    });
  });

  it("orders newest events first and uses the event id when timestamps match", () => {
    const created = recordMatchCreated([], match({ startedAt: 100 }), 1);
    const updated = recordScoreUpdated(
      created.events,
      match(),
      { homeScore: 1, awayScore: 0 },
      100,
      created.nextEventId,
    );
    const finished = recordMatchFinished(
      updated.events,
      match(),
      50,
      updated.nextEventId,
    );

    expect(sortHistoryEvents(finished.events).map((event) => event.id)).toEqual(
      [2, 1, 3],
    );
  });

  it("formats the event timestamp with the date and time", () => {
    const timestamp = new Date(2026, 9, 12, 10, 42, 15).getTime();

    expect(formatHistoryDateTime(timestamp)).toBe("12 Oct 2026, 10:42:15");
  });
});
