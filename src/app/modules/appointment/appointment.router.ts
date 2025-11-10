import express from "express";
import { AppointmentController } from "./appointment.controller";
import checkAuth from "../../middleware/checkAuth";
import { UserRole } from "@prisma/client";


const router = express.Router();

router.post('/', checkAuth(UserRole.PATIENT), AppointmentController.createAppointment)

export const AppointmentRoutes = router;