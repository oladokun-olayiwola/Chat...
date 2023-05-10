import { SignUp } from "@auth/controllers/signup"
import { Router } from "express"

const router =  Router()

router.post("/signup", SignUp.create)

export const AuthRouter = router
