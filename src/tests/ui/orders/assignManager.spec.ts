import { TAGS } from "data/tags";
import { test, expect } from "fixtures";
import { ASSIGN_MANAGER_ORDER_STATUS_CASES } from "data/salesPortal/orders/assignManagerDDT";

test.describe("[UI][Orders][Assign Manager]", () => {
  test.beforeEach(async ({ cleanup }) => {
    // Activate API cleanup fixture teardown (calls OrdersApiService.fullDelete).
    void cleanup;
  });

  test.describe("Assign manager to order", () => {
    for (const testCase of ASSIGN_MANAGER_ORDER_STATUS_CASES) {
      test(
        testCase.title,
        {
          tag: [testCase.isSmoke ? TAGS.SMOKE : TAGS.REGRESSION, TAGS.UI, TAGS.ORDERS, TAGS.MANAGERS],
        },
        async ({ loginApiService, ordersApiService, assignManagerUIService }) => {
          const token = await loginApiService.loginAsAdmin();
          const order = await testCase.createOrder(ordersApiService, token);

          await assignManagerUIService.openOrderForManagerAssignment(order._id);
          const managerName = await assignManagerUIService.assignFirstAvailableManager();

          await expect(assignManagerUIService.orderDetailsPage.header.assignedManagerContainer).toBeVisible();
          await assignManagerUIService.expectManagerAssigned(managerName);
        },
      );
    }
  });

  test(
    "Cancel manager assignment without saving",
    { tag: [TAGS.UI, TAGS.ORDERS, TAGS.MANAGERS, TAGS.REGRESSION] },
    async ({ loginApiService, ordersApiService, assignManagerUIService }) => {
      const token = await loginApiService.loginAsAdmin();
      const order = await ordersApiService.createOrderAndEntities(token, 1);

      await assignManagerUIService.openOrderForManagerAssignment(order._id);
      await assignManagerUIService.expectNoManagerAssigned();

      await assignManagerUIService.cancelManagerAssignment();

      await assignManagerUIService.expectNoManagerAssigned();
    },
  );

  test(
    "Assign manager modal shows all available managers",
    { tag: [TAGS.UI, TAGS.ORDERS, TAGS.MANAGERS, TAGS.SMOKE] },
    async ({ loginApiService, ordersApiService, assignManagerUIService }) => {
      const token = await loginApiService.loginAsAdmin();
      const order = await ordersApiService.createOrderAndEntities(token, 1);

      await assignManagerUIService.openOrderForManagerAssignment(order._id);
      await assignManagerUIService.openAssignManagerModal();

      // Get managers list from modal
      const managers = await assignManagerUIService.orderDetailsPage.assignManagerModal.getAvailableManagers();
      expect(managers.length).toBeGreaterThan(0);

      // All managers should be non-empty strings
      for (const manager of managers) {
        expect(manager.trim().length).toBeGreaterThan(0);
      }

      // Close modal
      await assignManagerUIService.orderDetailsPage.assignManagerModal.clickCancel();
      await assignManagerUIService.orderDetailsPage.assignManagerModal.waitForClosed();
    },
  );

  test(
    "Manager assignment persists after page refresh",
    { tag: [TAGS.UI, TAGS.ORDERS, TAGS.MANAGERS, TAGS.REGRESSION] },
    async ({ loginApiService, ordersApiService, assignManagerUIService, page }) => {
      const token = await loginApiService.loginAsAdmin();
      const order = await ordersApiService.createOrderAndEntities(token, 1);

      await assignManagerUIService.openOrderForManagerAssignment(order._id);

      const managerName = await assignManagerUIService.assignFirstAvailableManager();
      await expect(assignManagerUIService.orderDetailsPage.header.assignedManagerContainer).toBeVisible();

      // Refresh the page
      await page.reload();
      await assignManagerUIService.orderDetailsPage.waitForOpened();

      // Manager should still be assigned
      await expect(assignManagerUIService.orderDetailsPage.header.assignedManagerContainer).toBeVisible();
      await assignManagerUIService.expectManagerAssigned(managerName);
    },
  );
});
