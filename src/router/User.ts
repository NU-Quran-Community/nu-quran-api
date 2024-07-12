import express from "express"
const router = express.Router()
import UserHandler from "../handler/User"
import WrapAsync from "../utils/WrapAsync"
import Auth from "../service/Auth"
import Pagination from "../utils/Pagination"


router.post("/", WrapAsync(Auth.IsAdmin), WrapAsync(UserHandler.create))
router.get("/", WrapAsync(Pagination), WrapAsync(UserHandler.index))
router.get("/:id", WrapAsync(Pagination), WrapAsync(UserHandler.show))
router.post("/login", WrapAsync(UserHandler.login))
router.post("/logout", WrapAsync(UserHandler.logout))


export default router