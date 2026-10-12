import { useState, type MouseEvent } from "react";
import { createMatchColumns } from "./columns/columns";
import { FinishMatchConfirmation } from "./FinishMatchConfirmation/FinishMatchConfirmation";
import styles from "./Matches.module.css";
import { MatchTableHeader } from "./MatchTableHeader";
import { MatchRowAction, type Match, type PendingFinish } from "./types";

interface MatchTableProps {
  matches: Match[];
  emptyMessage: string;
  onEdit?: (match: Match) => void;
  onFinish?: (matchId: number) => void;
}

export const MatchTable = ({
  matches,
  emptyMessage,
  onEdit,
  onFinish,
}: MatchTableProps) => {
  const [pendingFinish, setPendingFinish] = useState<PendingFinish | null>(
    null,
  );
  const includeActions = Boolean(onEdit && onFinish);
  const columns = createMatchColumns({
    includeActions,
    pendingFinishId: pendingFinish?.matchId,
  });

  const handleTableClick = (event: MouseEvent<HTMLTableSectionElement>) => {
    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    const row = target.closest("tr");
    const matchId = Number(row?.dataset.matchId);
    const match = matches.find((item) => item.id === matchId);

    if (!match) {
      return;
    }

    const button = target.closest("button");

    if (button instanceof HTMLButtonElement) {
      if (button.dataset.action === MatchRowAction.FINISH && onFinish) {
        setPendingFinish((current) =>
          current?.matchId === match.id
            ? null
            : { matchId: match.id, anchor: button },
        );
      }

      if (button.dataset.action === MatchRowAction.EDIT && onEdit) {
        onEdit(match);
      }

      return;
    }

    // A click on the row itself opens the editor on purpose.
    if (onEdit) {
      onEdit(match);
    }
  };

  if (!matches.length) {
    return <p className={styles.emptyState}>{emptyMessage}</p>;
  }

  return (
    <div className={styles.tableScroll}>
      <table className={styles.table}>
        <MatchTableHeader columns={columns} />
        <tbody onClick={onEdit || onFinish ? handleTableClick : undefined}>
          {matches.map((match) => (
            <tr
              className={onEdit ? styles.editableRow : undefined}
              data-match-id={match.id}
              key={match.id}
            >
              {columns.map((column) => (
                <td className={column.className} key={column.id}>
                  {column.render(match)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {pendingFinish && onFinish && (
        <FinishMatchConfirmation
          anchor={pendingFinish.anchor}
          matchId={pendingFinish.matchId}
          onConfirm={() => {
            onFinish(pendingFinish.matchId);
            setPendingFinish(null);
          }}
          onDismiss={() => setPendingFinish(null)}
        />
      )}
    </div>
  );
};
