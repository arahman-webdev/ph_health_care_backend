import express from "express"
import { scheduleController } from "./schedule.controller"




const router = express.Router()

router.post("/create", scheduleController.createSchedule)
router.get("/", scheduleController.getSchedule)
router.delete("/:id", scheduleController.deleteSchedule)


export const scheduleRoutes = router