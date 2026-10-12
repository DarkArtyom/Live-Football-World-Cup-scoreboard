import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MatchesToolbar } from "./MatchesToolbar";

describe("MatchesToolbar", () => {
  it("submits and resets a free-text search", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();

    render(<MatchesToolbar query="" onCreate={vi.fn()} onSearch={onSearch} />);

    await user.type(screen.getByLabelText("Search matches"), "Mexico");
    await user.click(screen.getByRole("button", { name: "Search" }));
    expect(onSearch).toHaveBeenLastCalledWith("Mexico");

    await user.click(screen.getByRole("button", { name: "Reset search" }));
    expect(screen.getByLabelText("Search matches")).toHaveValue("");
    expect(onSearch).toHaveBeenLastCalledWith("");
  });

  it("notifies when match creation is requested", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();

    render(<MatchesToolbar query="" onCreate={onCreate} onSearch={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "Create match" }));
    expect(onCreate).toHaveBeenCalledOnce();
  });
});
