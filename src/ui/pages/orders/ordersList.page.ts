import { SalesPortalPage } from "../salesPortal.page";
import { logStep } from "utils/report/logStep.utils.js";
import { IOrderInTable, OrdersTableHeader } from "data/types/order.types";
import { CreateOrderModal } from "./createOrderModal.page";

export class OrdersListPage extends SalesPortalPage {
  readonly createOrderModal = new CreateOrderModal(this.page);
  readonly title = this.page.locator("h2.fw-bold");
  readonly createOrderButton = this.page.locator('[name="add-button"]');
  readonly tableRow = this.page.locator("tbody tr");
  readonly tableRowByName = (orderNumber: string) =>
    this.page.locator("table tbody tr", { has: this.page.locator("td", { hasText: orderNumber }) });
  readonly tableRowByIndex = (index: number) => this.page.locator("table tbody tr").nth(index);
  readonly orderNumberCell = (orderNumber: string) => this.tableRowByName(orderNumber).locator("td").nth(0);
  readonly emailCell = (orderNumber: string) => this.tableRowByName(orderNumber).locator("td").nth(1);
  readonly priceCell = (orderNumber: string) => this.tableRowByName(orderNumber).locator("td").nth(2);
  readonly deliveryCell = (orderNumber: string) => this.tableRowByName(orderNumber).locator("td").nth(2);
  readonly statusCell = (orderNumber: string) => this.tableRowByName(orderNumber).locator("td").nth(2);
  readonly assignedManagerCell = (orderNumber: string) => this.tableRowByName(orderNumber).locator("td").nth(2);
  readonly createdOnCell = (nameOrIndex: string | number) =>
    typeof nameOrIndex === "string"
      ? this.tableRowByName(nameOrIndex).locator("td").nth(3)
      : this.tableRowByIndex(nameOrIndex).locator("td").nth(3);
  readonly tableHeader = this.page.locator("thead th div[current]");
  readonly tableHeaderNamed = (name: OrdersTableHeader) => this.tableHeader.filter({ hasText: name });
  readonly tableHeaderArrow = (name: OrdersTableHeader, { direction }: { direction: "asc" | "desc" }) =>
    this.page
      .locator("thead th", { has: this.page.locator("div[current]", { hasText: name }) })
      .locator(`i.${direction === "asc" ? "bi-arrow-down" : "bi-arrow-up"}`);

  readonly detailsButton = (orderNumber: string) => this.tableRowByName(orderNumber).getByTitle("Details");
  readonly uniqueElement = this.createOrderButton;
  readonly searchInput = this.page.locator("#search");
  readonly searchButton = this.page.locator("#search-orders");

  @logStep("Click Add New Order Button")
  async clickAddCustomerButton() {
    await this.createOrderButton.click();
  }

  @logStep("Get row data from the Orders List by order number")
  async getOrderData(orderNumber: string): Promise<IOrderInTable> {
    const [orderId, email, price, delivery, assignedManager, createdOn] = await this.tableRowByName(orderNumber)
      .locator("td")
      .allInnerTexts();
    return {
      orderId: orderId!,
      email: email!,
      price: +price!.replace("$", ""),
      delivery: delivery!,
      assignedManager: assignedManager!,
      createdOn: createdOn!,
    };
  }

  async getTableData(): Promise<IOrderInTable[]> {
    const data: IOrderInTable[] = [];

    const rows = await this.tableRow.all();
    for (const row of rows) {
      const [orderId, email, price, delivery, assignedManager, createdOn] = await row.locator("td").allInnerTexts();
      data.push({
        orderId: orderId!,
        email: email!,
        price: +price!.replace("$", ""),
        delivery: delivery!,
        assignedManager: assignedManager!,
        createdOn: createdOn!,
      });
    }
    return data;
  }

  async clickAction(orderNumber: string, button: "details") {
    if (button === "details") await this.detailsButton(orderNumber).click();
  }

  async clickTableHeader(name: OrdersTableHeader) {
    await this.tableHeaderNamed(name).click();
  }

  async fillSearchInput(text: string) {
    await this.searchInput.fill(text);
  }

  async clickSearch() {
    await this.searchButton.click();
  }
}
