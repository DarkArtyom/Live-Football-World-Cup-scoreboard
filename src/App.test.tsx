import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  it("should render the scoreboard title", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", {
        name: /live football world cup scoreboard/i,
      }),
    ).toBeVisible();
  });
});
