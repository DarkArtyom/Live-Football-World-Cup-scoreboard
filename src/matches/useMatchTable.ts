import { useCallback, useState, type MouseEvent } from "react";
import { type Match, type PendingFinish } from "./types";
import { MatchRowAction } from "./constants";

interface UseMatchTableParams {
  matchesById: Map<number, Match>;
  onEdit?: (match: Match) => void;
  onFinish?: (matchId: number) => void;
}

export const useMatchTable = ({
  matchesById,
  onEdit,
  onFinish,
}: UseMatchTableParams) => {
  const [pendingFinish, setPendingFinish] = useState<PendingFinish | null>(
    null,
  );

  const handleTableClick = useCallback(
    (event: MouseEvent<HTMLTableSectionElement>) => {
      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const row = target.closest("tr");
      const matchId = Number(row?.dataset.matchId);
      const match = matchesById.get(matchId);

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
    },
    [matchesById, onEdit, onFinish],
  );

  const clearPendingFinish = useCallback(() => {
    setPendingFinish(null);
  }, []);

  return { handleTableClick, pendingFinish, clearPendingFinish };
};
