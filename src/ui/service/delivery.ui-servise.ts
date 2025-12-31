import { expect, Page } from "@playwright/test";
import { DeliveryTab } from "ui/pages/orders/components/delivery/delivery.tab.page";
import { ScheduleDeliveryPage } from "ui/pages/orders/scheduleDelivery.page";
import { OrderDetailsPage } from "ui/pages/orders/order-details.page";
import { logStep } from "utils/report/logStep.utils";

export class DeliveryUIService {
  orderDetailsPage: OrderDetailsPage;
  deliveryTab: DeliveryTab;
  scheduleDeliveryPage: ScheduleDeliveryPage;

  constructor(private page: Page) {
    this.orderDetailsPage = new OrderDetailsPage(page);
    this.deliveryTab = new DeliveryTab(page);
    this.scheduleDeliveryPage = new ScheduleDeliveryPage(page);
  }

  @logStep("NAVIGATE TO DELIVERY TAB")
  async openOrderDelivery(orderId: string) {
    await this.orderDetailsPage.openByOrderId(orderId);
    await this.orderDetailsPage.waitForOpened();
    await this.orderDetailsPage.openDeliveryTab();
    await this.deliveryTab.waitForOpened();
    await expect(this.deliveryTab.title).toHaveText("Delivery Information");
  }

  @logStep("NAVIGATE TO SCHEDULE DELIVERY FORM")
  async openScheduleDeliveryForm() {
    await this.deliveryTab.clickDeliveryForm();
    await this.scheduleDeliveryPage.waitForOpened();
    await this.scheduleDeliveryPage.waitForSpinners();
  }
}
