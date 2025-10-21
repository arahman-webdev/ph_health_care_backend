
import express, { Request, Response } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { userRoutes } from "./app/modules/user/user.router";
import { authRoutes } from "./app/modules/auth/auth.router";
import { scheduleRoutes } from "./app/modules/schedule/schedule.router";
import { DoctorScheduleRoutes } from "./app/modules/doctorSchedule/doctorSchedule.router";

export const app = express()

app.use(cors({
    origin: ['http://localhost:3000',"https://abdurrahmandev-phi.vercel.app"],
    credentials: true
}));

app.use(express.json())
app.use(cookieParser()); 





// router 


app.use('/api/v1/user', userRoutes)
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/schedules', scheduleRoutes)
app.use('/api/v1', DoctorScheduleRoutes)


// Default route testing

app.get('/',(req:Request, res:Response)=>{
    res.send("Abdur Rahman Server is running")
})





































