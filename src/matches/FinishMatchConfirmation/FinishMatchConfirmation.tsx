import { useLayoutEffect, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { Messages } from "../constants";
import styles from "../Matches.module.css";

interface FinishMatchConfirmationProps {
  matchId: number;
  anchor: HTMLElement;
  onConfirm: () => void;
  onDismiss: () => void;
}

const placeBesideAnchor = (anchor: HTMLElement) => {
  const bounds = anchor.getBoundingClientRect();

  return {
    top: bounds.top + bounds.height / 2,
    left: bounds.left - 8,
  };
};

export const FinishMatchConfirmation = ({
  matchId,
  anchor,
  onConfirm,
  onDismiss,
}: FinishMatchConfirmationProps) => {
  const [position, setPosition] = useState(() => placeBesideAnchor(anchor));

  useLayoutEffect(() => {
    const updatePosition = () => setPosition(placeBesideAnchor(anchor));

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [anchor]);

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  return createPortal(
    <div
      aria-label={`Finish match #${matchId}`}
      className={styles.confirmationPopover}
      onClick={handleClick}
      role="alertdialog"
      style={position}
    >
      <span>{Messages.FINISH_MATCH_CONFIRMATION(matchId)}</span>
      <div className={styles.confirmationActions}>
        <button
          className={`${styles.button} ${styles.primaryButton} ${styles.smallButton}`}
          onClick={onConfirm}
          type="button"
        >
          Yes
        </button>
        <button
          className={`${styles.button} ${styles.secondaryButton} ${styles.smallButton}`}
          onClick={onDismiss}
          type="button"
        >
          No
        </button>
      </div>
    </div>,
    document.body,
  );
};
