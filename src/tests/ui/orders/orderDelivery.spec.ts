import { TIMEOUT_50_S } from "data/salesPortal/constants";
import { test } from "fixtures";

test.describe("[Order Delivery]", () => {
  let token = "";
  test.beforeAll(async ({ loginApiService }) => {
    token = await loginApiService.loginAsAdmin();
  });

  test.beforeEach(async ({ cleanup }) => {
    void cleanup;
  });

  test.afterEach(async ({ ordersApiService }, testInfo) => {
    testInfo.setTimeout(testInfo.timeout + TIMEOUT_50_S);
    await ordersApiService.fullDelete(token);
  });

  test("[Create and Edit order delivery]", async () => {});
});
