import { useState, type SyntheticEvent } from "react";
import styles from "../Matches.module.css";

interface MatchesToolbarProps {
  query: string;
  onCreate: () => void;
  onSearch: (query: string) => void;
}

export const MatchesToolbar = ({
  query,
  onCreate,
  onSearch,
}: MatchesToolbarProps) => {
  const [draftQuery, setDraftQuery] = useState(query);

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(draftQuery);
  };

  const handleReset = () => {
    setDraftQuery("");
    onSearch("");
  };

  return (
    <div className={styles.toolbar}>
      <form className={styles.searchForm} onSubmit={handleSubmit} role="search">
        <label className={`${styles.field} ${styles.searchField}`}>
          <span>Search matches</span>
          <input
            onChange={(event) => setDraftQuery(event.target.value)}
            placeholder="Match ID or team name"
            type="search"
            value={draftQuery}
          />
        </label>
        <button
          className={`${styles.button} ${styles.primaryButton}`}
          type="submit"
        >
          Search
        </button>
        <button
          className={`${styles.button} ${styles.linkButton}`}
          onClick={handleReset}
          type="button"
        >
          Reset search
        </button>
      </form>
      <button
        className={`${styles.button} ${styles.primaryButton}`}
        onClick={onCreate}
        type="button"
      >
        <span aria-hidden="true">+</span>
        Create match
      </button>
    </div>
  );
};
