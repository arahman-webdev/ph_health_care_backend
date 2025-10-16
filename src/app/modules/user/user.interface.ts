import { Gender, UserRole } from "@prisma/client"

export type UserCreateInput = {
    name: string,
    email: string,
    password: string,
    profilePhoto?: string | null,

}
export interface AdminCreateInput {
    name: string;
    email: string;
    password: string;
    profilePhoto?: string | null;
    contactNumber: string;
    role?: UserRole;
}
export interface DoctorCreateInput {
    name: string;
    email: string;
    password: string;
    profilePhoto?: string | null;
    contactNumber: string;
    role?: UserRole;
    address: string,
    registrationNumber: string,
    gender: Gender
    appointmentFee: number
    qualification: string
    currentWorkingPlace: string
    designation: string
}
