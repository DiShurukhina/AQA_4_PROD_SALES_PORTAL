import { expect, test } from "fixtures";
import _ from "lodash";
import { applyDeliveryCase, applyPickupCase } from "utils/orders/helpers";
import { TAGS } from "data/tags";
import { DELIVERY_CONDITION } from "data/salesPortal/delivery-status";
import {
  DEFAULT_SCHEDULE_FORM_CASES,
  CREATE_DELIVERY_POSITIVE_CASES_UI,
  CREATE_PICKUP_POSITIVE_CASES_UI,
  EDIT_PICKUP_POSITIVE_CASES_UI,
} from "data/salesPortal/orders/createDeliveryDDT";

test.describe("[Create/edit delivery]", () => {
  test.beforeEach(async ({ cleanup }) => {
    void cleanup;
  });

  test.describe("DDT - Default Schedule form", () => {
    for (const tc of DEFAULT_SCHEDULE_FORM_CASES) {
      test(
        tc.title,
        async ({ ordersApiService, ordersApi, loginApiService, deliveryUIService, scheduleDeliveryPage }) => {
          const token = await loginApiService.loginAsAdmin();
          const order = await ordersApiService.createOrderAndEntities(token, 1);
          const orderResponse = await ordersApi.getById(order._id, token);
          const customer = orderResponse.body.Order.customer;
          await deliveryUIService.openOrderDelivery(order._id);
          await deliveryUIService.openScheduleDeliveryForm();
          await expect(scheduleDeliveryPage.title).toHaveText("Schedule Delivery");
          await expect(scheduleDeliveryPage.saveButton).toBeDisabled();
          const scheduleDeliveryInfo = await scheduleDeliveryPage.getScheduleDeliveryData();
          const customerComparable = _.omit(customer, ["_id", "email", "name", "phone", "createdOn", "notes"]);
          const scheduleDeliveryComparable = _.omit(scheduleDeliveryInfo, ["deliveryType", "deliveryDate", "location"]);
          expect(scheduleDeliveryComparable).toEqual(customerComparable);
        },
      );
    }
  });

  test.describe("DDT - Schedule first delivery (Delivery)", () => {
    for (const tc of CREATE_DELIVERY_POSITIVE_CASES_UI) {
      test(
        tc.title,
        { tag: [TAGS.REGRESSION, TAGS.UI, TAGS.ORDERS] },
        async ({
          ordersApiService,
          loginApiService,
          deliveryUIService,
          scheduleDeliveryPage,
          scheduleDeliveryUIService,
          deliveryTab,
        }) => {
          const token = await loginApiService.loginAsAdmin();
          const order = await ordersApiService.createOrderAndEntities(token, 1);
          await deliveryUIService.openOrderDelivery(order._id);
          await deliveryUIService.openScheduleDeliveryForm();
          await expect(scheduleDeliveryPage.title).toHaveText("Schedule Delivery");
          await expect(scheduleDeliveryPage.saveButton).toBeDisabled();
          await applyDeliveryCase(scheduleDeliveryPage, tc);
          await expect(scheduleDeliveryPage.saveButton).toBeEnabled();
          const formInfo = await scheduleDeliveryPage.getScheduleDeliveryData();
          const expectedForDeliveryTab = _.omit(formInfo, ["location"]);
          await scheduleDeliveryUIService.clickSaveDelivery();
          const actual = await deliveryTab.getData();
          expect(actual).toEqual(expectedForDeliveryTab);
        },
      );
    }
  });

  test.describe("DDT - Edit delivery (Delivery)", () => {
    for (const tc of CREATE_DELIVERY_POSITIVE_CASES_UI) {
      test(
        tc.title,
        { tag: [TAGS.REGRESSION, TAGS.UI, TAGS.ORDERS] },
        async ({
          ordersApiService,
          loginApiService,
          deliveryUIService,
          scheduleDeliveryPage,
          scheduleDeliveryUIService,
          deliveryTab,
        }) => {
          const token = await loginApiService.loginAsAdmin();
          const order = await ordersApiService.createOrderAndEntities(token, 1);
          await deliveryUIService.openOrderDelivery(order._id);
          await deliveryUIService.openScheduleDeliveryForm();
          await applyDeliveryCase(scheduleDeliveryPage, tc);
          await scheduleDeliveryUIService.clickSaveDelivery();
          await deliveryUIService.openScheduleDeliveryForm();
          await expect(scheduleDeliveryPage.title).toHaveText("Edit Delivery");
          await expect(scheduleDeliveryPage.saveButton).toBeDisabled();
          await applyDeliveryCase(scheduleDeliveryPage, tc);
          await expect(scheduleDeliveryPage.saveButton).toBeEnabled();
          const formInfo = await scheduleDeliveryPage.getScheduleDeliveryData();
          const expectedForDeliveryTab = _.omit(formInfo, ["location"]);
          await scheduleDeliveryUIService.clickSaveDelivery();
          const actual = await deliveryTab.getData();
          expect(actual).toEqual(expectedForDeliveryTab);
        },
      );
    }
  });

  test.describe("DDT - Schedule first delivery (Pickup)", () => {
    for (const tc of CREATE_PICKUP_POSITIVE_CASES_UI) {
      test(
        tc.title,
        { tag: [TAGS.REGRESSION, TAGS.UI, TAGS.ORDERS] },
        async ({
          ordersApiService,
          loginApiService,
          deliveryUIService,
          scheduleDeliveryPage,
          scheduleDeliveryUIService,
          deliveryTab,
        }) => {
          const token = await loginApiService.loginAsAdmin();
          const order = await ordersApiService.createOrderAndEntities(token, 1);
          await deliveryUIService.openOrderDelivery(order._id);
          await deliveryUIService.openScheduleDeliveryForm();
          await expect(scheduleDeliveryPage.title).toHaveText("Schedule Delivery");
          await expect(scheduleDeliveryPage.saveButton).toBeDisabled();
          await applyPickupCase(scheduleDeliveryPage, tc);
          await expect(scheduleDeliveryPage.saveButton).toBeEnabled();
          const expected = await scheduleDeliveryPage.getScheduleDeliveryData();
          expect(expected.deliveryType).toBe(DELIVERY_CONDITION.PICKUP);
          await scheduleDeliveryUIService.clickSaveDelivery();
          const actual = await deliveryTab.getData();
          expect(actual).toEqual(expected);
        },
      );
    }
  });

  test.describe("DDT - Edit delivery (Pickup)", () => {
    for (const tc of EDIT_PICKUP_POSITIVE_CASES_UI) {
      test(
        tc.title,
        { tag: [TAGS.REGRESSION, TAGS.UI, TAGS.ORDERS] },
        async ({
          ordersApiService,
          loginApiService,
          deliveryUIService,
          scheduleDeliveryPage,
          scheduleDeliveryUIService,
          deliveryTab,
        }) => {
          const token = await loginApiService.loginAsAdmin();
          const order = await ordersApiService.createOrderAndEntities(token, 1);
          await deliveryUIService.openOrderDelivery(order._id);
          await deliveryUIService.openScheduleDeliveryForm();
          await applyPickupCase(scheduleDeliveryPage, tc, { selectType: true });
          await scheduleDeliveryUIService.clickSaveDelivery();
          await deliveryUIService.openScheduleDeliveryForm();
          await expect(scheduleDeliveryPage.title).toHaveText("Edit Delivery");
          await expect(scheduleDeliveryPage.saveButton).toBeDisabled();
          await applyPickupCase(scheduleDeliveryPage, tc, { selectType: false });
          await expect(scheduleDeliveryPage.saveButton).toBeEnabled();
          const expected = await scheduleDeliveryPage.getScheduleDeliveryData();
          expect(expected.deliveryType).toBe(DELIVERY_CONDITION.PICKUP);
          await scheduleDeliveryUIService.clickSaveDelivery();
          const actual = await deliveryTab.getData();
          expect(actual).toEqual(expected);
        },
      );
    }
  });
});
