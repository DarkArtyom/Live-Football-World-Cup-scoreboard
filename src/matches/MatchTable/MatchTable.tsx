import { useMemo } from "react";
import {
  Table,
  TableCell,
  TableEmpty,
  TableHeader,
  TableRow,
} from "../../components/Table/Table";
import { createMatchColumns } from "../columns/columns";
import { FinishMatchConfirmation } from "../FinishMatchConfirmation/FinishMatchConfirmation";
import styles from "./Matches.module.css";
import { useMatchTable } from "../useMatchTable";
import type { Match } from "../types";

interface MatchTableProps {
  matches: Match[];
  matchesById: Map<number, Match>;
  emptyMessage: string;
  onEdit?: (match: Match) => void;
  onFinish?: (matchId: number) => void;
}

export const MatchTable = ({
  matches,
  matchesById,
  emptyMessage,
  onEdit,
  onFinish,
}: MatchTableProps) => {
  const { handleTableClick, pendingFinish, clearPendingFinish } = useMatchTable(
    {
      matchesById,
      onEdit,
      onFinish,
    },
  );
  const includeActions = Boolean(onEdit && onFinish);
  const columns = useMemo(
    () =>
      createMatchColumns({
        includeActions,
        pendingFinishId: pendingFinish?.matchId,
      }),
    [includeActions, pendingFinish?.matchId],
  );

  if (!matches.length) {
    return <TableEmpty>{emptyMessage}</TableEmpty>;
  }

  return (
    <>
      <Table>
        <TableHeader columns={columns} />
        <tbody onClick={onEdit || onFinish ? handleTableClick : undefined}>
          {matches.map((match) => (
            <TableRow
              className={onEdit ? styles.editableRow : undefined}
              data-match-id={match.id}
              key={match.id}
            >
              {columns.map((column) => (
                <TableCell className={column.className} key={column.id}>
                  {column.render(match)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </tbody>
      </Table>
      {pendingFinish && onFinish && (
        <FinishMatchConfirmation
          anchor={pendingFinish.anchor}
          matchId={pendingFinish.matchId}
          onConfirm={() => {
            onFinish(pendingFinish.matchId);
            clearPendingFinish();
          }}
          onDismiss={clearPendingFinish}
        />
      )}
    </>
  );
};
