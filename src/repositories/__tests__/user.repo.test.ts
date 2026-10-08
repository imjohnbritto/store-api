import * as userRepo from "../user.repo";
import UserModel from "../../models/user.model";

// Mock UserModel
jest.mock("../../models/user.model");

const mockedUserModel = UserModel as jest.Mocked<typeof UserModel>;

describe("User Repository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("findById", () => {
    it("should find user by id", async () => {
      const mockUser = {
        _id: "123",
        name: "John Doe",
        email: "john@example.com",
      };
      const mockQuery = {
        lean: jest.fn().mockResolvedValue(mockUser),
      };
      mockedUserModel.findById.mockReturnValue(mockQuery as any);

      const result = await userRepo.findById("123");

      expect(mockedUserModel.findById).toHaveBeenCalledWith("123");
      expect(mockQuery.lean).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it("should return null when user not found", async () => {
      const mockQuery = {
        lean: jest.fn().mockResolvedValue(null),
      };
      mockedUserModel.findById.mockReturnValue(mockQuery as any);

      const result = await userRepo.findById("123");

      expect(result).toBeNull();
    });
  });

  describe("create", () => {
    it("should create a new user", async () => {
      const mockUserData = { name: "John Doe", email: "john@example.com" };
      const mockCreatedUser = { _id: "123", ...mockUserData };
      mockedUserModel.create.mockResolvedValue(mockCreatedUser as any);

      const result = await userRepo.create(mockUserData);

      expect(mockedUserModel.create).toHaveBeenCalledWith(mockUserData);
      expect(result).toEqual(mockCreatedUser);
    });
  });

  describe("findAll", () => {
    it("should return all users", async () => {
      const mockUsers = [
        { _id: "1", name: "John Doe", email: "john@example.com" },
        { _id: "2", name: "Jane Doe", email: "jane@example.com" },
      ];
      const mockQuery = {
        lean: jest.fn().mockResolvedValue(mockUsers),
      };
      mockedUserModel.find.mockReturnValue(mockQuery as any);

      const result = await userRepo.findAll();

      expect(mockedUserModel.find).toHaveBeenCalled();
      expect(mockQuery.lean).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });
  });
});

