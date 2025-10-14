
import express from "express"
import { userController } from "./user.controller"
import { upload } from "../../../config/multer.config"



const router = express.Router()

router.get("/", userController.allUsers)
router.post("/create-patient",upload.single("profile"), userController.createPatient)

export const userRoutes = router