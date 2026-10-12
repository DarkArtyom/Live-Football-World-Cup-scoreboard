import type { ChangelogColumn } from "./columns";

interface ChangelogTableHeaderProps {
  columns: ChangelogColumn[];
}

export const ChangelogTableHeader = ({
  columns,
}: ChangelogTableHeaderProps) => (
  <thead>
    <tr>
      {columns.map((column) => (
        <th className={column.className} key={column.id} scope="col">
          {column.title}
        </th>
      ))}
    </tr>
  </thead>
);
