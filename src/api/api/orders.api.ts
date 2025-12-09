import { IApiClient } from "api/apiClients/types";
import { apiConfig } from "config/apiConfig";
import { IRequestOptions } from "data/types/core.types";
import { IOrderRequest, IOrderResponse } from "data/types/order.types";

export class OrdersApi {
  constructor(private apiClinet: IApiClient) {}

  async create(token: string, payload: IOrderRequest) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.orders,
      method: "post",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: payload,
    };
    return await this.apiClinet.send<IOrderResponse>(options);
  }

  async delete(token: string, _id: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.orderById(_id),
      method: "delete",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.apiClinet.send<null>(options);
  }
}
