export type UserCreateInput = {
    name: string,
    email: string,
    password: string,
    profilePhoto?: string | null
}
export type AdminCreateInput = {
    name: string,
    email: string,
    password: string,
    profilePhoto?: string | null,
    contactNumber: string
}
