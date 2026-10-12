import type { ReactNode } from "react";
import styles from "../matches/Matches.module.css";
import {
  formatHistoryAction,
  formatHistoryChanges,
  formatHistoryDateTime,
  formatHistoryMatch,
} from "../matches/history";
import type { HistoryEvent } from "../matches/types";

export interface ChangelogColumn {
  id: string;
  title: string;
  className?: string;
  render: (event: HistoryEvent) => ReactNode;
}

const renderOccurredAt = (event: HistoryEvent) => {
  const occurredAt = new Date(event.occurredAt);

  return (
    <time dateTime={occurredAt.toISOString()}>
      {formatHistoryDateTime(event.occurredAt)}
    </time>
  );
};

export const createChangelogColumns = (): ChangelogColumn[] => [
  {
    id: "matchId",
    title: "Match ID",
    className: styles.idColumn,
    render: (event) => `#${event.matchId}`,
  },
  {
    id: "occurredAt",
    title: "Date & Time",
    render: renderOccurredAt,
  },
  {
    id: "match",
    title: "Match",
    render: formatHistoryMatch,
  },
  {
    id: "action",
    title: "Action",
    render: formatHistoryAction,
  },
  {
    id: "changes",
    title: "Changes",
    render: formatHistoryChanges,
  },
];
