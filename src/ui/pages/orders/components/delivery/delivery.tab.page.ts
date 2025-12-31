// import { DeliveryInfo } from "data/types/delivery.types";
import { logStep } from "utils/report/logStep.utils";
import { BaseComponent } from "ui/pages/base.component";
import { DeliveryInfo } from "data/types/delivery.types";

export class DeliveryTab extends BaseComponent {
  readonly tab = this.page.locator('#delivery.tab-pane.active.show[role="tabpanel"]');
  readonly title = this.tab.locator("h4", { hasText: "Delivery Information" });
  readonly orderInfoTable = this.tab.locator("div.mb-4.p-3");
  readonly values = this.orderInfoTable.locator("div.c-details > span:last-child");
  readonly scheduleDeliveryButton = this.tab.locator("#delivery-btn");
  readonly uniqueElement = this.tab;

  @logStep("GET ALL DATA FROM DELIVERY INFO")
  async getData(): Promise<DeliveryInfo> {
    const rows = this.orderInfoTable.locator("div.c-details");

    const map = await rows.evaluateAll((els) => {
      const res: Record<string, string> = {};
      for (const el of els) {
        const label = el.querySelector("span:first-child")?.textContent?.trim();
        const value = el.querySelector("span:last-child")?.textContent?.trim() ?? "";
        if (label) res[label] = value;
      }
      return res;
    });

    const toInt = (v: string) => {
      const n = Number(v);
      if (Number.isNaN(n)) throw new Error(`Cannot parse number from "${v}"`);
      return n;
    };

    return {
      deliveryType: map["Delivery Type"] ?? "",
      deliveryDate: map["Delivery Date"] ?? "",
      country: map["Country"] ?? "",
      city: map["City"] ?? "",
      street: map["Street"] ?? "",
      house: toInt(map["House"] ?? ""),
      flat: toInt(map["Flat"] ?? ""),
    };
  }

  @logStep("OPEN DELIVERY FORM")
  async clickDeliveryForm() {
    await this.scheduleDeliveryButton.click();
  }
}
