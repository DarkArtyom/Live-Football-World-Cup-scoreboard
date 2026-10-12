import type { HTMLAttributes, ReactNode, TdHTMLAttributes } from "react";
import styles from "./Table.module.css";

interface TableColumn {
  id: string;
  title: string;
  className?: string;
}

interface TableProps {
  children: ReactNode;
}

export const Table = ({ children }: TableProps) => (
  <div className={styles.tableScroll}>
    <table className={styles.table}>{children}</table>
  </div>
);

export const TableHeader = ({ columns }: { columns: TableColumn[] }) => (
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

export const TableRow = ({
  children,
  ...props
}: HTMLAttributes<HTMLTableRowElement>) => <tr {...props}>{children}</tr>;

export const TableCell = ({
  children,
  className,
}: TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className={className}>{children}</td>
);

export const TableEmpty = ({ children }: { children: ReactNode }) => (
  <p className={styles.emptyState}>{children}</p>
);
