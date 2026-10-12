import { expect, test } from "@playwright/test";

test("records match creation, score updates, and completion in the changelog", async ({
  page,
}) => {
  await page.goto("./#/matches");

  await page.getByRole("button", { name: "Create match" }).click();
  await page.getByLabel("Home team").fill("Japan");
  await page.getByLabel("Away team").fill("Senegal");
  await page
    .getByRole("dialog", { name: "Create match" })
    .getByRole("button", { name: "Create match", exact: true })
    .click();

  const matchRow = page.getByRole("row", { name: /Japan Senegal/ });
  await matchRow.getByRole("button", { name: /Edit match #/ }).click();
  await page.getByLabel("Home team score").fill("2");
  await page.getByLabel("Away team score").fill("1");
  await page.getByRole("button", { name: "Save changes" }).click();

  await matchRow.getByRole("button", { name: /Finish match #/ }).click();
  await page.getByRole("button", { name: "Yes" }).click();

  await page.getByRole("tab", { name: "Changelog" }).click();
  await expect(page).toHaveURL(/#\/changelog$/);

  const headers = page.getByRole("columnheader");
  await expect(headers).toHaveText([
    "Match ID",
    "Date & Time",
    "Match",
    "Action",
    "Changes",
  ]);

  const rows = page.getByRole("row");
  await expect(rows).toHaveCount(4);
  await expect(rows.nth(1)).toContainText("Match Finished");
  await expect(rows.nth(1)).toContainText("In Progress → Finished");
  await expect(rows.nth(2)).toContainText("Score Updated");
  await expect(rows.nth(2)).toContainText("0–0 → 2–1");
  await expect(rows.nth(3)).toContainText("Japan vs Senegal");
  await expect(rows.nth(3)).toContainText("Match Created");
  await expect(rows.nth(3)).toContainText("Initial score: 0–0");

  await page.getByRole("tab", { name: "Finished matches" }).click();
  await page.getByRole("tab", { name: "Changelog" }).click();
  await expect(rows).toHaveCount(4);
  await expect(rows.nth(2)).toContainText("0–0 → 2–1");
});
