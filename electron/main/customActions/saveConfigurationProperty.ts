import {getLocalDB} from "../electron-store"

export default async function saveConfigurationProperty(options:{name:string, value:any} = {name:"",value:null}){
    const db = getLocalDB()
    return db.saveConfigurationProperty(options.name, options.value)
}