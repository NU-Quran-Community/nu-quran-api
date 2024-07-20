import express from "express"
const router = express.Router()
import WeeklyPointsHandler from "../handler/WeeklyPoints"
import WrapAsync from "../utils/WrapAsync"
import Auth from "../service/Auth"
import Pagination from "../utils/Pagination"


router.post("/", WrapAsync(Auth.IsAdmin), WrapAsync(WeeklyPointsHandler.create))
router.get("/", WrapAsync(Pagination), WrapAsync(WeeklyPointsHandler.index))
router.get("/dates", WrapAsync(Pagination), WrapAsync(WeeklyPointsHandler.index_dates))
router.patch("/:id", WrapAsync(Auth.IsAdmin), WrapAsync(WeeklyPointsHandler.update))
router.get("/:id", WrapAsync(WeeklyPointsHandler.show))


export default router