import type { MatchColumn } from "./columns/columns";

interface MatchTableHeaderProps {
  columns: MatchColumn[];
}

export const MatchTableHeader = ({ columns }: MatchTableHeaderProps) => (
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
