import { Router } from "express"
import { SignIn } from "@auth/controllers/signin"
import { logout } from "@auth/controllers/signout"
import { SignUp } from "@auth/controllers/signup"
import { Password } from "@auth/controllers/password"
import { asyncHandler } from "@global/helpers/async-handler"
const signUp = new SignUp()
const signIn = new SignIn()

const router =  Router()

router.post("/signup", asyncHandler(signUp.create))
router.post("/signin", asyncHandler(signIn.read))
router.get("/signout", asyncHandler(logout))
router.post('/forgot-password', asyncHandler(Password.prototype.create))
router.post("/reset-password/:token", asyncHandler(Password.prototype.update));

export const AuthRouter = router
