import { useId, useState, type SyntheticEvent } from "react";
import { Modal } from "../../components/Modal";
import styles from "../Matches.module.css";
import {
  MatchEditorMode,
  type CreateMatchInput,
  type Match,
  type UpdateScoreInput,
} from "../types";
import { validateNewMatch, validateScoreInput } from "../utils";

type MatchEditorModalProps = {
  onDismiss: () => void;
} & (
  | {
      mode: typeof MatchEditorMode.CREATE;
      matches: Match[];
      onCreate: (input: CreateMatchInput) => void;
      match?: never;
      onUpdate?: never;
    }
  | {
      mode: typeof MatchEditorMode.EDIT;
      match: Match;
      onUpdate: (matchId: number, score: UpdateScoreInput) => void;
      matches?: never;
      onCreate?: never;
    }
);

export const MatchEditorModal = (props: MatchEditorModalProps) => {
  const { match, onDismiss } = props;
  const formId = useId();
  const [homeTeam, setHomeTeam] = useState(match?.homeTeam ?? "");
  const [awayTeam, setAwayTeam] = useState(match?.awayTeam ?? "");
  const [homeScore, setHomeScore] = useState(String(match?.homeScore ?? 0));
  const [awayScore, setAwayScore] = useState(String(match?.awayScore ?? 0));
  const [error, setError] = useState<string | null>(null);
  const isCreateMode = props.mode === MatchEditorMode.CREATE;

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (props.mode === MatchEditorMode.CREATE) {
      const validationError = validateNewMatch(props.matches, {
        homeTeam,
        awayTeam,
      });

      if (validationError) {
        setError(validationError);
        return;
      }

      props.onCreate({ homeTeam, awayTeam });
      onDismiss();
      return;
    }

    const scoreValidation = validateScoreInput(homeScore, awayScore);

    if (!scoreValidation.isValid) {
      setError(scoreValidation.error);
      return;
    }

    props.onUpdate(props.match.id, scoreValidation.score);
    onDismiss();
  };

  return (
    <Modal
      footer={
        <>
          <button
            className={`${styles.button} ${styles.secondaryButton}`}
            onClick={onDismiss}
            type="button"
          >
            Cancel
          </button>
          <button
            className={`${styles.button} ${styles.primaryButton}`}
            form={formId}
            type="submit"
          >
            {isCreateMode ? "Create match" : "Save changes"}
          </button>
        </>
      }
      onDismiss={onDismiss}
      title={isCreateMode ? "Create match" : `Edit match #${props.match.id}`}
    >
      <form id={formId} onSubmit={handleSubmit}>
        <div className={styles.formGrid}>
          <label className={styles.field}>
            <span>Home team</span>
            <input
              autoFocus={isCreateMode}
              disabled={!isCreateMode}
              maxLength={80}
              onChange={(event) => {
                setHomeTeam(event.target.value);
                setError(null);
              }}
              required
              type="text"
              value={homeTeam}
            />
          </label>
          <label className={styles.field}>
            <span>Away team</span>
            <input
              disabled={!isCreateMode}
              maxLength={80}
              onChange={(event) => {
                setAwayTeam(event.target.value);
                setError(null);
              }}
              required
              type="text"
              value={awayTeam}
            />
          </label>
          {!isCreateMode && (
            <>
              <label className={styles.field}>
                <span>Home team score</span>
                <input
                  autoFocus
                  inputMode="numeric"
                  min="0"
                  onChange={(event) => {
                    setHomeScore(event.target.value);
                    setError(null);
                  }}
                  required
                  step="1"
                  type="number"
                  value={homeScore}
                />
              </label>
              <label className={styles.field}>
                <span>Away team score</span>
                <input
                  inputMode="numeric"
                  min="0"
                  onChange={(event) => {
                    setAwayScore(event.target.value);
                    setError(null);
                  }}
                  required
                  step="1"
                  type="number"
                  value={awayScore}
                />
              </label>
            </>
          )}
        </div>
        {error && (
          <p className={styles.formError} role="alert">
            {error}
          </p>
        )}
      </form>
    </Modal>
  );
};
