import { STATUS_CODES } from "data/statusCodes";
import { IOrderRequest } from "data/types/order.types";
import { test, expect } from "fixtures";
import { validateResponse } from "utils/validation/validateResponse.utils";

test.describe("[API][Orders][Create Order]", () => {
  let token = "";
  let orderId = "";
  let productId = "";
  let customerId = "";

  test.beforeAll(async ({ loginApiService, productsApiService, customersApiService }) => {
    //login
    token = await loginApiService.loginAsAdmin();
    //create product
    const createdProduct = await productsApiService.create(token);
    productId = createdProduct._id;
    //create customer
    const createdCustomer = await customersApiService.create(token);
    customerId = createdCustomer._id;
  });

  test.afterAll(async ({ ordersApiService, customersApiService, productsApiService }) => {
    if (orderId) {
      await ordersApiService.delete(token, orderId);
    }
    if (customerId) {
      await customersApiService.delete(token, customerId);
    }
    if (productId) {
      await productsApiService.delete(token, productId);
    }
  });

  test("Create order with product quantity = 1 (min)", async ({ ordersApi }) => {
    const payload: IOrderRequest = {
      customer: customerId,
      products: [productId],
    };

    const createOrderResponse = await ordersApi.create(token, payload);

    await validateResponse(createOrderResponse, {
      status: STATUS_CODES.CREATED,
      IsSuccess: true,
      ErrorMessage: null,
    });
    orderId = createOrderResponse.body.Order._id;

    expect(createOrderResponse.status).toBe(STATUS_CODES.CREATED);
    expect(createOrderResponse.body.IsSuccess, "Expected IsSuccess to be true").toBe(true);
    expect(createOrderResponse.body.ErrorMessage, "Expected ErrorMessage  to be null").toBe(null);
  });
});
