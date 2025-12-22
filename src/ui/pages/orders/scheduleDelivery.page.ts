import { DeliveryTab } from "./delivery.tab.page";

export class ScheduleDeliveryPage extends DeliveryTab {
  readonly uniqueElement = this.page.getByRole("heading", { name: "Schedule Delivery" });

  readonly deliveryTypeSelec = this.page.locator("#inputType");
  readonly locationInput = this.page.locator("#inputLocation");
  readonly countryInput = this.page.locator("#inputCountry");
  readonly cityInput = this.page.locator("#inputCity");
  readonly streetInput = this.page.locator("#inputStreet");
  readonly houseInput = this.page.locator("#inputHouse");
  readonly flatInput = this.page.locator("#inputFlat");
  readonly dateInput = this.page.locator("#date-input");

  //   async fillForm(deliveryData: Partial<IProduct>) {
  //     if(productData.name) await this.nameInput.fill(productData.name);
  //     if(productData.manufacturer) await this.manufacterSelect.selectOption(productData.manufacturer);
  //     if(productData.price) await this.priceInput.fill(productData.price.toString());
  //     if(productData.amount) await this.amountInput.fill(productData.amount.toString());
  //     if(productData.notes) await this.notesInput.fill(productData.notes!);
  //   }
}
