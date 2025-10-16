
import bcryptjs from "bcryptjs"
import { prisma } from "../../../config/db";

import { PatientCreateInput } from "./user.interface";
import { IOptions, paginationHelper } from "../../utills/paginationHelpers";
import { Prisma } from "@prisma/client";


const createPatient = async (payload: PatientCreateInput) => {

    const hashPassword = await bcryptjs.hash(payload.password, Number(process.env.BCRYPT_SALT_ROUNDS))

    const result = await prisma.$transaction(async (tnx) => {
        await tnx.user.create({
            data: {
                email: payload.email,
                password: hashPassword
            }
        });

        return await tnx.patient.create({
            data: {
                name: payload.name,
                email: payload.email,
                profilePhoto: payload.profilePhoto
            }
        })
    })



    return result
}



const allUserss = async ({ page, limit, searchTerm, orderBy, sortBy, role, status }: { page: number, limit: number, searchTerm?: string, orderBy: string, sortBy: string, role: any, status: any }) => {

    const skip = (page - 1) * limit

    const users = await prisma.user.findMany({
        skip,
        take: limit,
        where: {
            email: {
                contains: searchTerm,
                mode: "insensitive"
            },
            role: role,
            status: status

        },
        orderBy: sortBy && orderBy ? {
            [sortBy]: orderBy
        } : {
            createdAt: "asc"
        }
    })
    return users
}


const allUsers = async (params: any, options: IOptions) => {

    const { page, limit, skip, sortBy, orderBy } = paginationHelper.calculatePagination(options)
    
    console.log(options)

    const { searchTerm, ...filterData } = params;

    console.log(searchTerm,filterData)

    const andConditions: Prisma.UserWhereInput[] = [];


    console.log(andConditions)

    if (searchTerm) {
        andConditions.push({
            OR: ["email"].map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive"
                }
            }))
        })
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: (filterData as any)[key]
                }
            }))
        })
    }

    const whereConditions: Prisma.UserWhereInput = andConditions.length > 0 ? {
        AND: andConditions
    } : {}

 

    const users = await prisma.user.findMany({
        skip,
        take: limit,
        where: {
            AND: whereConditions
        },
        orderBy: {
            [sortBy]: orderBy
        }
    });

       
    const totalUsers = await prisma.user.count({
        where: whereConditions
    })
    return {
        meta: {
            page,
            limit,
            totalUsers
        },
        data:users
    }
}

export const userService = {
    createPatient,
    allUsers
}