import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { appRoutes } from "./router/router";

describe("App", () => {
  const renderApp = (initialEntry = "/") => {
    const router = createMemoryRouter(appRoutes, {
      initialEntries: [initialEntry],
    });

    render(<RouterProvider router={router} />);

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

  it("should expose the two match views as accessible tabs", async () => {
    renderApp("/matches");

    const tabs = await screen.findAllByRole("tab");

    expect(tabs).toHaveLength(2);
    expect(
      screen.getByRole("tab", { name: /matches in progress/i }),
    ).toHaveAttribute("aria-selected", "true");
    expect(
      screen.getByRole("tab", { name: /finished matches/i }),
    ).toHaveAttribute("aria-selected", "false");
  });

  it("should navigate to finished matches when its tab is selected", async () => {
    const user = userEvent.setup();
    renderApp("/matches");

    await user.click(
      await screen.findByRole("tab", { name: /finished matches/i }),
    );

    expect(
      screen.getByRole("heading", { name: /finished matches/i }),
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

    await user.keyboard("{Home}");
    expect(matchesTab).toHaveFocus();
    expect(matchesTab).toHaveAttribute("aria-selected", "true");

    await user.keyboard("{End}");
    expect(finishedTab).toHaveFocus();
    expect(finishedTab).toHaveAttribute("aria-selected", "true");
  });
});
