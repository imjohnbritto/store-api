import * as userService from "../user.service";
import * as userRepo from "../../repositories/user.repo";
import ApiError from "../../utils/ApiError";
import { readFile } from "fs/promises";

// Mock dependencies
jest.mock("../../repositories/user.repo");
jest.mock("fs/promises");

describe("User Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getUser", () => {
    it("should return user when found", async () => {
      const mockUser = {
        _id: "123",
        name: "John Doe",
        email: "john@example.com",
      };
      (userRepo.findById as jest.Mock).mockResolvedValue(mockUser);

      const result = await userService.getUser("123");

      expect(result).toEqual(mockUser);
      expect(userRepo.findById).toHaveBeenCalledWith("123");
    });

    it("should throw ApiError with dummy data when user not found", async () => {
      const mockDummyData = [
        { id: 1, name: "John" },
        { id: 2, name: "Mike" },
      ];
      (userRepo.findById as jest.Mock).mockResolvedValue(null);
      (readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockDummyData));

      await expect(userService.getUser("123")).rejects.toThrow(ApiError);
      await expect(userService.getUser("123")).rejects.toThrow(
        "User not found!!"
      );
    });
  });

  describe("createUser", () => {
    it("should create and return user successfully", async () => {
      const mockUserData = { name: "John Doe", email: "john@example.com" };
      const mockCreatedUser = { _id: "123", ...mockUserData };
      (userRepo.create as jest.Mock).mockResolvedValue(mockCreatedUser);

      const result = await userService.createUser(mockUserData);

      expect(result).toEqual(mockCreatedUser);
      expect(userRepo.create).toHaveBeenCalledWith(mockUserData);
    });

    it("should throw ApiError when creation fails", async () => {
      const mockUserData = { name: "John Doe", email: "john@example.com" };
      const mockError = new Error("Database error");
      (userRepo.create as jest.Mock).mockRejectedValue(mockError);

      let caughtError: any;
      try {
        await userService.createUser(mockUserData);
      } catch (error) {
        caughtError = error;
      }

      expect(caughtError).toBeDefined();
      expect(caughtError).toBeInstanceOf(ApiError);
      expect(caughtError.message).toBe("Failed to create user!");
      expect(caughtError.status).toBe(500);
    });
  });

  describe("getAllUsers", () => {
    it("should return all users", async () => {
      const mockUsers = [
        { _id: "1", name: "John Doe", email: "john@example.com" },
        { _id: "2", name: "Jane Doe", email: "jane@example.com" },
      ];
      (userRepo.findAll as jest.Mock).mockResolvedValue(mockUsers);

      const result = await userService.getAllUsers();

      expect(result).toEqual(mockUsers);
      expect(userRepo.findAll).toHaveBeenCalled();
    });
  });
});
