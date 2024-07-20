import express from "express"
const router = express.Router()
import MonthlyPointsHandler from "../handler/MonthlyPoints"
import WrapAsync from "../utils/WrapAsync"
import Auth from "../service/Auth"
import Pagination from "../utils/Pagination"


router.get("/", WrapAsync(Pagination), WrapAsync(MonthlyPointsHandler.index))


export default router