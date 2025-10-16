const pick = <T extends Record<string, unknown>, k extends keyof T>(obj: T, keys: k[]): Partial<T> => {
    const queryObj:Partial<T> = {}


    for (const key of keys) {
        if (obj && Object.hasOwnProperty.call(obj, key)) {
            queryObj[key] = obj[key]
        }
    }

    return queryObj
}

export default pick