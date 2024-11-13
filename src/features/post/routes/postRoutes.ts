import { Router } from "express";
import { Create } from "@post/controllers/post.controller";
import { checkAuthentication } from "@global/helpers/auth-middleware";
import { asyncHandler } from "@global/helpers/async-handler";
const router = Router();


router.route("/").post(checkAuthentication, asyncHandler(Create.prototype.post));
router.route("/image/post").post(checkAuthentication, asyncHandler(Create.prototype.PostwithImage));


export const PostRouter = router;