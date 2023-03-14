import {getLocalDB} from "../electron-store"

export default async function saveSourceItems({ sourceItems = []} = options){
    const db = getLocalDB()
    return db.saveSourceItems(sourceItems)
}