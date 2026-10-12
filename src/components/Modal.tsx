import {
  useEffect,
  useId,
  useRef,
  type MouseEvent,
  type PropsWithChildren,
  type ReactNode,
  type SyntheticEvent,
} from "react";
import { createPortal } from "react-dom";
import styles from "./Modal.module.css";

interface ModalProps extends PropsWithChildren {
  title: string;
  footer: ReactNode;
  onDismiss: () => void;
}

export const Modal = ({ title, footer, onDismiss, children }: ModalProps) => {
  const titleId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleBackdropMouseDown = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) {
      onDismiss();
    }
  };

  const handleCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault();
    onDismiss();
  };

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog || dialog.open) {
      return;
    }

    dialog.showModal();

    return () => {
      dialog.close();
    };
  }, []);

  return createPortal(
    <dialog
      aria-labelledby={titleId}
      className={styles.modal}
      onCancel={handleCancel}
      onMouseDown={handleBackdropMouseDown}
      ref={dialogRef}
    >
      <div className={styles.header}>
        <h2 id={titleId}>{title}</h2>
        <button
          aria-label="Close dialog"
          className={styles.closeButton}
          onClick={onDismiss}
          title="Close"
          type="button"
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>
      <div className={styles.content}>{children}</div>
      <div className={styles.footer}>{footer}</div>
    </dialog>,
    document.body,
  );
};
