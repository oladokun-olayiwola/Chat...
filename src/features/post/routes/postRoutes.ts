import { Router } from "express";
import { Create } from "@post/controllers/post.controller";
import { checkAuthentication } from "@global/helpers/auth-middleware";
const router = Router();


router.route("/").post(checkAuthentication, Create.prototype.post);
router.route("/image/post").post(checkAuthentication, Create.prototype.PostwithImage);


export const PostRouter = router;