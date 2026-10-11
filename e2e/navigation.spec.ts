import { expect, test } from "@playwright/test";

test("navigates between scoreboard views", async ({ page }) => {
  await page.goto("./");

  await expect(page).toHaveURL(/#\/matches$/);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Live Football World Cup Scoreboard",
    }),
  ).toBeVisible();

  const matchesTab = page.getByRole("tab", {
    name: "Matches in progress",
  });
  const finishedTab = page.getByRole("tab", {
    name: "Finished matches",
  });

  await expect(matchesTab).toHaveAttribute("aria-selected", "true");
  await finishedTab.click();
  await expect(page).toHaveURL(/#\/finished$/);
  await expect(finishedTab).toHaveAttribute("aria-selected", "true");
  await expect(
    page.getByRole("heading", { level: 2, name: "Finished matches" }),
  ).toBeVisible();

  await finishedTab.press("ArrowLeft");
  await expect(page).toHaveURL(/#\/matches$/);
  await expect(matchesTab).toBeFocused();
  await expect(matchesTab).toHaveAttribute("aria-selected", "true");

  await page.goBack();
  await expect(page).toHaveURL(/#\/finished$/);
  await expect(finishedTab).toHaveAttribute("aria-selected", "true");

  await page.goForward();
  await expect(page).toHaveURL(/#\/matches$/);
  await expect(matchesTab).toHaveAttribute("aria-selected", "true");
});
