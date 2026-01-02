import { orderInStatus } from "data/salesPortal/orders/updateCustomerDDT";
import { TAGS } from "data/tags";
import { test, expect } from "fixtures";
import _ from "lodash";
import { convertToDateAndTime } from "utils/date.utils";

test.describe("[UI] [Orders] [Update customer]", () => {
  test.beforeEach(async ({ cleanup }) => {
    void cleanup;
  });

  test(
    "Should be visible edit customer button in Draft order",
    { tag: [TAGS.REGRESSION, TAGS.UI, TAGS.ORDERS] },
    async ({ loginApiService, ordersApiService, orderDetailsPage }) => {
      const token = await loginApiService.loginAsAdmin();
      const order = await ordersApiService.createOrderAndEntities(token, 1);
      const orderId = order._id;

      await orderDetailsPage.open(`#/orders/${orderId}`);
      await orderDetailsPage.waitForOpened();
      await expect(orderDetailsPage.customerDetails.uniqueElement).toBeVisible();
      await expect(orderDetailsPage.customerDetails.editButton).toBeVisible();
    },
  );

  test(
    "Should update customer in Draft order",
    { tag: [TAGS.REGRESSION, TAGS.UI, TAGS.ORDERS, TAGS.E2E] },
    async ({ loginApiService, ordersApiService, orderDetailsPage, cleanup, customersApiService }) => {
      const token = await loginApiService.loginAsAdmin();
      const order = await ordersApiService.createOrderAndEntities(token, 1);
      const orderId = order._id;
      const secondCustomer = await customersApiService.create(token);
      cleanup.addCustomer(secondCustomer._id);

      await orderDetailsPage.open(`#/orders/${orderId}`);
      await orderDetailsPage.waitForOpened();
      const customerDetails = orderDetailsPage.customerDetails;
      const customerData = await customerDetails.getCustomerData();
      const editCustomerModal = await customerDetails.clickEdit();
      await editCustomerModal.waitForOpened();
      await editCustomerModal.selectCustomer(secondCustomer.name);
      await editCustomerModal.clickSave();
      await orderDetailsPage.waitForOpened();
      const updatedCustomerData = await customerDetails.getCustomerData();
      expect(customerData).not.toEqual(updatedCustomerData);
      expect(updatedCustomerData).toEqual({
        ..._.omit(secondCustomer, ["_id"]),
        createdOn: convertToDateAndTime(secondCustomer.createdOn),
      });
    },
  );

  for (const orderCase of orderInStatus) {
    test(
      `Should NOT be visible edit customer button in order in ${orderCase.name} status`,
      { tag: [TAGS.REGRESSION, TAGS.UI, TAGS.ORDERS] },
      async ({ ordersApiService, loginApiService, orderDetailsPage }) => {
        const token = await loginApiService.loginAsAdmin();
        const order = await orderCase.create(ordersApiService, token);
        const orderId = order._id;
        await orderDetailsPage.open(`#/orders/${orderId}`);
        await orderDetailsPage.waitForOpened();
        await expect(orderDetailsPage.customerDetails.uniqueElement).toBeVisible();
        await expect(orderDetailsPage.customerDetails.editButton).not.toBeVisible();
      },
    );
  }
});
