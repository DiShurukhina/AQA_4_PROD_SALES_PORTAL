import { IApiClient } from "api/apiClients/types";
import { apiConfig } from "config/apiConfig";
import { IRequestOptions } from "data/types/core.types";
import {
  ICustomer,
  ICustomerResponse,
  ICustomerListResponse,
  ICustomersResponse,
} from "data/types/customer.types";
import { logStep } from "utils/report/logStep.utils";
import { convertRequestParams } from "utils/queryParams.utils";

export class CustomersApi {
  constructor(private apiClient: IApiClient) {}

  @logStep("POST /api/customer")
  async create(token: string, customer: ICustomer) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.customers,
      method: "post",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: customer,
    };
    return await this.apiClient.send<ICustomerResponse>(options);
  }

  @logStep("DELETE /api/customer")
  async delete(token: string, _id: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.customerById(_id),
      method: "delete",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    return await this.apiClient.send<null>(options);
  }

  @logStep("GET /api/customers (filtered)")
  async getList(
    token: string,
    params: Record<string, string | number | Array<string>>,
  ) {
    const query = convertRequestParams(params);
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: `${apiConfig.endpoints.customers}${query}`,
      method: "get",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.apiClient.send<ICustomerListResponse>(options);
  }

  @logStep("GET /api/customers/all")
  async getAll(token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.customersAll,
      method: "get",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.apiClient.send<ICustomersResponse>(options);
  }

  @logStep("GET /api/customers/{id}")
  async getById(token: string, _id: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.customerById(_id),
      method: "get",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.apiClient.send<ICustomerResponse>(options);
  }

  @logStep("PUT /api/customers/{id}")
  async update(token: string, _id: string, customer: Partial<ICustomer>) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.customerById(_id),
      method: "put",
      headers: {
        "content-type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: customer,
    };
    return await this.apiClient.send<ICustomerResponse>(options);
  }
}
