import { Directus } from "@directus/sdk";

export const directus = new Directus(import.meta.env.VITE_APP_DIRECTUS_URL,{

});


export async function isLogged(){
    const token = await directus.auth.token;
    return !!token
}

export async function loginIntoDirectus(email: string, password: string) {
  try {
    await directus.auth.login({ email, password });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}
