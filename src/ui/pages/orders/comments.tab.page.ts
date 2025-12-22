import { OrderDetailsPage } from "./orderDetails.page";

export class CommentsTab extends OrderDetailsPage {
  readonly uniqueElement = this.page.locator("//h4[.='Comments']");
}
