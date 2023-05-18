import { SignUp } from "@auth/controllers/signup"
import { Router } from "express"

const signUp = new SignUp()

const router =  Router()

router.post("/signup", signUp.create)

export const AuthRouter = router
