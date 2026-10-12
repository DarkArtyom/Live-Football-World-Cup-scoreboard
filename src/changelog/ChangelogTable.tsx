import styles from "../matches/Matches.module.css";
import { Messages } from "../matches/constants";
import { ChangelogTableHeader } from "./ChangelogTableHeader";
import { createChangelogColumns } from "./columns";
import type { HistoryEvent } from "../matches/types";

interface ChangelogTableProps {
  events: HistoryEvent[];
}

export const ChangelogTable = ({ events }: ChangelogTableProps) => {
  const columns = createChangelogColumns();

  if (!events.length) {
    return <p className={styles.emptyState}>{Messages.CHANGELOG_EMPTY}</p>;
  }

  return (
    <div className={styles.tableScroll}>
      <table className={styles.table}>
        <ChangelogTableHeader columns={columns} />
        <tbody>
          {events.map((event) => (
            <tr key={event.id}>
              {columns.map((column) => (
                <td className={column.className} key={column.id}>
                  {column.render(event)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
