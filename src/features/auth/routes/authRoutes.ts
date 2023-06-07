import { Router } from "express"
import { SignIn } from "@auth/controllers/signin"
import { logout } from "@auth/controllers/signout"
import { SignUp } from "@auth/controllers/signup"
import { Password } from "@auth/controllers/password"
const signUp = new SignUp()
const signIn = new SignIn()

const router =  Router()

router.post("/signup", signUp.create)
router.post("/signin", signIn.read)
router.get("/signout", logout)
router.post('/forgot-password',Password.prototype.create)
router.post("/reset-password/:token", Password.prototype.update);

export const AuthRouter = router
