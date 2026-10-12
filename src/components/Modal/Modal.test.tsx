import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal } from "./Modal";

describe("Modal", () => {
  it("renders the dialog content and closes from the close button or Escape", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();

    render(
      <Modal
        footer={<button type="button">Save</button>}
        onDismiss={onDismiss}
        title="Create match"
      >
        <p>Match form</p>
      </Modal>,
    );

    expect(screen.getByRole("dialog", { name: "Create match" })).toBeVisible();
    expect(screen.getByText("Match form")).toBeVisible();
    expect(screen.getByRole("button", { name: "Save" })).toBeVisible();

    await user.click(screen.getByRole("button", { name: "Close dialog" }));
    await user.keyboard("{Escape}");

    expect(onDismiss).toHaveBeenCalledTimes(2);
  });

  it("closes only when the backdrop itself is pressed", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();

    render(
      <Modal footer={<span>Footer</span>} onDismiss={onDismiss} title="Edit">
        <p>Score</p>
      </Modal>,
    );

    await user.click(screen.getByRole("heading", { name: "Edit" }));
    expect(onDismiss).not.toHaveBeenCalled();

    fireEvent.mouseDown(screen.getByRole("dialog"));

    expect(onDismiss).toHaveBeenCalledOnce();
  });
});
