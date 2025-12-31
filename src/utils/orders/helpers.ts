import { Locator } from "@playwright/test";
import { COUNTRY } from "data/salesPortal/country";
import { DELIVERY_CONDITION, DELIVERY_LOCATION } from "data/salesPortal/delivery-status";
import { DeliveryDateAction, ICreateDeliveryCaseUI, ICreatePickupDeliveryCaseUI } from "data/types/delivery.types";
import { IOrderFromResponse } from "data/types/order.types";
import { expect } from "fixtures";
import { ScheduleDeliveryPage } from "ui/pages/orders/scheduleDelivery.page";

export const productIdsOf = (order: IOrderFromResponse): string[] => order.products.map((p) => p._id);

export const calcTotal = (order: IOrderFromResponse): number =>
  order.products.reduce((sum: number, p) => sum + p.price, 0);

async function expectLocked(input: Locator) {
  if (await input.isDisabled()) {
    await expect(input).toBeDisabled();
    return;
  }
  await expect(input).toHaveJSProperty("readOnly", true);
}

async function pickDateIfNeeded(page: ScheduleDeliveryPage, action?: DeliveryDateAction) {
  if (!action) return;
  await page.dateInput.click();
  await action(page);
}

export async function assertDeliveryHomeLocks(page: ScheduleDeliveryPage) {
  await expectLocked(page.countryField);
  await expectLocked(page.cityInput);
  await expectLocked(page.houseInput);
  await expectLocked(page.flatInput);
}

export async function assertPickupLocks(page: ScheduleDeliveryPage) {
  await expect(page.locationSelect).toBeHidden();
  await expect(page.countryField).toBeEnabled();

  await expectLocked(page.cityInput);
  await expectLocked(page.streetInput);
  await expectLocked(page.houseInput);
}

export async function applyDeliveryCase(page: ScheduleDeliveryPage, tc: ICreateDeliveryCaseUI) {
  await page.deliveryTypeSelect.selectOption({ label: tc.deliveryType });
  await page.locationSelect.selectOption({ label: tc.deliveryLocation });
  const addr = tc.deliveryData.address;
  if (tc.deliveryLocation === DELIVERY_LOCATION.HOME) {
    await assertDeliveryHomeLocks(page);
    if (addr?.street !== undefined) await page.streetInput.fill(String(addr.street));
    await pickDateIfNeeded(page, tc.deliveryDateAction);
    return;
  }
  if (addr?.country) await page.countryField.selectOption({ label: addr.country });
  if (addr?.city !== undefined) await page.cityInput.fill(String(addr.city));
  if (addr?.street !== undefined) await page.streetInput.fill(String(addr.street));
  if (addr?.house !== undefined) await page.houseInput.fill(String(addr.house));
  if (addr?.flat !== undefined) await page.flatInput.fill(String(addr.flat));
  await pickDateIfNeeded(page, tc.deliveryDateAction);
}

export async function applyPickupCase(
  page: ScheduleDeliveryPage,
  tc: ICreatePickupDeliveryCaseUI,
  opts: { selectType?: boolean } = { selectType: true },
) {
  if (opts.selectType) {
    await page.deliveryTypeSelect.selectOption({ label: DELIVERY_CONDITION.PICKUP });
  }
  await assertPickupLocks(page);
  await page.countryField.selectOption({ label: tc.country as COUNTRY });
  await pickDateIfNeeded(page, tc.deliveryDateAction);
}
