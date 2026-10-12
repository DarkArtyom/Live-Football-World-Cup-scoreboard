import { expect, test } from "@playwright/test";

test("shows success toasts when a score is saved and a match is finished", async ({
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

  await expect(page.getByText("Match created successfully.")).toBeVisible();

  const matchRow = page.getByRole("row", { name: /Japan Senegal/ });
  const editButton = matchRow.getByRole("button", { name: /Edit match #/ });
  const matchLabel = await editButton.getAttribute("aria-label");
  const matchId = matchLabel?.match(/#(\d+)/)?.[1];

  await editButton.click();
  await page.getByLabel("Home team score").fill("2");
  await page.getByLabel("Away team score").fill("1");
  await page.getByRole("button", { name: "Save changes" }).click();

  await expect(
    page.getByText(`Match #${matchId} updated successfully.`),
  ).toBeVisible();

  await matchRow.getByRole("button", { name: /Finish match #/ }).click();
  await page.getByRole("button", { name: "Yes" }).click();

  await expect(
    page.getByText(`Match #${matchId} finished successfully.`),
  ).toBeVisible();
});

test("shows an error toast for an invalid score and none when finish is cancelled", async ({
  page,
}) => {
  await page.goto("./#/matches");

  await page.getByRole("button", { name: "Edit match #1" }).click();
  await page.getByLabel("Home team score").fill("21");
  await page.getByRole("button", { name: "Save changes" }).click();

  await expect(page.getByText("A score cannot be higher than 20.")).toHaveCount(
    2,
  );

  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Finish match #1" }).click();
  await page.getByRole("button", { name: "No" }).click();

  await expect(page.getByText(/finished successfully/)).toHaveCount(0);
});
