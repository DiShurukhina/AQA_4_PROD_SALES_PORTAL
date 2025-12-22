import { OrderDetailsPage } from "./orderDetails.page";

export class OrderHistoryTab extends OrderDetailsPage {
  readonly uniqueElement = this.page.locator("h4.ms-3.my-4", { hasText: "Order History" });
}
