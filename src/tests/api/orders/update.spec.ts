import { test, expect } from "fixtures/api.fixture";
import { TAGS } from "data/tags";
import { STATUS_CODES } from "data/statusCodes";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { createOrderSchema } from "data/schemas/orders/create.schema";
import { IOrderFromResponse } from "data/types/order.types";
import { ORDER_HISTORY_ACTIONS, ORDER_STATUS } from "data/salesPortal/order-status";

test.describe("[API][Orders]", () => {
  let token = "";
  let customerId = "";
  let productId = "";
  let orderId = "";
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

    const order = await ordersApiService.create(token, {
      customer: customerId,
      products: [productId],
    });
    orderId = order._id;
    cleanup.addOrder(orderId);
  });

  // No manual afterEach — cleanup handled by fixture teardown

  test(
    "ORD-PUT-001: Successful products update recalculates total_price",
    { tag: [TAGS.SMOKE, TAGS.REGRESSION, TAGS.API, TAGS.ORDERS] },
    async ({ ordersApiService, ordersApi, productsApiService }) => {
      const original: IOrderFromResponse = await ordersApiService.getById(token, orderId);

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

      const updateResp = await ordersApi.update(token, orderId, {
        customer: original.customer._id,
        products: [originalFirst._id],
      });
      validateResponse(updateResp, {
        status: STATUS_CODES.OK,
        IsSuccess: true,
        ErrorMessage: null,
        schema: createOrderSchema,
      });

      const updated = updateResp.body.Order;
      const expectedTotal = updated.products.reduce((sum, p) => sum + p.price, 0);
      expect.soft(updated.total_price).toBe(expectedTotal);
      expect.soft(updated.products[0]!.price).toBe(originalFirst.price + 100);
      expect.soft(updated._id).toBe(orderId);
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
      validateResponse(response, {
        status: STATUS_CODES.BAD_REQUEST,
      });
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
      validateResponse(response, {
        status: STATUS_CODES.NOT_FOUND,
      });
    },
  );

  test(
    "ORD-PUT-002: Successful update of customer in order",
    { tag: [TAGS.SMOKE, TAGS.REGRESSION, TAGS.API, TAGS.ORDERS] },
    async ({ ordersApiService, ordersApi, customersApiService }) => {
      const original: IOrderFromResponse = await ordersApiService.getById(token, orderId);
      const newCustomer = await customersApiService.create(token);

      const productIds = original.products.map((p) => p._id);
      const updateResp = await ordersApi.update(token, orderId, {
        customer: newCustomer._id,
        products: productIds,
      });

      validateResponse(updateResp, {
        status: STATUS_CODES.OK,
        IsSuccess: true,
        ErrorMessage: null,
        schema: createOrderSchema,
      });

      const updated = updateResp.body.Order;
      expect.soft(updated.customer._id).toBe(newCustomer._id);
      expect.soft(updated.customer._id).not.toBe(original.customer._id);

      const expectedTotal = updated.products.reduce((sum, p) => sum + p.price, 0);
      expect.soft(updated.total_price).toBe(expectedTotal);
    },
  );

  test(
    "ORD-PUT-003: Order status is DRAFT after update",
    { tag: [TAGS.REGRESSION, TAGS.API, TAGS.ORDERS] },
    async ({ ordersApiService, ordersApi }) => {
      const before = await ordersApiService.getById(token, orderId);

      const productIds = before.products.map((p) => p._id);
      const response = await ordersApi.update(token, orderId, {
        customer: before.customer._id,
        products: productIds,
      });

      validateResponse(response, {
        status: STATUS_CODES.OK,
        IsSuccess: true,
        ErrorMessage: null,
        schema: createOrderSchema,
      });

      const after = response.body.Order;
      expect.soft(after.status).toBe(ORDER_STATUS.DRAFT);
    },
  );

  test(
    "ORD-PUT-004: History entry recorded when order composition changes",
    { tag: [TAGS.REGRESSION, TAGS.API, TAGS.ORDERS] },
    async ({ ordersApiService, ordersApi, productsApiService, cleanup }) => {
      const before: IOrderFromResponse = await ordersApiService.getById(token, orderId);
      const beforeHistoryLen = before.history.length;

      const extraProduct = await productsApiService.create(token);
      extraProductId = extraProduct._id;
      cleanup.addProduct(extraProductId);
      const productIds = [before.products[0]!._id, extraProductId];

      const updateResp = await ordersApi.update(token, orderId, {
        customer: before.customer._id,
        products: productIds,
      });

      validateResponse(updateResp, {
        status: STATUS_CODES.OK,
        IsSuccess: true,
        ErrorMessage: null,
        schema: createOrderSchema,
      });

      const after = updateResp.body.Order;
      expect.soft(after.history.length).toBeGreaterThan(beforeHistoryLen);
      const changed = after.history.find((h) => h.action === ORDER_HISTORY_ACTIONS.REQUIRED_PRODUCTS_CHANGED);
      expect.soft(changed).toBeTruthy();
      expect.soft(changed!.changedOn).toBeTruthy();
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
      validateResponse(response, {
        status: STATUS_CODES.NOT_FOUND,
      });
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

      validateResponse(response, {
        status: STATUS_CODES.SERVER_ERROR,
      });
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
      validateResponse(response, {
        status: STATUS_CODES.SERVER_ERROR,
      });
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

      validateResponse(response, {
        status: STATUS_CODES.NOT_FOUND,
      });
    },
  );
});
