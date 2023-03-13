<template>
  <div class="form-wrapper">
    <form>
      <div
      
      >
        <a href="https://prak.lunardog.com/" target="_blank">
          <Brand />
        </a>
      </div>

      
      <div
      v-show="!isUserLogged"
      >
        <label>Email</label>
        <input type="email" v-model="credentials.email"/>
      </div>
      <div
      v-show="!isUserLogged"
      >
        <label>Password</label>
        <input type="password" v-model="credentials.password" />
      </div>
      <p
      v-show="!isUserLogged"
      >Leave the password input empty to create an account.</p>
      
      <!--
      <div>
        No account yet? 
        <router-link :to="{name:'create-account'}">
        Create new account
        </router-link>
      </div>
      -->

      <div
      v-show="!isUserLogged"
      >
        <VeryBigButton @click="handleLoginClick">START</VeryBigButton>
      </div>
      
      <div
      v-show="isUserLogged"
      >
        <VeryBigButton @click="handleDedupeButtonClick">Dedupe</VeryBigButton>
        <VeryBigButton @click="handleLogout">Logout</VeryBigButton>
      </div>
      
      
      <div class="errors">
        <div class="error-message" v-for="(error, index) in errors" :key="index">
          {{ error }}
          </div>
      </div>
      
    </form>
  </div>
</template>
<script setup>
import {onBeforeMount, ref, reactive} from 'vue'
import { useRouter } from "vue-router";
import {isLogged} from '@/api/directus-client'
import { z } from "zod";

import {loginIntoDirectus, directus} from '@/api/directus-client'
const credentials =  reactive({
  email:"",
  password:"",
})
const errors = ref([])

const Credentials = z.object({
  email: z.string().min(1),
  //password: z.string().min(1),
});

const router = useRouter();
function handleDedupeButtonClick() {
  router.push({
    name:'StepOne'
  });
}

const isUserLogged=  ref(false)

onBeforeMount(async()=>{
  isUserLogged.value= await isLogged()
})

async function handleLogout(){
  await directus.auth.refresh()
  await directus.auth.logout();
  isUserLogged.value= await isLogged()
}

async function handleLoginClick(){
  try{
    Credentials.parse(credentials)
    errors.value=''
  }catch(err) {
    errors.value = err.issues.map(issue => `${issue.path.join(', ')} : Field required`)
    return
  }

  let hasAssociatedStripePayment = false /*await hasAssociatedStripePayment.query({
    email: credentials.email
  })*/

  if(!hasAssociatedStripePayment){
    window.alert("This email is not associated to any purchase")
  }else{

    if(!credentials.password){
      errors.value = ['Password: Field required']
      return
    }

    let success = await loginIntoDirectus(credentials.email, credentials.password)
    
    if(success){
      isUserLogged.value= await isLogged()
      //handleDedupeButtonClick()
    }
  }
  

}

</script>
<style lang="scss" scoped>
.form-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh);
}
form {
  height: 300px;
  width: 250px;
  display: flex;
  flex-direction: column;
  row-gap: 15px;
  & > div {
    display: flex;
    flex-direction: column;
    row-gap: 10px;
  }
}

</style>
