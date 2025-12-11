import { test } from "fixtures";
import { STATUS_CODES } from "data/statusCodes";
import { validateResponse } from "utils/validation/validateResponse.utils";

test.describe("[API][Orders][Delete Order]", () => {
  let token = "";
  let orderId = "";
  let productId = "";
  let customerId = "";

  test.beforeAll(async ({ loginApiService, productsApiService, customersApiService, ordersApiService }) => {
    //login
    token = await loginApiService.loginAsAdmin();
    //create product
    const createdProduct = await productsApiService.create(token);
    productId = createdProduct._id;
    //create customer
    const createdCustomer = await customersApiService.create(token);
    customerId = createdCustomer._id;
    //сreate order
    const createOrderResponse = await ordersApiService.create(token, customerId, [productId]);
    orderId = createOrderResponse._id;
  });

  test.afterAll(async ({ customersApiService, productsApiService }) => {
    if (customerId) {
      await customersApiService.delete(token, customerId);
    }
    if (productId) {
      await productsApiService.delete(token, productId);
    }
  });

  test("Delete order with product quantity = 1 (min)", async ({ ordersApi }) => {
    const deleteOrderResponse = await ordersApi.delete(token, orderId);

    validateResponse(deleteOrderResponse, {
      status: STATUS_CODES.DELETED,
    });
  });
});
