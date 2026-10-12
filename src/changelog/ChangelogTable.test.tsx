import { render, screen, within } from "@testing-library/react";
import { ChangelogTable } from "./ChangelogTable";
import { Messages } from "../matches/constants";
import { HistoryAction } from "../matches/constants";
import type { HistoryEvent } from "../matches/types";

const createdEvent: HistoryEvent = {
  id: 1,
  type: HistoryAction.MATCH_CREATED,
  matchId: 7,
  homeTeam: "Mexico",
  awayTeam: "Canada",
  occurredAt: new Date(2026, 9, 12, 10, 42, 15).getTime(),
  homeScore: 0,
  awayScore: 0,
};

describe("ChangelogTable", () => {
  it("renders the five columns and the recorded event", () => {
    render(<ChangelogTable events={[createdEvent]} />);

    const headers = screen.getAllByRole("columnheader");

    expect(headers.map((header) => header.textContent)).toEqual([
      "Match ID",
      "Date & Time",
      "Match",
      "Action",
      "Changes",
    ]);

    const row = screen.getByRole("row", { name: /#7/ });
    expect(within(row).getByText("#7")).toBeVisible();
    expect(within(row).getByText("12 Oct 2026, 10:42:15")).toBeVisible();
    expect(within(row).getByText("Mexico vs Canada")).toBeVisible();
    expect(within(row).getByText("Match Created")).toBeVisible();
    expect(within(row).getByText("Initial score: 0–0")).toBeVisible();
    expect(row.querySelector("time")).toHaveAttribute(
      "datetime",
      new Date(createdEvent.occurredAt).toISOString(),
    );
  });

  it("renders the empty state when there are no events", () => {
    render(<ChangelogTable events={[]} />);

    expect(screen.getByText(Messages.CHANGELOG_EMPTY)).toBeVisible();
    expect(screen.queryByRole("table")).toBeNull();
  });
});
