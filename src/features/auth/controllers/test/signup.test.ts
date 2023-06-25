import {  authMockRequest, authMockResponse } from "@root/mocks/auth.mock"
import { Request, Response } from "express"
import { SignUp } from "../signup"
import { CustomError } from "@global/helpers/error-handler"
// import { UserCache } from "@services/redis/user.cache";
// import * as uploads  from "@global/helpers/cloudinaryUpload";
// import * as authService from "@services/db/auth.service";


jest.mock("@services/db/auth.service");
jest.mock("@services/queues/base.queue");
jest.mock("@services/redis/user.cache");
jest.mock("@services/queues/user.queue");
jest.mock("@services/queues/auth.queue");
jest.mock("@global/helpers/cloudinaryUpload");

describe ("Signup", () => {

    it("should throw an error if username is not available", () => {
        const req: Request = authMockRequest({}, {
            username: '',
            email: 'whatever@test.com',
            password: 'anything',
            avatarColor: 'red',
            avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
        }) as Request
        const res: Response = authMockResponse();

        SignUp.prototype.create(req, res).catch( ( error: CustomError ) => {
            expect(error.statusCode).toEqual(400);
            expect(error.serializeErrors().message).toEqual('Username is a required field')
        })
    })

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
            username: "general",
            email: "whatever@test.com",
            password: "anything",
            avatarColor: "red",
            avatarImage: "data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==",
          }
        ) as Request;
        const res: Response = authMockResponse();
        SignUp.prototype.create(req, res).catch((error: CustomError) => {
            expect(error.statusCode).toEqual(400);
            expect(error.serializeErrors().message).toEqual('Invalid username');
        })
    })
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
        expect(error.serializeErrors().message).toEqual("Invalid username");
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
        expect(error.serializeErrors().message).toEqual("Email is arequired field");
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
        expect(error.serializeErrors().message).toEqual("Invalid Password");
      });
    });

    it("should throw an error if password length is greater than maximum length", () => {
        const req: Request = authMockRequest(
          {},
          {
            username: "general",
            email: "whatever@test.com",
            password: "anythingthatwillmakeitinsanelylongsworksyeah?",
            avatarColor: "red",
            avatarImage: "data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==",
          }
        ) as Request;
        const res: Response = authMockResponse();
        SignUp.prototype.create(req, res).catch((error: CustomError) => {
            expect(error.statusCode).toEqual(400);
            expect(error.serializeErrors().message).toEqual('Invalid Password');
        })
    })
})  

