import { useState, type SyntheticEvent } from "react";
import { Button } from "../../components/Button/Button";
import styles from "../MatchTable/Matches.module.css";

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
        <Button type="submit" variant="primary">
          Search
        </Button>
        <Button onClick={handleReset} variant="link">
          Reset search
        </Button>
      </form>
      <Button onClick={onCreate} variant="primary">
        <span aria-hidden="true">+</span>
        Create match
      </Button>
    </div>
  );
};
