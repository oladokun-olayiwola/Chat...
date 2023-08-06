import { Request, Response } from "express";
import * as currentUser  from "@auth/controllers/current-user";
import {
  authMockRequest,
  authMockResponse,
  authUserPayload,
} from "@root/mocks/auth.mock";
import { existingUser } from "@root/mocks/user.mock";
import { UserCache } from "@services/redis/user.cache";
import { IUserDocument } from "@user/interfaces/user.interface";

jest.mock("@services/queues/base.queue");
jest.mock("@services/redis/user.cache");
jest.mock("@services/db/user.service");

const USERNAME = "Gene";
const PASSWORD = "oladokun";

describe("CurrentUser", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("token", () => {
    it("should set session token to null and send correct json response", async () => {
      const req: Request = authMockRequest(
        {},
        { username: USERNAME, password: PASSWORD },
        authUserPayload
      ) as Request;
      const res: Response = authMockResponse();
      jest
        .spyOn(UserCache.prototype, "getUserFromCache")
        .mockResolvedValue({} as IUserDocument);

      await currentUser.currentUser(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        token: null,
        isUser: false,
        user: null,
        message: "User active"
      });
    });

    it("should set session token and send correct json response", async () => {
      const req: Request = authMockRequest(
        { jwt: "12djdj34" },
        { username: USERNAME, password: PASSWORD },
        authUserPayload
      ) as Request;
      const res: Response = authMockResponse();
      jest
        .spyOn(UserCache.prototype, "getUserFromCache")
        .mockResolvedValue(existingUser);

      await currentUser.currentUser(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        token: req.session?.jwt,
        isUser: true,
        user: existingUser,
        message: "User active"
      });
    });
  });
});
