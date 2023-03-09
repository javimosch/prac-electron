<template>
  <div class="overlay" v-show="!isOnline">
    <div class="header">
      <Icon size="30" color="white">
        <WifiOffOutlined />
      </Icon>
      <span>You are offline</span>
    </div>
    <div class="message">
      Prak was designed with cloud features in mind and because of that, it
      requires internet connectivity.
    </div>
  </div>
</template>
<script setup>
import { onBeforeMount, onBeforeUnmount, ref } from "vue";
import { WifiOffOutlined } from "@vicons/material";
import { Icon } from "@vicons/utils";

const isOnline = ref(true);
let interval;
onBeforeMount(() => {
  interval = setInterval(() => {
    isOnline.value = navigator.onLine;
  }, 1000);
});
onBeforeUnmount(() => {
  window.clearInterval(interval);
});
</script>
<style lang="scss" scoped>
.overlay {
  position: fixed;
  width: calc(100vw);
  height: calc(100vh);
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0px;
  background: radial-gradient(#0b0707, #080808e0);
  font-size: 18px;
  font-family: system-ui;
  font-weight: 300;
  color: #c9c9c9;
  flex-direction: column;
}
.header{
    display:flex;
    justify-content: space-evenly;
    width:200px;
    align-items: center;
    font-weight: bold;
    margin-bottom:30px;
}
</style>
