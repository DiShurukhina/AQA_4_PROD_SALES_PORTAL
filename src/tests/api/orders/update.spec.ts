import { test, expect } from "fixtures/api.fixture";
import { TAGS } from "data/tags";
import { STATUS_CODES } from "data/statusCodes";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { IOrderFromResponse, IOrderHistory } from "data/types/order.types";
import { ORDER_HISTORY_ACTIONS, ORDER_STATUS } from "data/salesPortal/order-status";

test.describe("[API][Orders]", () => {
  let token = "";
  let customerId = "";
  let productId = "";
  let orderId = "";
  let orderObj: IOrderFromResponse | null = null;
  let extraProductId = ""; // used in tests that add a product

  test.beforeAll(async ({ loginApiService }) => {
    token = await loginApiService.loginAsAdmin();
  });

  test.beforeEach(async ({ customersApiService, productsApiService, ordersApiService, cleanup }) => {
    const customer = await customersApiService.create(token);
    customerId = customer._id;
    cleanup.addCustomer(customerId);

    const product = await productsApiService.create(token);
    productId = product._id;
    cleanup.addProduct(productId);

    const order = await ordersApiService.create(token, customerId, [productId]);
    orderId = order._id;
    orderObj = order;
    cleanup.addOrder(orderId);
  });

  // Cleanup is handled by fixture teardown

  test(
    "ORD-PUT-001: Successful products update recalculates total_price",
    { tag: [TAGS.SMOKE, TAGS.REGRESSION, TAGS.API, TAGS.ORDERS] },
    async ({ ordersApiService, productsApiService }) => {
      test.skip(
        process.env.SALES_PORTAL_API_URL?.includes("aqa-course-project.app") ?? false,
        "Known prod limitation: backend does not support updating product prices in existing orders via PUT /orders/{id}",
      );
      const original: IOrderFromResponse = orderObj!;

      expect.soft(original.products.length).toBeGreaterThan(0);
      const originalFirst = original.products[0]!;

      // Update product price itself, then trigger order update to recalc total
      const updatedProduct: import("data/types/product.types").IProduct = {
        name: originalFirst.name,
        manufacturer: originalFirst.manufacturer,
        amount: originalFirst.amount,
        price: originalFirst.price + 100,
      };
      await productsApiService.update(token, originalFirst._id, updatedProduct);

      const updated = await ordersApiService.update(token, orderId, {
        customer: original.customer._id,
        products: [originalFirst._id],
      });
      const expectedTotal = updated.products.reduce(
        (sum: number, p: IOrderFromResponse["products"][number]) => sum + p.price,
        0,
      );
      expect.soft(updated.total_price).toBe(expectedTotal);
      expect.soft(updated.products[0]!.price).toBe(originalFirst.price + 100);
      expect.soft(updated._id).toBe(orderId);
    },
  );

  test(
    "ORD-PUT-002: Successful update of customer in order",
    { tag: [TAGS.SMOKE, TAGS.REGRESSION, TAGS.API, TAGS.ORDERS] },
    async ({ ordersApiService, customersApiService, cleanup }) => {
      const original: IOrderFromResponse = orderObj!;
      const newCustomer = await customersApiService.create(token);
      cleanup.addCustomer(newCustomer._id);

      const productIds = original.products.map((p) => p._id);
      const updated = await ordersApiService.update(token, orderId, {
        customer: newCustomer._id,
        products: productIds,
      });
      expect.soft(updated.customer._id).toBe(newCustomer._id);
      expect.soft(updated.customer._id).not.toBe(original.customer._id);

      const expectedTotal = updated.products.reduce(
        (sum: number, p: IOrderFromResponse["products"][number]) => sum + p.price,
        0,
      );
      expect.soft(updated.total_price).toBe(expectedTotal);
    },
  );

  test(
    "ORD-PUT-003: Order status is DRAFT after update",
    { tag: [TAGS.REGRESSION, TAGS.API, TAGS.ORDERS] },
    async ({ ordersApiService }) => {
      const before = orderObj!;

      const productIds = before.products.map((p) => p._id);
      const after = await ordersApiService.update(token, orderId, {
        customer: before.customer._id,
        products: productIds,
      });
      expect.soft(after.status).toBe(ORDER_STATUS.DRAFT);
    },
  );

  test(
    "ORD-PUT-004: History entry recorded when order composition changes",
    { tag: [TAGS.REGRESSION, TAGS.API, TAGS.ORDERS] },
    async ({ ordersApiService, productsApiService, cleanup }) => {
      test.skip(
        process.env.SALES_PORTAL_API_URL?.includes("aqa-course-project.app") ?? false,
        "Known prod limitation: backend does not support adding products to existing orders via PUT /orders/{id}",
      );
      const before: IOrderFromResponse = orderObj!;
      const beforeHistoryLen = before.history.length;

      const extraProduct = await productsApiService.create(token);
      extraProductId = extraProduct._id;
      cleanup.addProduct(extraProductId);
      const productIds = [before.products[0]!._id, extraProductId];

      const after = await ordersApiService.update(token, orderId, {
        customer: before.customer._id,
        products: productIds,
      });
      expect.soft(after.history.length).toBeGreaterThan(beforeHistoryLen);
      const changed = after.history.find(
        (h: IOrderHistory) => h.action === ORDER_HISTORY_ACTIONS.REQUIRED_PRODUCTS_CHANGED,
      );
      expect.soft(changed).toBeTruthy();
      expect.soft(changed?.changedOn).toBeTruthy();
    },
  );

  test(
    "ORD-PUT-005: Update attempt for non-existent order returns 404",
    { tag: [TAGS.REGRESSION, TAGS.API, TAGS.ORDERS] },
    async ({ ordersApi }) => {
      const nonExistentOrderId = "ffffffffffffffffffffffff"; // valid ObjectId format, not existing
      const response = await ordersApi.update(token, nonExistentOrderId, {
        customer: customerId,
        products: [productId],
      });

      // Only assert status to avoid guessing backend error text
      validateResponse(response, { status: STATUS_CODES.NOT_FOUND });
    },
  );

  test(
    "ORD-PUT-006: Validation error on non-existent product id in products array",
    { tag: [TAGS.REGRESSION, TAGS.API, TAGS.ORDERS] },
    async ({ ordersApi }) => {
      const fakeProductId = "ffffffffffffffffffffffff";
      const response = await ordersApi.update(token, orderId, {
        customer: customerId,
        products: [productId, fakeProductId],
      });
      validateResponse(response, { status: STATUS_CODES.NOT_FOUND });
    },
  );

  test(
    "ORD-PUT-007: Validation error on invalid ObjectId format",
    { tag: [TAGS.REGRESSION, TAGS.API, TAGS.ORDERS] },
    async ({ ordersApi }) => {
      const invalidOrderId = "123"; // invalid ObjectId format
      const response = await ordersApi.update(token, invalidOrderId, {
        customer: customerId,
        products: [productId],
      });
      validateResponse(response, { status: STATUS_CODES.SERVER_ERROR });
    },
  );

  test(
    "ORD-PUT-008: Unauthorized update without token",
    { tag: [TAGS.REGRESSION, TAGS.API, TAGS.ORDERS] },
    async ({ ordersApi }) => {
      const response = await ordersApi.update("", orderId, {
        products: [],
      } as unknown as import("data/types/order.types").IOrderUpdateBody);
      // Expect HTTP 401 with error envelope
      expect.soft(response.status).toBe(STATUS_CODES.UNAUTHORIZED);
    },
  );

  test(
    "ORD-PUT-009: Validation error on invalid customer ObjectId format",
    { tag: [TAGS.REGRESSION, TAGS.API, TAGS.ORDERS] },
    async ({ ordersApi }) => {
      const invalidCustomerId = "123";
      const response = await ordersApi.update(token, orderId, {
        customer: invalidCustomerId,
        products: [productId],
      });
      // Backend returns 500 for invalid customer id format currently
      validateResponse(response, { status: STATUS_CODES.SERVER_ERROR });
    },
  );

  test(
    "ORD-PUT-010: Validation error on non-existent customer id",
    { tag: [TAGS.REGRESSION, TAGS.API, TAGS.ORDERS] },
    async ({ ordersApi }) => {
      const nonExistentCustomerId = "ffffffffffffffffffffffff";
      const response = await ordersApi.update(token, orderId, {
        customer: nonExistentCustomerId,
        products: [productId],
      });

      // Backend may return 404 or 400; assert actual 404 observed in similar cases
      validateResponse(response, { status: STATUS_CODES.NOT_FOUND });
    },
  );

  test(
    "ORD-PUT-011: Validation error on empty products array",
    { tag: [TAGS.REGRESSION, TAGS.API, TAGS.ORDERS] },
    async ({ ordersApi }) => {
      const response = await ordersApi.update(token, orderId, {
        customer: customerId,
        products: [],
      });

      // Expect 400 for invalid business payload
      validateResponse(response, { status: STATUS_CODES.BAD_REQUEST });
    },
  );

  test(
    "ORD-PUT-012: Cannot delete linked product/customer until order is deleted",
    { tag: [TAGS.REGRESSION, TAGS.API, TAGS.ORDERS] },
    async ({ productsApi, customersApi }) => {
      const original: IOrderFromResponse = orderObj!;

      // Use raw API to read actual status for constraint violation
      const deleteProductResponse = await productsApi.delete(token, original.products[0]!._id);
      // Assert non-success (constraint violation): any 4xx or 5xx is acceptable across envs
      expect.soft(deleteProductResponse.status).not.toBe(STATUS_CODES.DELETED);
      expect.soft(deleteProductResponse.status).toBeGreaterThanOrEqual(400);

      // Use raw API to read actual status for customer constraint violation
      const deleteCustomerResponse = await customersApi.delete(token, original.customer._id);
      expect.soft(deleteCustomerResponse.status).not.toBe(STATUS_CODES.DELETED);
      expect.soft([STATUS_CODES.BAD_REQUEST, STATUS_CODES.CONFLICT]).toContain(deleteCustomerResponse.status);

      // Cleanup proceeds later via fixture after order deletion
    },
  );

  test(
    "ORD-PUT-013: PUT with no changes keeps history stable (no products-changed)",
    { tag: [TAGS.REGRESSION, TAGS.API, TAGS.ORDERS] },
    async ({ ordersApiService }) => {
      const before = orderObj!;

      const productIds = before.products.map((p) => p._id);
      const after = await ordersApiService.update(token, orderId, {
        customer: before.customer._id,
        products: productIds,
      });

      // If history grew, ensure no new products-changed entry was added
      const beforeCount = before.history.filter(
        (h: IOrderHistory) => h.action === ORDER_HISTORY_ACTIONS.REQUIRED_PRODUCTS_CHANGED,
      ).length;
      const afterCount = after.history.filter(
        (h: IOrderHistory) => h.action === ORDER_HISTORY_ACTIONS.REQUIRED_PRODUCTS_CHANGED,
      ).length;
      expect.soft(afterCount).toBe(beforeCount);
    },
  );
});
