import { Page } from "@playwright/test";
import { DeliveryTab } from "ui/pages/orders/components/delivery/delivery.tab.page";
import { ScheduleDeliveryPage } from "ui/pages/orders/scheduleDelivery.page";
import { logStep } from "utils/report/logStep.utils";

export class ScheduleDeliveryUIService {
  deliveryTab: DeliveryTab;
  scheduleDeliveryPage: ScheduleDeliveryPage;

  constructor(private page: Page) {
    this.deliveryTab = new DeliveryTab(page);
    this.scheduleDeliveryPage = new ScheduleDeliveryPage(page);
  }

  @logStep("SELECT DELIVERY DATE")
  async selectDeliveryDate() {
    await this.scheduleDeliveryPage.dateInput.click();
    await this.scheduleDeliveryPage.pickRandomAvailableDate();
  }

  @logStep("SAVE DELIVERY")
  async clickSaveDelivery() {
    await this.scheduleDeliveryPage.clickSave();
    await this.deliveryTab.waitForOpened();
  }
}
