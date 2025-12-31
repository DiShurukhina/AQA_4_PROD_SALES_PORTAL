import { expect, Locator, Page } from "@playwright/test";
import { TIMEOUT_30_S } from "data/salesPortal/constants";
import { logStep } from "utils/report/logStep.utils.js";

export abstract class BaseComponent {
  readonly spinner: Locator;
  abstract readonly uniqueElement: Locator;

  constructor(protected readonly page: Page) {
    this.spinner = page.locator(".spinner-border");
  }

  @logStep("WAIT FOR SPINNERS TO DISAPPEAR")
  async waitForSpinners() {
    await expect(this.spinner).toHaveCount(0, { timeout: TIMEOUT_30_S });
  }

  @logStep("WAIT FOR COMPONENT TO OPEN")
  async waitForOpened() {
    await expect(this.uniqueElement).toBeVisible({ timeout: TIMEOUT_30_S });
    await this.waitForSpinners();
  }
}
