// const prPick =<T extends Record<string, unknown>, k extends keyof T> (obj:T, keys: k[]):Partial<T>=>{
//     const queryObj:Partial<T> = {}

//     console.log("from pick from top",obj, keys)



//     for(const key of keys){
//         if(obj && Object.hasOwnProperty.call(obj, key)){
//              queryObj[key] = obj[key]
//         }

     
//     }



//     return queryObj
// }

const prPick = (obj: any, keys: string[]) => 
    
  Object.fromEntries(
    Object.entries(obj).filter(([key]) => keys.includes(key))
  );



export default prPick