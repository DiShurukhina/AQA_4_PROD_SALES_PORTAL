import { Locator } from "@playwright/test";
import { SalesPortalPage } from "../salesPortal.page";

export class OrdersListPage extends SalesPortalPage {
  readonly uniqueElement = this.page.locator("#title").getByRole("heading", { name: "Orders List" });
  detailsBtnByOrderId(orderId: string): Locator {
    return this.page.locator(`a.table-btn[href="#/orders/${orderId}"]`);
    // или без класса:
    // return this.page.locator(`a[href="#/orders/${orderId}"]`);
  }
}
