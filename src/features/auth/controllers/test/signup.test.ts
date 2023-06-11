import { authMockRequest, authMockResponse } from "@root/mocks/auth.mock"
import { Request, Response } from "express"
import { SignUp } from "../signup"
import { CustomError } from "@global/helpers/error-handler"

jest.mock("@service/queues/base.queue");
jest.mock("@service/redis/user.cache");
jest.mock("@service/queues/user.queue");
jest.mock("@service/queues/auth.queue");
jest.mock("@global/helpers/cloudinaryUpload");
jest.mock("@service/db/auth.service");

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
})