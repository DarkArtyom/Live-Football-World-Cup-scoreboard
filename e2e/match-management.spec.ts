import { expect, test } from "@playwright/test";

test("closes the create dialog with Escape", async ({ page }) => {
  await page.goto("./#/matches");
  await page.getByRole("button", { name: "Create match" }).click();

  const dialog = page.getByRole("dialog", { name: "Create match" });
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
});

test("creates, edits, searches for, and finishes a match", async ({ page }) => {
  await page.goto("./#/matches");

  await page.getByRole("button", { name: "Create match" }).click();
  await page.getByLabel("Home team").fill("Japan");
  await page.getByLabel("Away team").fill("Senegal");
  await page
    .getByRole("dialog", { name: "Create match" })
    .getByRole("button", { name: "Create match", exact: true })
    .click();

  const matchRow = page.getByRole("row", { name: /Japan Senegal/ });
  await expect(matchRow).toContainText("0:0");

  await matchRow.getByRole("button", { name: /Edit match #/ }).click();
  await page.getByLabel("Home team score").fill("2");
  await page.getByLabel("Away team score").fill("1");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(matchRow).toContainText("2:1");

  await page.getByLabel("Search matches").fill("sen");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(matchRow).toBeVisible();
  await page.getByRole("button", { name: "Reset search" }).click();

  await matchRow.getByRole("button", { name: /Finish match #/ }).click();
  await expect(
    page.getByText(/Are you sure you want to finish match #/),
  ).toBeVisible();
  await page.getByRole("button", { name: "Yes" }).click();
  await expect(matchRow).toHaveCount(0);

  await page.getByRole("tab", { name: "Finished matches" }).click();
  await expect(
    page.getByRole("row", { name: /Japan Senegal 2 to 1/ }),
  ).toBeVisible();
});
