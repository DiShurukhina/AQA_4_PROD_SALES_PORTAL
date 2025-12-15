import { test } from "fixtures/api.fixture";
import { validateResponse } from "utils/validation/validateResponse.utils";
import {
  CREATE_DELIVERY_POSITIVE_CASES,
  CREATE_DELIVERY_NEGATIVE_CASES,
} from "data/salesPortal/orders/createDeliveryDDT";
import { IDeliveryInfo } from "data/salesPortal/delivery-status";
import { TAGS } from "data/tags";
//import { orderFromResponseSchema } from "data/schemas/orders/order.schema";
//import { deliveryInfoSchema } from "data/schemas/delivery/delivery.schema";

test.describe("[API][Orders][Delivery]", () => {
  let token: string;
  let orderId: string;
  let productIds: string[] = [];
  let customerId: string;

  test.beforeAll(async ({ loginApiService, productsApiService, customersApiService, ordersApiService }) => {
    //login
    token = await loginApiService.loginAsAdmin();
    //create product
    const createdProduct = await productsApiService.create(token);
    productIds = [createdProduct._id];
    //create customer
    const createdCustomer = await customersApiService.create(token);
    customerId = createdCustomer._id;
    //create order
    const createdOrder = await ordersApiService.create(token, customerId, productIds);
    orderId = createdOrder._id;
  });

  test.describe("[Add Delivery Info]", () => {
    for (const positiveCase of CREATE_DELIVERY_POSITIVE_CASES) {
      test(
        positiveCase.title,
        { tag: [TAGS.SMOKE, TAGS.REGRESSION, TAGS.API, TAGS.ORDERS] },
        async ({ deliveryApi }) => {
          const addDeliveryResponse = await deliveryApi.addDelivery(
            token,
            orderId,
            positiveCase.deliveryData as unknown as IDeliveryInfo,
          );
          validateResponse(addDeliveryResponse, {
            status: positiveCase.expectedStatus,
            //schema: orderFromResponseSchema,
            IsSuccess: true,
            ErrorMessage: positiveCase.expectedErrorMessage,
          });
          //const actualDeliveryData = addDeliveryResponse.body.DeliveryInfo;
          //expect(actualDeliveryData).toMatchObject(positiveCase.deliveryData);
        },
      );
    }

    test.describe("[Should NOT add Delivery Info]", () => {
      for (const negativeCase of CREATE_DELIVERY_NEGATIVE_CASES) {
        test(negativeCase.title, { tag: [TAGS.REGRESSION, TAGS.API, TAGS.ORDERS] }, async ({ deliveryApi }) => {
          const addDeliveryResponse = await deliveryApi.addDelivery(
            token,
            orderId,
            negativeCase.deliveryData as unknown as IDeliveryInfo,
          );
          validateResponse(addDeliveryResponse, {
            status: negativeCase.expectedStatus,
            IsSuccess: false,
            ErrorMessage: negativeCase.expectedErrorMessage,
          });
        });
      }
    });
  });
});
