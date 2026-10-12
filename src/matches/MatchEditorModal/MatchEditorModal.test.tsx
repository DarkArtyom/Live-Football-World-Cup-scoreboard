import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Messages } from "../constants";
import { MatchEditorMode, MatchStatus, type Match } from "../types";
import { MatchEditorModal } from "./MatchEditorModal";

const activeMatch: Match = {
  id: 1,
  homeTeam: "Mexico",
  awayTeam: "Canada",
  homeScore: 1,
  awayScore: 1,
  status: MatchStatus.IN_PROGRESS,
  startedAt: 100,
};

describe("MatchEditorModal", () => {
  it("validates and creates a match", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();
    const onDismiss = vi.fn();

    render(
      <MatchEditorModal
        matches={[]}
        mode={MatchEditorMode.CREATE}
        onCreate={onCreate}
        onDismiss={onDismiss}
      />,
    );

    await user.type(screen.getByLabelText("Home team"), "Mexico");
    await user.type(screen.getByLabelText("Away team"), "mexico");
    const dialog = screen.getByRole("dialog", { name: "Create match" });
    await user.click(
      within(dialog).getByRole("button", { name: "Create match" }),
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      Messages.TEAMS_MUST_BE_DIFFERENT,
    );
    expect(onCreate).not.toHaveBeenCalled();

    await user.clear(screen.getByLabelText("Away team"));
    await user.type(screen.getByLabelText("Away team"), "Canada");
    await user.click(
      within(dialog).getByRole("button", { name: "Create match" }),
    );

    expect(onCreate).toHaveBeenCalledWith({
      homeTeam: "Mexico",
      awayTeam: "Canada",
    });
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it("updates a score with non-negative whole numbers", async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();

    render(
      <MatchEditorModal
        match={activeMatch}
        mode={MatchEditorMode.EDIT}
        onDismiss={vi.fn()}
        onUpdate={onUpdate}
      />,
    );

    await user.clear(screen.getByLabelText("Home team score"));
    await user.type(screen.getByLabelText("Home team score"), "2");
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(onUpdate).toHaveBeenCalledWith(1, {
      homeScore: 2,
      awayScore: 1,
    });
  });
});
