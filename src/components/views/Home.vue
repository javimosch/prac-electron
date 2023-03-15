<template lang="pug">
.home-view
    .center
        BrandCenter
        .btn-group
            PrimaryButton(@click="()=>router.push({name:'StepOne'})") Dedupe files
            //PrimaryButton(@click="selectAction('copy')") Copy
            //PrimaryButton(@click="selectAction('clean')") Clean
</template>

<script setup>
import {  useRouter } from "vue-router";
const router = useRouter();
</script>
<style scoped>
.home-view {
  background-color: var(--grey);
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh);
}
.center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.btn-group {
  margin-top: calc(5%);
  display: flex;
  column-gap: 20px;
}


</style>
