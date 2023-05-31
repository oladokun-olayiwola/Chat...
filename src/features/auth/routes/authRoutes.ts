import { Router } from "express"
import { SignIn } from "@auth/controllers/signin"
import { logout } from "@auth/controllers/signout"
import { SignUp } from "@auth/controllers/signup"
const signUp = new SignUp()
const signIn = new SignIn()

const router =  Router()

router.post("/signup", signUp.create)
router.post("/signin", signIn.read)
router.get("/signout", logout)

export const AuthRouter = router
