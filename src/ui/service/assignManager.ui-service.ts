import { Page, expect } from "@playwright/test";
import { OrderDetailsPage } from "ui/pages/orders";
import { logStep } from "utils/report/logStep.utils.js";
import { TIMEOUT_10_S } from "data/salesPortal/constants";

/**
 * UI Service for managing order managers (assign/unassign).
 * Encapsulates manager assignment flows.
 */
export class AssignManagerUIService {
  orderDetailsPage: OrderDetailsPage;

  constructor(private page: Page) {
    this.orderDetailsPage = new OrderDetailsPage(page);
  }

  @logStep("OPEN ORDER AND NAVIGATE TO MANAGER ASSIGNMENT")
  async openOrderForManagerAssignment(orderId: string) {
    await this.orderDetailsPage.openByOrderId(orderId);
    await this.orderDetailsPage.waitForOpened();
  }

  @logStep("OPEN ASSIGN MANAGER MODAL")
  async openAssignManagerModal() {
    // Check if modal is already open
    const isOpen = await this.orderDetailsPage.assignManagerModal.uniqueElement.isVisible();

    if (!isOpen) {
      await this.orderDetailsPage.header.openAssignManagerModal();
    }

    await this.orderDetailsPage.assignManagerModal.waitForOpened();
  }

  @logStep("ASSIGN MANAGER BY NAME")
  async assignManagerByName(managerName: string) {
    await this.openAssignManagerModal();
    await this.orderDetailsPage.assignManagerModal.selectManager(managerName);
    await this.orderDetailsPage.assignManagerModal.clickSave();

    // Wait for modal to close and page to stabilize
    await this.orderDetailsPage.assignManagerModal.waitForClosed();
    await this.orderDetailsPage.waitForSpinners();
  }

  @logStep("GET AVAILABLE MANAGERS IN MODAL")
  async getAvailableManagers(): Promise<string[]> {
    await this.openAssignManagerModal();
    const managers = await this.orderDetailsPage.assignManagerModal.getAvailableManagers();
    await this.orderDetailsPage.assignManagerModal.clickCancel();
    await this.orderDetailsPage.assignManagerModal.waitForClosed();
    return managers;
  }

  @logStep("CANCEL MANAGER ASSIGNMENT")
  async cancelManagerAssignment() {
    await this.openAssignManagerModal();
    await this.orderDetailsPage.assignManagerModal.clickCancel();
    await this.orderDetailsPage.assignManagerModal.waitForClosed();
  }

  @logStep("VERIFY MANAGER ASSIGNED")
  async expectManagerAssigned(expectedManagerName: string) {
    // Manager info should be visible in the header's assigned manager container
    const assignedManagerContainer = this.page.locator("#assigned-manager-container");
    await expect(assignedManagerContainer).toContainText(expectedManagerName, { timeout: TIMEOUT_10_S });
  }

  @logStep("VERIFY NO MANAGER ASSIGNED")
  async expectNoManagerAssigned() {
    // When no manager assigned, the trigger button should be available
    const assignedManagerContainer = this.page.locator("#assigned-manager-container");
    const assignButton = assignedManagerContainer.locator('[onclick*="renderAssigneManagerModal"]').first();
    await expect(assignButton).toBeVisible({ timeout: TIMEOUT_10_S });
  }

  @logStep("UNASSIGN MANAGER")
  async unassignManager() {
    await this.orderDetailsPage.header.openUnassignManagerModal();

    // Confirmation modal should open for unassigning
    const confirmationModal = this.orderDetailsPage.confirmationModal;
    await confirmationModal.waitForOpened();
    await confirmationModal.clickConfirm();

    // Wait for modal to close and page to stabilize
    await confirmationModal.waitForClosed();
    await this.orderDetailsPage.waitForSpinners();
  }
}
