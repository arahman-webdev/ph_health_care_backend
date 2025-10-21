export type TOptions = {
    page?: string | number,
    limit?: string | number,
    skip?: string | number,
    sortBy?: string,
    orderBy?: string
}



export type TOptionsResult = {
    page: number,
    limit: number,
    skip: number,
    sortBy: string,
    orderBy: string
}


export const schedulePagination = (options: TOptions): TOptionsResult => {
    const page = Number(options.page) || 1
    const limit = Number(options.limit) || 5
    const skip = Number(page - 1) * limit
    const sortBy: string = options.sortBy || "createdAt"
    const orderBy: string = options.orderBy || "asc"



    return {
        page,
        limit,
        skip,
        sortBy,
        orderBy
    }
}

