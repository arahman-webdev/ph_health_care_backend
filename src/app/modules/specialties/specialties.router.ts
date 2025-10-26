import express from "express"
import { specialtiesController } from "./specialties.controller"
import { upload } from "../../../config/multer.config"


const router = express.Router()


router.post('/create', upload.single('icon'), specialtiesController.createSpecialtyController)
router.get('/', specialtiesController.getAllFromDB)
router.delete('/:id', specialtiesController.deleteFromDB)

export const specialtiesRouter = router