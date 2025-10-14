export type PatientCreateInput = {
    name: string,
    email: string,
    password: string,
    profilePhoto?: string | null
}