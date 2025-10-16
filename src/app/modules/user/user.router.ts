
import express from "express"
import { userController } from "./user.controller"
import { upload } from "../../../config/multer.config"
import checkAuth from "../../middleware/checkAuth"
import { UserRole } from "@prisma/client"



const router = express.Router()

router.get("/",checkAuth(), userController.allUsers)
router.post("/create-patient",upload.single("profile"), userController.createPatient)

export const userRoutes = router