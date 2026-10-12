import { MatchStatus } from "../matches/constants";
import type { Match } from "../matches/types";

const startedAt = (offset: number) => Date.UTC(2026, 9, 12, 10, offset, 0);

export const INITIAL_MATCHES: Match[] = [
  {
    id: 1,
    homeTeam: "Mexico",
    awayTeam: "Canada",
    homeScore: 0,
    awayScore: 5,
    status: MatchStatus.IN_PROGRESS,
    startedAt: startedAt(0),
  },
  {
    id: 2,
    homeTeam: "Spain",
    awayTeam: "Brazil",
    homeScore: 10,
    awayScore: 2,
    status: MatchStatus.IN_PROGRESS,
    startedAt: startedAt(1),
  },
  {
    id: 3,
    homeTeam: "Germany",
    awayTeam: "France",
    homeScore: 2,
    awayScore: 2,
    status: MatchStatus.IN_PROGRESS,
    startedAt: startedAt(2),
  },
  {
    id: 4,
    homeTeam: "Uruguay",
    awayTeam: "Italy",
    homeScore: 6,
    awayScore: 6,
    status: MatchStatus.IN_PROGRESS,
    startedAt: startedAt(3),
  },
  {
    id: 5,
    homeTeam: "Argentina",
    awayTeam: "Australia",
    homeScore: 3,
    awayScore: 1,
    status: MatchStatus.IN_PROGRESS,
    startedAt: startedAt(4),
  },
];
