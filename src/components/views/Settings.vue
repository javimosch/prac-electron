<template>
  <div class="container">
    <div>
      <h1>Settings</h1>
    </div>
    <div>
      <a href="#" @click="() => router.back()">Back</a>
    </div>
  </div>
</template>
<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
</script>
<style lang="scss" scoped>
.container {
  padding: 20px;
  background-color: white;
  * {
    box-sizing: content-box;
  }
}
h1 {
  background-color: var(--light-dark);
  color: white;
  padding: 20px;
}
a {
  font-size: 25px;
  color: var(--light-dark);
  background-color: var(--light);
  padding: 20px 30px;
  display:block;
}
</style>
