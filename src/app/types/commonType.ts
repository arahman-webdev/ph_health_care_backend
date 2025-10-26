import { UserRole } from "@prisma/client"

export type IJwtpayload = {
    userEmail: string,
    role: UserRole
}