import express from "express"
import { DoctorScheduleController } from "./doctorSchedule.controller"
import checkAuth from "../../middleware/checkAuth"
import { UserRole } from "@prisma/client"






const router = express.Router()

router.post("/doctor-schedule",checkAuth(UserRole.DOCTOR), DoctorScheduleController.createSchedule)
router.get("/doctor-schedule",DoctorScheduleController.getDoctorBookedSchedule)

export const DoctorScheduleRoutes = router