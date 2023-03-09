<template>
    <div class="form-wrapper">
      <form>
        <div>
          <a href="https://prak.lunardog.com/" target="_blank">
            <Brand />
          </a>
        </div>
  
        
        <div>
          <label>Email</label>
          <input type="email" />
          <p>Please enter the email you have used during your purchase</p>
        </div>
        <div>
          <label>Password</label>
          <input type="password" />
        </div>
        
        <div>
          You already have an account? 
          <router-link :to="{name:'login'}">
          Sign-in
          </router-link>
        </div>
  
        
        <div>
          <VeryBigButton @click="handleCreateClick">Create</VeryBigButton>
        </div>
        
        
      </form>
    </div>
  </template>
  <script setup>
  
  import { useRouter } from "vue-router";
  
  const router = useRouter();
  function handleCreateClick() {
    router.push({
      name:'StepOne'
    });
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
  