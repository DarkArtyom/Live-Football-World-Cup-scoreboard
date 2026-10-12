import { useLayoutEffect, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { Button } from "../../components/Button/Button";
import { Messages } from "../constants";
import styles from "../MatchTable/Matches.module.css";

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
        <Button onClick={onConfirm} size="small" variant="primary">
          Yes
        </Button>
        <Button onClick={onDismiss} size="small" variant="secondary">
          No
        </Button>
      </div>
    </div>,
    document.body,
  );
};
