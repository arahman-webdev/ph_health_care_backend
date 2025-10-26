import express from "express"
import { scheduleController } from "./schedule.controller"
import checkAuth from "../../middleware/checkAuth"
import { UserRole } from "@prisma/client"




const router = express.Router()

router.post("/create", scheduleController.createSchedule)
router.get("/",checkAuth(UserRole.DOCTOR, UserRole.ADMIN), scheduleController.getSchedule)
router.delete("/:id", scheduleController.deleteSchedule)


export const scheduleRoutes = router