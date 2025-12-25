import type { OrdersTableHeader } from "data/types/order.types";
import type { ExportFormat } from "ui/pages/export.modal";
import { ordersFieldNamesMapper } from "ui/pages/export.modal";

export type ExportOrdersField = keyof typeof ordersFieldNamesMapper;

export interface IExportOrdersPositiveCase {
  title: string;

  // When undefined, test should not change format and rely on default.
  selectFormat?: ExportFormat;
  expectedFormat: ExportFormat;

  // Fields to select in Export modal.
  // Use "ALL" to click/select all.
  fields: ExportOrdersField[] | "ALL";

  //Optional precondition: apply sorting in UI table before exporting.
  sort?: {
    by: OrdersTableHeader;
    direction: "asc" | "desc";
  };

  // Optional precondition: ensure table is empty (no rows).
  tableState?: "empty" | "non-empty";
}

export interface IExportOrdersNegativeCase {
  title: string;

  // Set to null to model "no format selected".
  // (If UI always has a default format selected, this negative case may be non-applicable.)
  selectFormat: ExportFormat | null;

  // Fields to check in Export modal.
  // When empty array: no options selected.
  fields: ExportOrdersField[];

  // Business validation expectation (UI behavior is asserted in tests).
  expectedError: "noFieldsSelected" | "noFormatSelected" | "missingRequiredFields";

  // For "missingRequiredFields" scenario: what fields are intentionally omitted.
  missingRequiredFields?: ExportOrdersField[];
}

export const EXPORT_ORDERS_POSITIVE_CASES: IExportOrdersPositiveCase[] = [
  {
    title: "JSON => all",
    selectFormat: "JSON",
    expectedFormat: "JSON",
    fields: "ALL",
  },
  {
    title: "CSV => 1",
    selectFormat: "CSV",
    expectedFormat: "CSV",
    fields: ["Status"],
  },
  {
    title: "CSV => default pre-selected",
    expectedFormat: "CSV",
    fields: ["Status", "Total Price", "Customer", "Products", "Created On"],
  },
];

export const EXPORT_ORDERS_NEGATIVE_CASES: IExportOrdersNegativeCase[] = [
  {
    title: "W/o selected options in checkboxes",
    selectFormat: "CSV",
    fields: [],
    expectedError: "noFieldsSelected",
  },
  {
    title: "W/o selected format",
    selectFormat: null,
    fields: [],
    expectedError: "noFormatSelected",
  },
];
