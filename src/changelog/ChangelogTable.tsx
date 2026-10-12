import {
  Table,
  TableCell,
  TableEmpty,
  TableHeader,
  TableRow,
} from "../components/Table/Table";
import { Messages } from "../matches/constants";
import { createChangelogColumns } from "./columns";
import type { HistoryEvent } from "../matches/types";

interface ChangelogTableProps {
  events: HistoryEvent[];
}

const columns = createChangelogColumns();

export const ChangelogTable = ({ events }: ChangelogTableProps) => {
  if (!events.length) {
    return <TableEmpty>{Messages.CHANGELOG_EMPTY}</TableEmpty>;
  }

  return (
    <Table>
      <TableHeader columns={columns} />
      <tbody>
        {events.map((event) => (
          <TableRow key={event.id}>
            {columns.map((column) => (
              <TableCell className={column.className} key={column.id}>
                {column.render(event)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </tbody>
    </Table>
  );
};
