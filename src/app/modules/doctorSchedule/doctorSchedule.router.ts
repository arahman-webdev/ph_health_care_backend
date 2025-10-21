import express from "express"
import { DoctorScheduleController } from "./doctorSchedule.controller"
import checkAuth from "../../middleware/checkAuth"
import { UserRole } from "@prisma/client"





const router = express.Router()

router.post("/doctor-schedule", checkAuth(UserRole.DOCTOR), DoctorScheduleController.createSchedule)



export const DoctorScheduleRoutes = router