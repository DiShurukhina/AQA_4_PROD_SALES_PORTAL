import { Locator } from "@playwright/test";
import { SalesPortalPage } from "../salesPortal.page";

export type OrderDetailsTab = "Delivery" | "Order History" | "Comments";

export class OrderDetailsPage extends SalesPortalPage {
  readonly uniqueElement = this.page.locator("");

  readonly deliveryButton = this.page.locator("#delivery-tab");
  readonly historyButton = this.page.locator("#history-tab");
  readonly commentsButton = this.page.locator("#comments-tab");

  async clickOrderDetailsTab(tabName: OrderDetailsTab) {
    const tabButtons: Record<OrderDetailsTab, Locator> = {
      Delivery: this.deliveryButton,
      "Order History": this.historyButton,
      Comments: this.commentsButton,
    };
    await tabButtons[tabName].click();
  }
}
