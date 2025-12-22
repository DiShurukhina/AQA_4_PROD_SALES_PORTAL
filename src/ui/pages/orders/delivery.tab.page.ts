import { OrderDetailsPage } from "./orderDetails.page";

export class DeliveryTab extends OrderDetailsPage {
  readonly uniqueElement = this.page.locator('//*[@id="delivery"]//h4[normalize-space()="Delivery Information"]');

  readonly scheduleDeliveryButton = this.page.locator("#delivery-btn");
  readonly deliveryTable = this.page.locator("#delivery .mb-4.p-3");
  readonly deliveryRow = this.page.locator("#delivery .c-details");
  firstRowLabel = this.page.locator("#delivery .c-details").first().locator("span").nth(0);
  firstRowValue = this.page.locator("#delivery .c-details").first().locator("span").nth(1);

  //need a function to get all data from table
}
