import { HistoryAction, MatchStatus } from "../constants";

import type {
  HistoryEvent,
  HistoryRecord,
  Match,
  UpdateScoreInput,
} from "../types";

const HISTORY_DATE_TIME_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

const formatScore = (homeScore: number, awayScore: number) =>
  `${homeScore}–${awayScore}`;

type HistoryEventDetails =
  | {
      type: typeof HistoryAction.MATCH_CREATED;
      homeScore: number;
      awayScore: number;
    }
  | {
      type: typeof HistoryAction.SCORE_UPDATED;
      previousHomeScore: number;
      previousAwayScore: number;
      homeScore: number;
      awayScore: number;
    }
  | {
      type: typeof HistoryAction.MATCH_FINISHED;
    };

const unchangedRecord = (
  events: HistoryEvent[],
  nextEventId: number,
): HistoryRecord => ({
  events,
  nextEventId,
});

const appendHistoryEvent = (
  events: HistoryEvent[],
  match: Match,
  occurredAt: number,
  eventId: number,
  details: HistoryEventDetails,
): HistoryRecord => ({
  events: [
    ...events,
    {
      id: eventId,
      matchId: match.id,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      occurredAt,
      ...details,
    },
  ],
  nextEventId: eventId + 1,
});

export const recordMatchCreated = (
  events: HistoryEvent[],
  match: Match,
  eventId: number,
): HistoryRecord =>
  appendHistoryEvent(events, match, match.startedAt, eventId, {
    type: HistoryAction.MATCH_CREATED,
    homeScore: match.homeScore,
    awayScore: match.awayScore,
  });

export const recordScoreUpdated = (
  events: HistoryEvent[],
  match: Match | undefined,
  score: UpdateScoreInput,
  occurredAt: number,
  eventId: number,
): HistoryRecord => {
  if (!match || match.status !== MatchStatus.IN_PROGRESS) {
    return unchangedRecord(events, eventId);
  }

  return appendHistoryEvent(events, match, occurredAt, eventId, {
    type: HistoryAction.SCORE_UPDATED,
    previousHomeScore: match.homeScore,
    previousAwayScore: match.awayScore,
    homeScore: score.homeScore,
    awayScore: score.awayScore,
  });
};

export const recordMatchFinished = (
  events: HistoryEvent[],
  match: Match | undefined,
  occurredAt: number,
  eventId: number,
): HistoryRecord => {
  if (!match || match.status !== MatchStatus.IN_PROGRESS) {
    return unchangedRecord(events, eventId);
  }

  return appendHistoryEvent(events, match, occurredAt, eventId, {
    type: HistoryAction.MATCH_FINISHED,
  });
};

export const sortHistoryEvents = (events: HistoryEvent[]) =>
  events.toSorted(
    (first, second) =>
      second.occurredAt - first.occurredAt || second.id - first.id,
  );

export const formatHistoryDateTime = (timestamp: number) =>
  HISTORY_DATE_TIME_FORMATTER.format(timestamp);

export const formatHistoryMatch = (event: HistoryEvent) =>
  `${event.homeTeam} vs ${event.awayTeam}`;

export const formatHistoryAction = (event: HistoryEvent) => {
  switch (event.type) {
    case HistoryAction.MATCH_CREATED:
      return "Match Created";
    case HistoryAction.SCORE_UPDATED:
      return "Score Updated";
    case HistoryAction.MATCH_FINISHED:
      return "Match Finished";
  }
};

export const formatHistoryChanges = (event: HistoryEvent) => {
  switch (event.type) {
    case HistoryAction.MATCH_CREATED:
      return `Initial score: ${formatScore(event.homeScore, event.awayScore)}`;
    case HistoryAction.SCORE_UPDATED:
      return `${formatScore(event.previousHomeScore, event.previousAwayScore)} → ${formatScore(event.homeScore, event.awayScore)}`;
    case HistoryAction.MATCH_FINISHED:
      return "In Progress → Finished";
  }
};
