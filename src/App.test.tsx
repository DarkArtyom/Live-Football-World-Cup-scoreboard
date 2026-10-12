import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { fetchInitialMatches } from "./api/fetchInitialMatches";
import { type Match } from "./matches/types";
import { appRoutes } from "./router/router";
import { MatchStatus } from "./matches/constants";

vi.mock("./api/fetchInitialMatches", () => ({
  fetchInitialMatches: vi.fn(() => Promise.resolve([])),
}));

describe("App", () => {
  beforeEach(() => {
    vi.mocked(fetchInitialMatches).mockReset();
    vi.mocked(fetchInitialMatches).mockResolvedValue([]);
  });

  const renderApp = (initialEntry = "/") => {
    const router = createMemoryRouter(appRoutes, {
      initialEntries: [initialEntry],
    });
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    );

    return router;
  };

  it("should render the scoreboard title and default view", async () => {
    renderApp();

    expect(
      await screen.findByRole("heading", {
        name: /matches in progress/i,
      }),
    ).toBeVisible();
    expect(
      screen.getByRole("heading", {
        name: /live football world cup scoreboard/i,
      }),
    ).toBeVisible();
  });

  it("should expose the scoreboard views as accessible tabs", async () => {
    renderApp("/matches");

    const tabs = await screen.findAllByRole("tab");

    expect(tabs).toHaveLength(3);
    expect(
      screen.getByRole("tab", { name: /matches in progress/i }),
    ).toHaveAttribute("aria-selected", "true");
    expect(
      screen.getByRole("tab", { name: /finished matches/i }),
    ).toHaveAttribute("aria-selected", "false");
    expect(screen.getByRole("tab", { name: /changelog/i })).toHaveAttribute(
      "aria-selected",
      "false",
    );
  });

  it("should navigate to finished matches when its tab is selected", async () => {
    const user = userEvent.setup();
    renderApp("/matches");

    await user.click(
      await screen.findByRole("tab", { name: /finished matches/i }),
    );

    expect(
      await screen.findByRole("heading", { name: /finished matches/i }),
    ).toBeVisible();
    expect(
      screen.getByRole("tab", { name: /finished matches/i }),
    ).toHaveAttribute("aria-selected", "true");
  });

  it("should support arrow, Home, and End keyboard navigation", async () => {
    const user = userEvent.setup();
    renderApp("/matches");
    const matchesTab = await screen.findByRole("tab", {
      name: /matches in progress/i,
    });

    matchesTab.focus();
    await user.keyboard("{ArrowRight}");

    const finishedTab = screen.getByRole("tab", {
      name: /finished matches/i,
    });
    expect(finishedTab).toHaveFocus();
    expect(finishedTab).toHaveAttribute("aria-selected", "true");

    await user.keyboard("{ArrowRight}");

    const changelogTab = screen.getByRole("tab", { name: /changelog/i });
    expect(changelogTab).toHaveFocus();
    expect(changelogTab).toHaveAttribute("aria-selected", "true");

    await user.keyboard("{Home}");
    expect(matchesTab).toHaveFocus();
    expect(matchesTab).toHaveAttribute("aria-selected", "true");

    await user.keyboard("{End}");
    expect(changelogTab).toHaveFocus();
    expect(changelogTab).toHaveAttribute("aria-selected", "true");
  });

  it("should create, update, and finish a match", async () => {
    const user = userEvent.setup();
    renderApp("/matches");

    await user.click(
      await screen.findByRole("button", { name: /create match/i }),
    );
    await user.type(screen.getByLabelText(/home team/i), "Mexico");
    await user.type(screen.getByLabelText(/away team/i), "Canada");
    const createDialog = screen.getByRole("dialog", { name: /create match/i });
    await user.click(
      within(createDialog).getByRole("button", { name: /^create match$/i }),
    );

    const row = screen.getByRole("row", { name: /#1 mexico canada/i });
    expect(within(row).getByText("0:0")).toBeVisible();

    await user.click(
      within(row).getByRole("button", { name: /edit match #1/i }),
    );
    const homeScore = screen.getByLabelText(/home team score/i);
    const awayScore = screen.getByLabelText(/away team score/i);
    await user.clear(homeScore);
    await user.type(homeScore, "2");
    await user.clear(awayScore);
    await user.type(awayScore, "1");
    await user.click(screen.getByRole("button", { name: /save changes/i }));

    expect(within(row).getByText("2:1")).toBeVisible();

    await user.click(
      within(row).getByRole("button", { name: /finish match #1/i }),
    );
    await user.click(screen.getByRole("button", { name: "Yes" }));
    expect(screen.queryByRole("row", { name: /#1 mexico canada/i })).toBeNull();

    await user.click(screen.getByRole("tab", { name: /finished matches/i }));
    expect(
      screen.getByRole("row", { name: /#1 mexico canada 2 to 1/i }),
    ).toBeVisible();
  });

  it("should keep changelog events when navigating between tabs", async () => {
    const user = userEvent.setup();
    renderApp("/matches");

    await user.click(
      await screen.findByRole("button", { name: /create match/i }),
    );
    await user.type(screen.getByLabelText(/home team/i), "Mexico");
    await user.type(screen.getByLabelText(/away team/i), "Canada");
    await user.click(
      within(screen.getByRole("dialog", { name: /create match/i })).getByRole(
        "button",
        { name: /^create match$/i },
      ),
    );
    await user.click(
      within(screen.getByRole("row", { name: /#1 mexico canada/i })).getByRole(
        "button",
        { name: /edit match #1/i },
      ),
    );
    const homeScore = screen.getByLabelText(/home team score/i);
    const awayScore = screen.getByLabelText(/away team score/i);
    await user.clear(homeScore);
    await user.type(homeScore, "2");
    await user.clear(awayScore);
    await user.type(awayScore, "1");
    await user.click(screen.getByRole("button", { name: /save changes/i }));
    await user.click(screen.getByRole("button", { name: /finish match #1/i }));
    await user.click(screen.getByRole("button", { name: "Yes" }));

    await user.click(screen.getByRole("tab", { name: /changelog/i }));

    const rows = screen.getAllByRole("row").slice(1);
    expect(rows).toHaveLength(3);
    expect(rows[0]).toHaveTextContent("Match Finished");
    expect(rows[0]).toHaveTextContent("In Progress → Finished");
    expect(rows[1]).toHaveTextContent("Score Updated");
    expect(rows[1]).toHaveTextContent("0–0 → 2–1");
    expect(rows[2]).toHaveTextContent("Match Created");
    expect(rows[2]).toHaveTextContent("#1");
    expect(rows[2]).toHaveTextContent("Mexico vs Canada");
    expect(rows[2]).toHaveTextContent("Initial score: 0–0");
    expect(rows[2].querySelector("time")?.getAttribute("datetime")).toEqual(
      expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
    );

    await user.click(screen.getByRole("tab", { name: /matches in progress/i }));
    await user.click(screen.getByRole("tab", { name: /changelog/i }));

    expect(screen.getAllByRole("row").slice(1)).toHaveLength(3);
    expect(screen.getByText("0–0 → 2–1")).toBeVisible();
  });

  it("shows a loader and then the loaded matches", async () => {
    let resolveMatches: (matches: Match[]) => void = () => undefined;
    vi.mocked(fetchInitialMatches).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveMatches = resolve;
        }),
    );
    renderApp("/matches");

    expect(await screen.findByRole("status")).toHaveTextContent(
      /loading matches/i,
    );

    resolveMatches([
      {
        id: 7,
        homeTeam: "Mexico",
        awayTeam: "Canada",
        homeScore: 0,
        awayScore: 5,
        status: MatchStatus.IN_PROGRESS,
        startedAt: 100,
      },
    ]);

    expect(
      await screen.findByRole("row", { name: /#7 mexico canada/i }),
    ).toBeVisible();
  });

  it("shows a load error and retries", async () => {
    const user = userEvent.setup();
    vi.mocked(fetchInitialMatches).mockRejectedValueOnce(
      new Error("Could not load matches."),
    );
    renderApp("/matches");

    const alerts = await screen.findAllByRole("alert");
    expect(
      alerts.some((alert) =>
        /could not load matches/i.test(alert.textContent ?? ""),
      ),
    ).toBe(true);

    vi.mocked(fetchInitialMatches).mockResolvedValueOnce([]);
    await user.click(screen.getByRole("button", { name: /try again/i }));

    expect(await screen.findByText(/no matches in progress/i)).toBeVisible();
  });
});
