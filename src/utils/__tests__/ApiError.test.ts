import ApiError from "../ApiError";

describe("ApiError", () => {
  it("should create an error with default values", () => {
    const error = new ApiError();

    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe("Internal Server Error");
    expect(error.status).toBe(500);
    expect(error.details).toBeUndefined();
  });

  it("should create an error with custom status and message", () => {
    const error = new ApiError(404, "Not Found");

    expect(error.message).toBe("Not Found");
    expect(error.status).toBe(404);
    expect(error.details).toBeUndefined();
  });

  it("should create an error with details", () => {
    const details = { field: "email", message: "Email is required" };
    const error = new ApiError(400, "Validation Error", details);

    expect(error.message).toBe("Validation Error");
    expect(error.status).toBe(400);
    expect(error.details).toEqual(details);
  });

  it("should be throwable and catchable", () => {
    const error = new ApiError(404, "Resource not found");

    expect(() => {
      throw error;
    }).toThrow(ApiError);

    try {
      throw error;
    } catch (e) {
      expect(e).toBeInstanceOf(ApiError);
      expect((e as ApiError).status).toBe(404);
      expect((e as ApiError).message).toBe("Resource not found");
    }
  });
});

