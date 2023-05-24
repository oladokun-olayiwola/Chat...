import { currentUser } from "@auth/controllers/current-user";
import { checkAuthentication } from "@global/helpers/auth-middleware";
import { Router } from "express";

const router = Router()

router.get("/currentuser", checkAuthentication, currentUser)

export const currentRouter = router