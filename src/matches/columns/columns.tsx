import type { ReactNode } from "react";
import styles from "../Matches.module.css";
import type { Match } from "../types";
import { getTotalGoals } from "../utils";
import { ActionsCell } from "./ActionsCell";

const START_TIME_FORMATTER = new Intl.DateTimeFormat(undefined, {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

export interface MatchColumn {
  id: string;
  title: string;
  className?: string;
  required?: boolean;
  render: (match: Match) => ReactNode;
}

interface CreateMatchColumnsParams {
  includeActions: boolean;
  pendingFinishId?: number | null;
}

const renderStartTime = (match: Match) => {
  const startDate = new Date(match.startedAt);

  return (
    <time dateTime={startDate.toISOString()} title={startDate.toLocaleString()}>
      {START_TIME_FORMATTER.format(startDate)}
    </time>
  );
};

export const createMatchColumns = ({
  includeActions,
  pendingFinishId,
}: CreateMatchColumnsParams): MatchColumn[] => {
  const columns: MatchColumn[] = [
    {
      id: "id",
      title: "Match ID",
      className: styles.idColumn,
      required: true,
      render: (match) => `#${match.id}`,
    },
    {
      id: "homeTeam",
      title: "Home team",
      required: true,
      render: (match) => match.homeTeam,
    },
    {
      id: "awayTeam",
      title: "Away team",
      required: true,
      render: (match) => match.awayTeam,
    },
    {
      id: "totalGoals",
      title: "Total goals",
      required: true,
      render: (match) => (
        <>
          <span
            aria-label={`${match.homeScore} to ${match.awayScore}`}
            className={styles.score}
          >
            {match.homeScore}:{match.awayScore}
          </span>
          <span className={styles.totalGoals}>
            {getTotalGoals(match)} total
          </span>
        </>
      ),
    },
    {
      id: "startedAt",
      title: "Started",
      required: true,
      render: renderStartTime,
    },
    {
      id: "actions",
      title: "Actions",
      className: styles.actionsColumn,
      required: false,
      render: (match) => (
        <ActionsCell
          isFinishPending={pendingFinishId === match.id}
          match={match}
        />
      ),
    },
  ];

  return columns.filter((column) => column.required || includeActions);
};
