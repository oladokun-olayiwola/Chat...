import { UserController } from "@auth/controllers/signup"
import { Router } from "express"

const router =  Router()

router.post("/signup", UserController.create)

export const AuthRouter = router
