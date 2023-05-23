import { currentUser } from "@auth/controllers/current-user";
import { Router } from "express";

const router = Router()

router.get("/currentuser", currentUser)

export const currentRouter = router