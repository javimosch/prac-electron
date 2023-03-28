import {getLocalDB} from "../electron-store"

export default async function saveConfigurationProperty(options:{name:string, value:any} = {name:"",value:null}){
    const db = getLocalDB()
    return db.set(options.name, options.value)
}