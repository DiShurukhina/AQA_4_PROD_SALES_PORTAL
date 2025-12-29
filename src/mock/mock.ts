import { Page } from "@playwright/test";
import { apiConfig } from "config/apiConfig";
import { STATUS_CODES } from "data/statusCodes";
import { IProductResponse, IProductsResponse, IProductsSortedResponse } from "data/types/product.types";
import { IResponseMetrics } from "data/types/metrics.types";
import { IOrdersResponse, IOrderResponse } from "data/types/order.types";
import { ICustomersResponse } from "data/types/customer.types";
import { IResponseFields } from "data/types/core.types";

export class Mock {
  constructor(private page: Page) {}

  async productsPage(body: IProductsSortedResponse, statusCode: STATUS_CODES = STATUS_CODES.OK) {
    await this.page.route(/\/api\/products(\?.*)?$/, async (route) => {
      await route.fulfill({
        status: statusCode,
        contentType: "application/json",
        body: JSON.stringify(body),
      });
    });
  }

  async productDetailsModal(body: IProductResponse, statusCode: STATUS_CODES = STATUS_CODES.OK) {
    await this.page.route(apiConfig.baseURL + apiConfig.endpoints.productById(body.Product._id), async (route) => {
      await route.fulfill({
        status: statusCode,
        contentType: "application/json",
        body: JSON.stringify(body),
      });
    });
  }

  async metricsHomePage(body: IResponseMetrics, statusCode: STATUS_CODES = STATUS_CODES.OK) {
    await this.page.route(apiConfig.baseURL + apiConfig.endpoints.metrics, async (route) => {
      await route.fulfill({
        status: statusCode,
        contentType: "application/json",
        body: JSON.stringify(body),
      });
    });
  }

  async ordersPage(body: IOrdersResponse, statusCode: STATUS_CODES = STATUS_CODES.OK) {
    await this.page.route(apiConfig.baseURL + apiConfig.endpoints.orders, async (route) => {
      await route.fulfill({
        status: statusCode,
        contentType: "application/json",
        body: JSON.stringify(body),
      });
    });
  }

  async orderDetailsModal(body: IOrderResponse, statusCode: STATUS_CODES = STATUS_CODES.OK) {
    await this.page.route(apiConfig.baseURL + apiConfig.endpoints.orderById(body.Order._id), async (route) => {
      await route.fulfill({
        status: statusCode,
        contentType: "application/json",
        body: JSON.stringify(body),
      });
    });
  }

  async createOrderModal(body: IOrderResponse | IResponseFields, statusCode: STATUS_CODES = STATUS_CODES.CREATED) {
    await this.page.route(apiConfig.baseURL + apiConfig.endpoints.orders, async (route) => {
      await route.fulfill({
        status: statusCode,
        contentType: "application/json",
        body: JSON.stringify(body),
      });
    });
  }

  async getCustomersAll(body: ICustomersResponse | IResponseFields, statusCode: STATUS_CODES = STATUS_CODES.OK) {
    await this.page.route(apiConfig.baseURL + apiConfig.endpoints.customersAll, async (route) => {
      await route.fulfill({
        status: statusCode,
        contentType: "application/json",
        body: JSON.stringify(body),
      });
    });
  }

  async getProductsAll(body: IProductsResponse | IResponseFields, statusCode: STATUS_CODES = STATUS_CODES.OK) {
    await this.page.route(apiConfig.baseURL + apiConfig.endpoints.productsAll, async (route) => {
      await route.fulfill({
        status: statusCode,
        contentType: "application/json",
        body: JSON.stringify(body),
      });
    });
  }
}
