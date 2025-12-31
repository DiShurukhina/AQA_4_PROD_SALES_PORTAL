import { Page } from "@playwright/test";
import { OrderDetailsPage } from "ui/pages/orders/order-details.page";
import { logStep } from "utils/report/logStep.utils";

export class OrderHistoryUIService {
  orderDetailsPage: OrderDetailsPage;

  constructor(private page: Page) {
    this.orderDetailsPage = new OrderDetailsPage(page);
  }

  @logStep("NAVIGATE TO ORDER HISTORY TAB")
  async openOrderHistory(orderId: string) {
    await this.orderDetailsPage.openByOrderId(orderId);
    await this.orderDetailsPage.waitForOpened();
    await this.orderDetailsPage.openHistoryTab();
    await this.orderDetailsPage.orderHistoryTab.waitForOpened();
  }
}
