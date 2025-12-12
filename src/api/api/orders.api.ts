import { IApiClient } from "api/apiClients/types";
import { apiConfig } from "config/apiConfig";
import { IRequestOptions } from "data/types/core.types";
import { IOrderCreateBody, IOrderResponse, IComment } from "data/types/order.types";

export class OrdersApi {
  constructor(private apiClinet: IApiClient) {}

  async create(token: string, payload: IOrderCreateBody) {
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

  async addComment(token: string, orderId: string, payload: Partial<IComment>) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.orderComments(orderId),
      method: "post",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: { text: payload.text },
    };
    return await this.apiClinet.send<IOrderResponse>(options);
  }

  async deleteComment(token: string, orderId: string, commentId: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.orderCommentById(orderId, commentId),
      method: "delete",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.apiClinet.send<null>(options);
  }
}
