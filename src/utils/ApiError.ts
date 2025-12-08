export default class ApiError extends Error {
  status: number;
  details?: any;

  constructor(status = 500, message = "Internal Server Error", details?: any) {
    super(message);
    this.status = status;
    this.details = details;
  }
}
