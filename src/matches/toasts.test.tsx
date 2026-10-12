import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToastContainer, toast } from "react-toastify";
import type { ReactNode } from "react";
import { MatchEditorModal } from "./MatchEditorModal/MatchEditorModal";
import { MatchTable } from "./MatchTable/MatchTable";
import { MatchEditorMode, MatchStatus, Messages } from "./constants";
import type { Match } from "./types";

const activeMatch: Match = {
  id: 7,
  homeTeam: "Spain",
  awayTeam: "Brazil",
  homeScore: 2,
  awayScore: 1,
  status: MatchStatus.IN_PROGRESS,
  startedAt: 100,
};

const renderWithToasts = (ui: ReactNode) =>
  render(
    <>
      {ui}
      <ToastContainer />
    </>,
  );

describe("match toasts", () => {
  afterEach(() => {
    toast.dismiss();
  });

  it("shows a success toast after a finish is confirmed", async () => {
    const user = userEvent.setup();

    renderWithToasts(
      <MatchTable
        emptyMessage="No matches"
        matches={[activeMatch]}
        matchesById={new Map([[activeMatch.id, activeMatch]])}
        onEdit={vi.fn()}
        onFinish={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Finish match #7" }));
    await user.click(screen.getByRole("button", { name: "No" }));
    expect(
      screen.queryByText(Messages.MATCH_FINISHED(7)),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Finish match #7" }));
    await user.click(screen.getByRole("button", { name: "Yes" }));

    expect(await screen.findByText(Messages.MATCH_FINISHED(7))).toBeVisible();
  });

  it("shows a success toast after a score is saved", async () => {
    const user = userEvent.setup();

    renderWithToasts(
      <MatchEditorModal
        match={activeMatch}
        mode={MatchEditorMode.EDIT}
        onDismiss={vi.fn()}
        onUpdate={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(await screen.findByText(Messages.MATCH_UPDATED(7))).toBeVisible();
  });

  it("shows an error toast for an invalid score and for identical teams", async () => {
    const user = userEvent.setup();

    const { unmount } = renderWithToasts(
      <MatchEditorModal
        match={activeMatch}
        mode={MatchEditorMode.EDIT}
        onDismiss={vi.fn()}
        onUpdate={vi.fn()}
      />,
    );

    const homeScore = screen.getByLabelText("Home team score");
    await user.clear(homeScore);
    await user.type(homeScore, "21");
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(await screen.findAllByText(Messages.SCORE_ABOVE_LIMIT)).toHaveLength(
      2,
    );

    unmount();
    toast.dismiss();

    renderWithToasts(
      <MatchEditorModal
        matches={[]}
        mode={MatchEditorMode.CREATE}
        onCreate={vi.fn()}
        onDismiss={vi.fn()}
      />,
    );

    await user.type(screen.getByLabelText("Home team"), "Mexico");
    await user.type(screen.getByLabelText("Away team"), "mexico");
    const dialog = screen.getByRole("dialog", { name: "Create match" });
    await user.click(
      within(dialog).getByRole("button", { name: "Create match" }),
    );

    expect(
      await screen.findAllByText(Messages.TEAMS_MUST_BE_DIFFERENT),
    ).toHaveLength(2);

    await user.clear(screen.getByLabelText("Away team"));
    await user.type(screen.getByLabelText("Away team"), "Canada");
    await user.click(
      within(dialog).getByRole("button", { name: "Create match" }),
    );

    expect(await screen.findByText(Messages.MATCH_CREATED)).toBeVisible();
  });
});
