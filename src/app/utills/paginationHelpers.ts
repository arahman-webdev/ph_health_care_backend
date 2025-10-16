export interface IOptions {
    page?: string | number
    limit?: string | number
    skip?: string | number
    sortBy?: string
    orderBy?: string
}


export interface IOptionResult {
    page: number
    limit: number
    skip: number
    sortBy: string
    orderBy: string
}

const calculatePagination = (options: IOptions): IOptionResult => {
    const page: number = Number(options.page) || 1
    const limit: number = Number(options.limit) || 5
    const skip: number = (page - 1) * limit


    const sortBy: string = options.sortBy || "createdAt"
    const orderBy: string = options.orderBy || "desc"


    return {
        page,
        limit,
        skip,
        sortBy,
        orderBy
    }
}

export const paginationHelper = {
    calculatePagination
}