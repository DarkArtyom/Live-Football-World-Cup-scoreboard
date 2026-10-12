import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MatchTable } from "./MatchTable";
import { MatchStatus, type Match } from "./types";

const activeMatch: Match = {
  id: 7,
  homeTeam: "Spain",
  awayTeam: "Brazil",
  homeScore: 2,
  awayScore: 1,
  status: MatchStatus.IN_PROGRESS,
  startedAt: new Date("2026-10-12T08:30:15Z").getTime(),
};

describe("MatchTable", () => {
  it("renders match data and the reusable columns", () => {
    render(<MatchTable emptyMessage="No matches" matches={[activeMatch]} />);

    expect(screen.getByRole("columnheader", { name: "Started" })).toBeVisible();
    expect(screen.getByRole("row", { name: /#7 Spain Brazil/ })).toBeVisible();
    expect(screen.getByText("2:1")).toBeVisible();
    expect(screen.getByText("3 total")).toBeVisible();
  });

  it("opens the editor from the row or edit control and ignores other buttons", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    const onFinish = vi.fn();

    render(
      <MatchTable
        emptyMessage="No matches"
        matches={[activeMatch]}
        onEdit={onEdit}
        onFinish={onFinish}
      />,
    );

    const row = screen.getByRole("row", { name: /#7 Spain Brazil/ });
    const editIcon = within(row)
      .getByRole("button", { name: "Edit match #7" })
      .querySelector("svg");

    await user.click(editIcon!);
    expect(onEdit).toHaveBeenCalledOnce();

    const extraButton = document.createElement("button");
    extraButton.type = "button";
    extraButton.textContent = "Details";
    within(row).getAllByRole("cell")[1]?.append(extraButton);
    await user.click(extraButton);
    expect(onEdit).toHaveBeenCalledOnce();

    await user.click(
      within(row).getByRole("button", { name: "Finish match #7" }),
    );
    await user.click(screen.getByRole("button", { name: "Yes" }));

    expect(onEdit).toHaveBeenCalledOnce();
    expect(onFinish).toHaveBeenCalledWith(7);

    await user.click(within(row).getByText("Spain"));
    expect(onEdit).toHaveBeenCalledTimes(2);
  });
});
