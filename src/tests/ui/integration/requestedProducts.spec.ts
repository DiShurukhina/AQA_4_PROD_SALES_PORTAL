import { test, expect } from "fixtures";
import { EditProductsModal } from "ui/pages/orders/editProducts.modal";
import { NOTIFICATIONS } from "data/salesPortal/notifications";
import { ORDER_STATUS } from "data/salesPortal/order-status";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { IOrderFromResponse } from "data/types/order.types";
import { getOrderSchema } from "data/schemas/orders/get.schema";
import { STATUS_CODES } from "data/statusCodes";
import { TAGS } from "data/tags";

const PRODUCTS_MAX_COUNT = 5;

test.describe("[UI][Orders][Requested Products]", () => {
  let token = "";

  test.beforeEach(async ({ orderDetailsPage, cleanup }) => {
    void cleanup;
    token = await orderDetailsPage.getAuthToken();
  });

  test(
    "Edit requested products: increase products count to 5",
    { tag: [TAGS.REGRESSION, TAGS.UI, TAGS.ORDERS] },
    async ({ ordersApiService, productsApiService, ordersApi, orderDetailsPage, page, cleanup }) => {
      const order = await ordersApiService.createOrderAndEntities(token, 1);
      cleanup.addOrder(order._id);

      // Create extra products to expand order to 5 items
      const extraProductNames: string[] = [];
      for (let i = 0; i < PRODUCTS_MAX_COUNT - 1; i++) {
        const product = await productsApiService.create(token);
        cleanup.addProduct(product._id);
        extraProductNames.push(product.name);
      }

      const initialName = order.products[0]!.name;
      const desiredProductNames = [initialName, ...extraProductNames];

      await orderDetailsPage.openByOrderId(order._id);
      await orderDetailsPage.waitForOpened();
      await expect(orderDetailsPage.statusOrderLabel).toHaveText(ORDER_STATUS.DRAFT);
      await orderDetailsPage.requestedProducts.expectLoaded();
      await expect(orderDetailsPage.requestedProducts.editButton).toBeVisible();

      await orderDetailsPage.requestedProducts.clickEdit();

      const editProductsModal = new EditProductsModal(page);
      await editProductsModal.waitForOpened();
      await expect(editProductsModal.productRows).toHaveCount(1);

      const updatedFromUi = await editProductsModal.editOrder(desiredProductNames);
      expect(updatedFromUi.products).toHaveLength(PRODUCTS_MAX_COUNT);

      await expect.soft(orderDetailsPage.notificationToast).toHaveText(NOTIFICATIONS.ORDER_UPDATED);
      await editProductsModal.waitForClosed();

      // Verify changes are saved in BE
      const getResponse = await ordersApi.getById(order._id, token);
      validateResponse(getResponse, {
        status: STATUS_CODES.OK,
        IsSuccess: true,
        ErrorMessage: null,
        schema: getOrderSchema,
      });
      const updatedOrder = getResponse.body.Order as IOrderFromResponse;
      expect(updatedOrder.products).toHaveLength(PRODUCTS_MAX_COUNT);
      const actualNames = updatedOrder.products.map((p) => p.name).sort();
      const expectedNames = desiredProductNames.slice().sort();
      expect(actualNames).toEqual(expectedNames);
    },
  );

  test(
    "Edit requested products: decrease products count to 1",
    { tag: [TAGS.REGRESSION, TAGS.UI, TAGS.ORDERS] },
    async ({ ordersApiService, ordersApi, orderDetailsPage, page, cleanup }) => {
      const order = await ordersApiService.createOrderAndEntities(token, PRODUCTS_MAX_COUNT);
      cleanup.addOrder(order._id);

      const keepProductName = order.products[0]!.name;

      await orderDetailsPage.openByOrderId(order._id);
      await orderDetailsPage.waitForOpened();
      await expect(orderDetailsPage.statusOrderLabel).toHaveText(ORDER_STATUS.DRAFT);
      await orderDetailsPage.requestedProducts.expectLoaded();
      await expect(orderDetailsPage.requestedProducts.editButton).toBeVisible();

      await orderDetailsPage.requestedProducts.clickEdit();

      const editProductsModal = new EditProductsModal(page);
      await editProductsModal.waitForOpened();

      await expect(editProductsModal.productRows).toHaveCount(PRODUCTS_MAX_COUNT);
      await editProductsModal.editOrder([keepProductName]);
      await expect.soft(orderDetailsPage.notificationToast).toHaveText(NOTIFICATIONS.ORDER_UPDATED);
      await editProductsModal.waitForClosed();

      // Verify changes are saved in BE
      const getResponse = await ordersApi.getById(order._id, token);
      validateResponse(getResponse, {
        status: STATUS_CODES.OK,
        IsSuccess: true,
        ErrorMessage: null,
        schema: getOrderSchema,
      });
      const updatedOrder = getResponse.body.Order as IOrderFromResponse;
      expect(updatedOrder.products).toHaveLength(1);
      expect(updatedOrder.products[0]!.name).toBe(keepProductName);
    },
  );

  test(
    "Edit requested products: replace all products in the order",
    { tag: [TAGS.REGRESSION, TAGS.UI, TAGS.ORDERS] },
    async ({ ordersApiService, productsApiService, ordersApi, orderDetailsPage, page, cleanup }) => {
      const order = await ordersApiService.createOrderAndEntities(token, 2);
      cleanup.addOrder(order._id);

      const originalNames = order.products.map((p) => p.name).sort();

      const replacement1 = await productsApiService.create(token);
      const replacement2 = await productsApiService.create(token);
      cleanup.addProduct(replacement1._id);
      cleanup.addProduct(replacement2._id);
      const desiredProductNames = [replacement1.name, replacement2.name];

      await orderDetailsPage.openByOrderId(order._id);
      await orderDetailsPage.waitForOpened();
      await expect(orderDetailsPage.statusOrderLabel).toHaveText(ORDER_STATUS.DRAFT);
      await orderDetailsPage.requestedProducts.expectLoaded();
      await expect(orderDetailsPage.requestedProducts.editButton).toBeVisible();

      await orderDetailsPage.requestedProducts.clickEdit();

      const editProductsModal = new EditProductsModal(page);
      await editProductsModal.waitForOpened();
      await expect(editProductsModal.productRows).toHaveCount(2);

      const updatedFromUi = await editProductsModal.editOrder(desiredProductNames);
      expect(updatedFromUi.products).toHaveLength(2);

      await expect.soft(orderDetailsPage.notificationToast).toHaveText(NOTIFICATIONS.ORDER_UPDATED);
      await editProductsModal.waitForClosed();

      // Verify changes are saved in BE
      const getResponse = await ordersApi.getById(order._id, token);
      validateResponse(getResponse, {
        status: STATUS_CODES.OK,
        IsSuccess: true,
        ErrorMessage: null,
        schema: getOrderSchema,
      });
      const updatedOrder = getResponse.body.Order as IOrderFromResponse;
      expect(updatedOrder.products).toHaveLength(2);

      const actualNames = updatedOrder.products.map((p) => p.name).sort();
      expect(actualNames).toEqual(desiredProductNames.slice().sort());
      expect(actualNames).not.toEqual(originalNames);
    },
  );
});
