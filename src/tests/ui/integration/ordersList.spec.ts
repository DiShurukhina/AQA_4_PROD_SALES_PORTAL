import { TAGS } from "data/tags";
import { test, expect } from "fixtures";
import { generateOrdersResponseData } from "data/salesPortal/orders/generateOrderData";
import { ordersListIntegrationData } from "data/salesPortal/orders/ordersListIntegrationData";
import { apiConfig } from "config/apiConfig";
import { SortOrder } from "data/types/core.types";

test.describe("[Integration][Orders][Table Sorting]", () => {
  const directions = ["asc", "desc"] as SortOrder[];
  for (const { title, ordersCount, sorting } of ordersListIntegrationData) {
    test(
      title,
      { tag: [TAGS.UI, TAGS.ORDERS, TAGS.REGRESSION, TAGS.INTEGRATION] },
      async ({ mock, ordersListPage }) => {
        const header = sorting!.sortField;
        const direction = sorting!.sortOrder;
        const orders = generateOrdersResponseData(ordersCount, sorting);

        // const headersMapper: Record<string, OrdersTableHeader> = {
        //   "Order Number": "orderNumber",
        //   Email: "email",
        //   Price: "price",
        //   Status: "status",
        //   Delivery: "delivery",
        //   "Assigned Manager": "assignedManager",
        //   "Created On": "createdOn",
        // };

        await mock.ordersPage({
          ...orders,
          sorting: {
            sortField: header!,
            sortOrder: directions.find((el) => el !== direction)!,
          },
        });

        await ordersListPage.open("#/orders");
        await ordersListPage.waitForOpened();

        await mock.ordersPage({
          ...orders,
          sorting: {
            sortField: header!,
            sortOrder: directions.find((el) => el !== direction)!,
          },
        });
        await mock.ordersPage({
          ...orders,
          sorting: {
            sortField: header!,
            sortOrder: direction,
          },
        });

        await ordersListPage.expectRequest(
          "GET",
          apiConfig.endpoints.orders,
          {
            sortField: header,
            sortOrder: direction,
          },
          ordersListPage.sortBy.bind(ordersListPage),
          header,
          direction,
        );

        await ordersListPage.waitForOpened();
        // expect(request.url()).toBe(
        //   `${apiConfig.baseURL}${apiConfig.endpoints.orders}?sortField=${header}&sortOrder=${direction}&page=1&limit=10`,
        // );

        await expect(ordersListPage.tableHeaderArrow(header, { direction })).toBeVisible();

        // const tableData = await ordersListPage.getTableData() as IOrderInTable[];
        // expect(tableData.length).toBe(orders.length);
        // tableData.forEach((order, i) => {
        //   const expected = _.omit(orders[i], ["_id", "notes", "amount"]);
        //   expected.createdOn = convertToDateAndTime(expected.createdOn!);
        //   expect(order).toEqual(expected);
        // });
      },
    );
  }
});
