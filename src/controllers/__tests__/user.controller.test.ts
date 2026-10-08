import { Request, Response } from "express";
import * as userController from "../user.controller";
import * as userService from "../../services/user.service";
import mongoose from "mongoose";

// Mock dependencies
jest.mock("../../services/user.service");

const mockedUserService = userService as jest.Mocked<typeof userService>;

describe("User Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    mockRequest = {
      params: {},
      body: {},
    };

    mockResponse = {
      json: jsonMock,
      status: statusMock,
    };
  });

  describe("getUser", () => {
    it("should return all users when no id is provided", async () => {
      const mockUsers = [
        { _id: "1", name: "John Doe", email: "john@example.com" },
        { _id: "2", name: "Jane Doe", email: "jane@example.com" },
      ];
      mockedUserService.getAllUsers.mockResolvedValue(mockUsers as any);

      await userController.getUser(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockedUserService.getAllUsers).toHaveBeenCalled();
      expect(jsonMock).toHaveBeenCalledWith({ data: mockUsers });
    });

    it("should return user when valid id is provided", async () => {
      const mockUser = {
        _id: "123",
        name: "John Doe",
        email: "john@example.com",
      };
      mockRequest.params = { id: "507f1f77bcf86cd799439011" };
      mockedUserService.getUser.mockResolvedValue(mockUser as any);

      await userController.getUser(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockedUserService.getUser).toHaveBeenCalledWith(
        "507f1f77bcf86cd799439011"
      );
      expect(jsonMock).toHaveBeenCalledWith({ data: mockUser });
    });

    it("should return 400 when invalid id format is provided", async () => {
      mockRequest.params = { id: "invalid-id" };

      await userController.getUser(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "Invalid user ID format",
      });
      expect(mockedUserService.getUser).not.toHaveBeenCalled();
    });
  });

  describe("createUser", () => {
    it("should create user successfully", async () => {
      const mockUserData = { name: "John Doe", email: "john@example.com" };
      const mockCreatedUser = { _id: "123", ...mockUserData };
      mockRequest.body = mockUserData;
      mockedUserService.createUser.mockResolvedValue(mockCreatedUser as any);

      await userController.createUser(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockedUserService.createUser).toHaveBeenCalledWith(mockUserData);
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "User created successfully!",
        data: mockCreatedUser,
      });
    });

    it("should return 500 when user creation fails", async () => {
      const mockUserData = { name: "John Doe", email: "john@example.com" };
      const mockError = {
        message: "Database error",
        details: "Connection failed",
      };
      mockRequest.body = mockUserData;
      mockedUserService.createUser.mockRejectedValue(mockError);

      await userController.createUser(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "Failed to create user!",
        errors: mockError.details || mockError.message,
      });
    });
  });
});

