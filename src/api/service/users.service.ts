import { UsersApi, type CreateUserDto } from "api/api/users.api";
import type { IUser } from "data/types/user.types";
import { faker } from "@faker-js/faker";
import { logStep } from "utils/report/logStep.utils.js";

/**
 * Users/Managers service for high-level business operations.
 */
export class UsersService {
  constructor(private usersApi: UsersApi) {}

  /**
   * Create a new manager with random data.
   */
  @logStep("CREATE MANAGER - API")
  async createManager(token: string): Promise<IUser> {
    const userData: CreateUserDto = {
      username: faker.internet.email(),
      password: "TestPassword123!",
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
    };

    const response = await this.usersApi.createUser(token, userData);
    return response.body.User;
  }

  /**
   * Create a manager with custom data.
   */
  @logStep("CREATE MANAGER WITH DATA - API")
  async createManagerWithData(token: string, userData: CreateUserDto): Promise<IUser> {
    const response = await this.usersApi.createUser(token, userData);
    return response.body.User;
  }

  /**
   * Delete a user by ID.
   */
  @logStep("DELETE USER - API")
  async deleteUser(token: string, userId: string): Promise<void> {
    await this.usersApi.deleteUser(token, userId);
  }

  /**
   * Get all users.
   */
  @logStep("GET ALL USERS - API")
  async getAllUsers(token: string): Promise<IUser[]> {
    const response = await this.usersApi.getAllUsers(token);
    return response.body.Users;
  }
}
