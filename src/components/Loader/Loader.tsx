import styles from "./Loader.module.css";

interface LoaderProps {
  label: string;
}

export const Loader = ({ label }: LoaderProps) => (
  <p className={styles.loader} role="status">
    <span aria-hidden="true" className={styles.spinner} />
    {label}
  </p>
);
