import { tables } from "harperdb";
import { faker } from "@faker-js/faker";
import type { SeedUsersBody, SeedUsersResponse } from "../utils/types/resources";
import type { UserType } from "../utils/types/user";

const { User } = tables;

// Custom log handling
const log = {
  info: (...args: unknown[]) => console.log("info:", ...args),
  error: (...args: unknown[]) => console.error("error", ...args),
};

/**
 * POST endpoint "/SeedUsers/"
 * Set custom {"count": number} in request body (default is 200)
 * @extends {User}
 */
export class SeedUsers extends User {
  /**
   * Seed users to db
   * @param {SeedUsersBody} data
   * @returns {Promise<SeedUsersResponse>}
   */
  async post(data: SeedUsersBody): Promise<SeedUsersResponse> {
    try {
      let count = 200;
      if (data?.count && !isNaN(Number(data.count)) && Number(data.count) > 0) {
        count = parseInt(data.count, 10);
      }

      log.info(`Starting to seed ${count} users...`);

      const totalUsers = await User.getRecordCount();
      const insertPromises: Promise<any>[] = [];
      for (let i = 0; i < count; i++) {
        const id: number = totalUsers.recordCount + i + 1;
        const fakeUser: UserType = this.createFakeUser(id);
        insertPromises.push(super.post(fakeUser));
      }

      await Promise.all(insertPromises);
      log.info(`Successfully seeded ${count} users`);
      return {
        success: true,
        totalSeeded: count,
      };
    } catch (err) {
      log.error("Error seeding users:", err);
      return {
        success: false,
        totalSeeded: 0,
      };
    }
  }

  /**
   * Create fake users for seeding DB
   * @param {number} id
   * @returns {UserType}
   */
  private createFakeUser(id: number): UserType {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName });
    const age = faker.number.int({ min: 18, max: 80 });
    const active = faker.datatype.boolean();

    const newUser: UserType = { id, firstName, lastName, email, age, active };
    return newUser;
  }
}
