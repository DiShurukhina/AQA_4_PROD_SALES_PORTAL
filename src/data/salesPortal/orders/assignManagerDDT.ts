import { ORDER_STATUS } from "data/salesPortal/order-status";

export interface IAssignManagerTestCase {
  title: string;
  orderStatus: ORDER_STATUS;
}

/**
 * Test cases for assigning managers to orders in different statuses.
 */
export const ASSIGN_MANAGER_ORDER_STATUS_CASES: IAssignManagerTestCase[] = [
  {
    title: "Assign manager to draft order",
    orderStatus: ORDER_STATUS.DRAFT,
  },
  {
    title: "Assign manager to order in processing status",
    orderStatus: ORDER_STATUS.PROCESSING,
  },
  {
    title: "Assign manager to partially received order",
    orderStatus: ORDER_STATUS.PARTIALLY_RECEIVED,
  },
  {
    title: "Assign manager to received order",
    orderStatus: ORDER_STATUS.RECEIVED,
  },
  {
    title: "Assign manager to canceled order",
    orderStatus: ORDER_STATUS.CANCELED,
  },
];
