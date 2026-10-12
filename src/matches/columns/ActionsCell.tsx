import styles from "../Matches.module.css";
import { MatchRowAction, type Match } from "../types";
import { CheckIcon, EditIcon } from "./ActionIcons";

interface ActionsCellProps {
  match: Match;
  isFinishPending: boolean;
}

export const ActionsCell = ({ match, isFinishPending }: ActionsCellProps) => (
  <div className={styles.tableActions}>
    <button
      aria-label={`Edit match #${match.id}`}
      className={styles.iconButton}
      data-action={MatchRowAction.EDIT}
      title="Edit match"
      type="button"
    >
      <EditIcon />
    </button>
    <button
      aria-expanded={isFinishPending}
      aria-label={`Finish match #${match.id}`}
      className={`${styles.iconButton} ${styles.successIcon}`}
      data-action={MatchRowAction.FINISH}
      title="Finish match"
      type="button"
    >
      <CheckIcon />
    </button>
  </div>
);
