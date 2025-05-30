import { SeedUsers } from "../src/controllers/resources";
import { tables } from "harperdb";

describe("SeedUsers", () => {
    let seedUsers: SeedUsers;

    beforeEach(() => {
        seedUsers = new SeedUsers("test-id", {});
        jest.restoreAllMocks();
    });

    it("Should seed default 200 users when no count provided", async () => {
        const getRecordCountSpy = jest
            .spyOn(tables.User, "getRecordCount")
            .mockResolvedValue({ recordCount: 0 });

        const superPostSpy = jest
            .spyOn(Object.getPrototypeOf(SeedUsers.prototype), "post")
            .mockResolvedValue({});

        const result = await seedUsers.post({});

        expect(getRecordCountSpy).toHaveBeenCalled();
        expect(superPostSpy).toHaveBeenCalledTimes(200);
        expect(result).toEqual({
            success: true,
            totalSeeded: 200,
        });
    });

    it("Should seed custom count when provided", async () => {
        const getRecordCountSpy = jest
            .spyOn(tables.User, "getRecordCount")
            .mockResolvedValue({ recordCount: 0 });

        const superPostSpy = jest
            .spyOn(Object.getPrototypeOf(SeedUsers.prototype), "post")
            .mockResolvedValue({});

        const result = await seedUsers.post({ count: "5" });

        expect(getRecordCountSpy).toHaveBeenCalled();
        expect(superPostSpy).toHaveBeenCalledTimes(5);
        expect(result).toEqual({
            success: true,
            totalSeeded: 5,
        });
    });

    it("Should handle large counts efficiently", async () => {
        jest.spyOn(tables.User, "getRecordCount").mockResolvedValue({ recordCount: 0 });

        const superPostSpy = jest.spyOn(Object.getPrototypeOf(SeedUsers.prototype), "post").mockResolvedValue({});
        const result = await seedUsers.post({ count: "1000" });

        expect(superPostSpy).toHaveBeenCalledTimes(1000);
        expect(result).toEqual({ success: true, totalSeeded: 1000 });
    });

    it("Should handle database errors during seeding (getRecordCount fails)", async () => {
        jest.spyOn(tables.User, "getRecordCount").mockRejectedValue(new Error("DB read error"));

        const superPostSpy = jest.spyOn(Object.getPrototypeOf(SeedUsers.prototype), "post").mockResolvedValue({});
        const result = await seedUsers.post({ count: "10" });

        expect(superPostSpy).not.toHaveBeenCalled();
        expect(result).toEqual({ success: false, totalSeeded: 0 });
    });

    it("Should handle errors during user creation (super.post throws)", async () => {
        jest.spyOn(tables.User, "getRecordCount").mockResolvedValue({ recordCount: 0 });
        jest.spyOn(Object.getPrototypeOf(SeedUsers.prototype), "post").mockRejectedValue(new Error("Insert error"));

        const result = await seedUsers.post({ count: "10" });

        expect(result).toEqual({ success: false, totalSeeded: 0 });
    });

    it("Should handle partial failures during batch operations", async () => {
        jest.spyOn(tables.User, "getRecordCount").mockResolvedValue({ recordCount: 0 });

        const superPostSpy = jest.spyOn(Object.getPrototypeOf(SeedUsers.prototype), "post").mockImplementation((user: any) => {
            if (user.id % 2 === 0) return Promise.reject(new Error("Fail for even ID"));
            return Promise.resolve({});
        });

        const result = await seedUsers.post({ count: "6" });

        expect(superPostSpy).toHaveBeenCalledTimes(6);
        expect(result).toEqual({ success: false, totalSeeded: 0 }); // because catch block is hit
    });
});
