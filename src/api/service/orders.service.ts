import { OrdersApi } from "api/api/orders.api";
import { STATUS_CODES } from "data/statusCodes";
import { IOrderCreateBody, IOrderFromResponse, IOrderUpdateBody } from "data/types/order.types";
import { validateResponse } from "utils/validation/validateResponse.utils";

export class OrdersApiService {
  constructor(private ordersApi: OrdersApi) {}

  async create(token: string, customerId: string, productId: string[]): Promise<IOrderFromResponse> {
    const payload: IOrderCreateBody = {
      customer: customerId,
      products: productId,
    };

    const response = await this.ordersApi.create(token, payload);

    validateResponse(response, {
      status: STATUS_CODES.CREATED,
      IsSuccess: true,
      ErrorMessage: null,
      // schema: createOrderSchema,
    });

    return response.body.Order;
  }

  async delete(token: string, id: string) {
    const res = await this.ordersApi.delete(token, id);
    validateResponse(res, { status: STATUS_CODES.DELETED });
  }

  async update(token: string, id: string, payload: IOrderUpdateBody): Promise<IOrderFromResponse> {
    const res = await this.ordersApi.update(token, id, payload);
    validateResponse(res, { status: STATUS_CODES.OK });
    return res.body.Order;
  }
}
