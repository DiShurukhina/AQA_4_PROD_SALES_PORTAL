import { IApiClient } from "api/apiClients/types";
import { apiConfig } from "config/apiConfig";
import { IRequestOptions } from "data/types/core.types";
import type { IUser } from "data/types/user.types";
import { logStep } from "utils/report/logStep.utils";

export type CreateUserDto = {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
};

/**
 * Users/Managers API endpoints.
 */
export class UsersApi {
  constructor(private apiClient: IApiClient) {}

  /**
   * Create a new user (manager).
   * POST /api/users
   */
  @logStep("CREATE /api/users")
  async createUser(token: string, user: CreateUserDto) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.users,
      method: "post",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: user,
    };
    return await this.apiClient.send<{ User: IUser; IsSuccess: boolean; ErrorMessage: string | null }>(options);
  }

  /**
   * Delete a user by ID.
   * DELETE /api/users/:id
   */
  @logStep("DELETE /api/users/:id")
  async deleteUser(token: string, userId: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: `${apiConfig.endpoints.users}/${userId}`,
      method: "delete",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.apiClient.send<{ IsSuccess: boolean; ErrorMessage: string | null; User: IUser }>(options);
  }

  /**
   * Get all users.
   * GET /api/users
   */
  @logStep("GET /api/users")
  async getAllUsers(token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.users,
      method: "get",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.apiClient.send<{ Users: IUser[]; IsSuccess: boolean; ErrorMessage: string | null }>(options);
  }

  /**
   * Get user by ID.
   * GET /api/users/:id
   */
  @logStep("GET /api/users/:id")
  async getUserById(token: string, userId: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: `${apiConfig.endpoints.users}/${userId}`,
      method: "get",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.apiClient.send<{
      User: IUser;
      Orders: any[];
      IsSuccess: boolean;
      ErrorMessage: string | null;
    }>(options);
  }
}
