import { Request } from "express";

import { prisma } from "../../../config/db";
import { Prisma, Specialties } from "@prisma/client";


const createSpecialtyService = async (payload: Prisma.SpecialtiesCreateInput) => {

    console.log(payload)

    const result = await prisma.specialties.create({
        data: payload
    });

    return result;
};

const getAllFromDB = async (): Promise<Specialties[]> => {
    return await prisma.specialties.findMany();
}

const deleteFromDB = async (id: string): Promise<Specialties> => {
    const result = await prisma.specialties.delete({
        where: {
            id,
        },
    });
    return result;
};

export const SpecialtiesService = {
    createSpecialtyService,
    getAllFromDB,
    deleteFromDB
}