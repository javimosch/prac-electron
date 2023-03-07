import packageJSON from "../../../package.json"

export default async function getAppVersion(){
    return packageJSON.version
}