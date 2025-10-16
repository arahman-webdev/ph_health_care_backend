
import express from "express"
import { userController } from "./user.controller"
import { upload } from "../../../config/multer.config"
import checkAuth from "../../middleware/checkAuth"
import { UserRole } from "@prisma/client"



const router = express.Router()

router.get("/",checkAuth(UserRole.ADMIN), userController.allUsers)
router.post("/create-patient",upload.single("profile"), userController.createPatient)
router.post("/create-admin" ,upload.single("profile"), userController.createAdmin)
router.post("/create-admin", checkAuth(UserRole.ADMIN) ,upload.single("profile"), userController.createDoctor)

export const userRoutes = router