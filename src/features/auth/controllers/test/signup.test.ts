import {
  authMock,
  authMockRequest,
  authMockResponse,
} from "@root/mocks/auth.mock";
import { Request, Response } from "express";
import { SignUp } from "../signup";
import { CustomError } from "@global/helpers/error-handler";
import * as authService from "@services/db/auth.service";
import { UserCache } from "@services/redis/user.cache";
import * as cloudinaryUploads from "@global/helpers/cloudinaryUpload";

jest.useFakeTimers()
jest.mock("@services/db/auth.service");
jest.mock("@services/queues/base.queue");
jest.mock("@services/redis/user.cache");
jest.mock("@services/queues/user.queue");
jest.mock("@services/queues/auth.queue");
jest.mock("@global/helpers/cloudinaryUpload");

describe("Signup", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  })

  afterEach(() => {
    jest.clearAllMocks();
  })

  it("should throw an error if username is not available", () => {
    const req: Request = authMockRequest(
      {},
      {
        username: "",
        email: "whatever@test.com",
        password: "anything",
        avatarColor: "red",
        avatarImage: "data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==",
      }
    ) as Request;
    const res: Response = authMockResponse();

    SignUp.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual(
        "Username is a required field"
      );
    });
  });

  it("should throw an error if username length is less than minimum length", () => {
    const req: Request = authMockRequest(
      {},
      {
        username: "ga",
        email: "whatever@test.com",
        password: "anything",
        avatarColor: "red",
        avatarImage: "data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==",
      }
    ) as Request;
    const res: Response = authMockResponse();
    SignUp.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual("Invalid username");
    });
  });

  it("should throw an error if username length is greater than maximum length", () => {
    const req: Request = authMockRequest(
      {},
      {
        username: "generalvdfbvkfbvrfgvrdvrnkvr",
        email: "whatever@test.com",
        password: "anything",
        avatarColor: "red",
        avatarImage: "data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==",
      }
    ) as Request;
    const res: Response = authMockResponse();
    SignUp.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual("Invalid username");
    });
  });

  it("should throw an error if email is inavlid", () => {
    const req: Request = authMockRequest(
      {},
      {
        username: "general",
        email: "whatever  works",
        password: "anything",
        avatarColor: "red",
        avatarImage: "data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==",
      }
    ) as Request;
    const res: Response = authMockResponse();
    SignUp.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual("Email must be valid");
    });
  });

  it("should throw an error if email is not available", () => {
    const req: Request = authMockRequest(
      {},
      {
        username: "general",
        email: "",
        password: "anything",
        avatarColor: "red",
        avatarImage: "data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==",
      }
    ) as Request;
    const res: Response = authMockResponse();
    SignUp.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual(
        "Email is a required field"
      );
    });
  });

  it("should throw an error if password length is less than minimum length", () => {
    const req: Request = authMockRequest(
      {},
      {
        username: "general",
        email: "whatever@test.com",
        password: "89",
        avatarColor: "red",
        avatarImage: "data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==",
      }
    ) as Request;
    const res: Response = authMockResponse();
    SignUp.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual("Invalid password");
    });
  });

  it("should throw an error if password length is greater than maximum length", () => {
    const req: Request = authMockRequest(
      {},
      {
        username: "general",
        email: "whatever@test.com",
        password:
          "anythingthatwillmakeitinsanelylongsworksyeah?iamnotreallysureyetthough",
        avatarColor: "red",
        avatarImage: "data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==",
      }
    ) as Request;
    const res: Response = authMockResponse();
    SignUp.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual("Invalid password");
    });
  });

  it("should throw unauthorized error if user already exits", () => {
    const req: Request = authMockRequest(
      {},
      {
        username: "gren",
        email: "badthngds@gmail.com",
        password: "anything",
        avatarColor: "red",
        avatarImage: "data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==",
      }
    ) as Request;
    const res: Response = authMockResponse();
    jest
      .spyOn(authService, "getUserByUsernameOrEmail")
      .mockResolvedValue(authMock);
    SignUp.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual("Invalid credentials");
    });
  });

  it("should set session data for valid credentials and send correct json response", async () => {
    const req: Request = authMockRequest(
      {},
      {
        username: "Manny",
        email: "manny@me.com",
        password: "oladokun",
        avatarColor: "#9c27b0",
        avatarImage: "data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==",
      }
    ) as Request;
    const res: Response = authMockResponse();
    jest
      .spyOn(authService, "getUserByUsernameOrEmail")
      .mockResolvedValue(authMock);
    const userSpy = jest.spyOn(UserCache.prototype, "saveUserToCache");
    jest
      .spyOn(cloudinaryUploads, "uploads")
      .mockImplementation((): any =>
        Promise.resolve({ version: "1234737373", public_id: "123456" })
      );
    await SignUp.prototype.create(req, res);
    expect(req.session?.jwt).toBeDefined();
    expect(res.json).toHaveBeenCalledWith({
      message: "User created successfully",
      user: userSpy.mock.calls[0][2],
      token: req.session?.jwt,
    });
  });
});
