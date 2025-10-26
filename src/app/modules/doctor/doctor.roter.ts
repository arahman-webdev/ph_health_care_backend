import express from "express"

import { doctorControoler } from "./doctor.controller"


const router = express.Router()


router.get('/', doctorControoler.getDoctroFromDB)
router.post('/suggesion', doctorControoler.getDoctorSuggestion)
router.put('/:id', doctorControoler.updateDcotorProfile)


export const doctorRouter = router