import { STATUS_CODES } from "data/statusCodes";
import { IOrderCreateBody } from "data/types/order.types";
import { test } from "fixtures";
import { validateResponse } from "utils/validation/validateResponse.utils";

test.describe("[API][Orders][Comment Order]", () => {
  let token = "";
  let orderId = "";
  let productId = "";
  let customerId = "";
  //   let commentId = "";

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

  test("Create comment to an order", async ({ ordersApi }) => {
    const payload: IOrderCreateBody = {
      customer: customerId,
      products: [productId],
    };

    const createOrderResponse = await ordersApi.create(token, payload);

    validateResponse(createOrderResponse, {
      status: STATUS_CODES.CREATED,
      IsSuccess: true,
      ErrorMessage: null,
    });
    orderId = createOrderResponse.body.Order._id;
  });
});
