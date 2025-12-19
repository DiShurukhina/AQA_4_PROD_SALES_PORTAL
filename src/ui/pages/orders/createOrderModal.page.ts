import { expect } from "@playwright/test";
import { SalesPortalPage } from "../salesPortal.page";

export class CreateOrderModal extends SalesPortalPage {
  readonly uniqueElement = this.page.locator("#add-order-modal");
  readonly title = this.uniqueElement.getByText("Create Order");
  readonly closeButton = this.uniqueElement.locator("button.btn-close");
  readonly selectCustomersDropdown = this.uniqueElement.locator("#inputCustomerOrder");
  readonly productsSection = this.uniqueElement.locator("#products-section");
  readonly selectProductsDropdown = this.productsSection.locator(".form-select[name='Product']");
  readonly addProductButton = this.uniqueElement.locator("#add-product-btn");
  readonly createButton = this.uniqueElement.locator("#create-order-btn");
  readonly cancelButton = this.uniqueElement.locator("#cancel-order-modal-btn");
  readonly totalPrice = this.uniqueElement.locator("#total-price-order-modal");

  async selectCustomer(customerName: string) {
    await this.selectCustomersDropdown.selectOption(customerName);
  }

  async selectProduct(index: number, productName: string) {
    const dropdown = await this.selectProductsDropdown.nth(index);
    await expect(dropdown).toBeVisible();
    await dropdown.selectOption(productName);
  }

  async addProduct() {
    expect(this.addProductButton).toBeVisible();
    await this.addProductButton.click();
    const dropdownsCount = await this.selectProductsDropdown.count();
    await expect(this.selectProductsDropdown).toHaveCount(dropdownsCount);
  }

  async deleteProduct(index: number) {
    const deleteButton = this.productsSection
      .locator("div[data-id]")
      .nth(index)
      .locator('button.del-btn-modal[title="Delete"]');
    await deleteButton.click();
  }

  async getTotalPrice() {
    const price = (await this.totalPrice.textContent()) || "";
    return price.replace("$", "");
  }

  async clickCreate() {
    await this.createButton.click();
  }

  async createOrder(customerName: string, products: string[]) {
    await this.waitForOpened();
    await this.selectCustomer(customerName);
    expect(products.length).toBeGreaterThanOrEqual(1);
    await this.selectProduct(0, products[0]!);
    for (let i = 1; i < products.length; i++) {
      await this.addProduct();
      await this.selectProduct(i, products[i]!);
    }
    await this.clickCreate();
  }

  async clickCancel() {
    await this.cancelButton.click();
  }

  async close() {
    await this.closeButton.click();
  }
}
