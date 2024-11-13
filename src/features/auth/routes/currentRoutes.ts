import { currentUser } from "@auth/controllers/current-user";
import { asyncHandler } from "@global/helpers/async-handler";
import { checkAuthentication } from "@global/helpers/auth-middleware";
import { Router } from "express";

const router = Router()

router.get("/currentuser", checkAuthentication, asyncHandler(currentUser))

export const currentRouter = router