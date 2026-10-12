import "@testing-library/jest-dom/vitest";

const modalDialogs = new Set<HTMLDialogElement>();

if (
  typeof HTMLDialogElement !== "undefined" &&
  typeof HTMLDialogElement.prototype.showModal !== "function"
) {
  HTMLDialogElement.prototype.showModal = function showModal(
    this: HTMLDialogElement,
  ) {
    this.open = true;
    modalDialogs.add(this);
  };

  HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
    this.open = false;
    modalDialogs.delete(this);
  };

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    const dialog = [...modalDialogs].at(-1);

    if (!dialog) {
      return;
    }

    const cancelEvent = new Event("cancel", { cancelable: true });
    const shouldClose = dialog.dispatchEvent(cancelEvent);

    if (shouldClose) {
      dialog.close();
    }
  });
}
