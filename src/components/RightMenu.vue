<template lang="pug">
.right-menu(:class="{active:active}")
    .item(title="Options" @click="()=>router.push({name:'settings'})")
        Icon.icon(size="30" ) 
            SettingsRound
        .label Options
    .item(@click="toggle" title="Toggle menu")
        Icon.icon(size="30" color="var(--light-light)")
            KeyboardDoubleArrowLeftFilled(v-show="!active")  
            KeyboardDoubleArrowRightFilled(v-show="active")   
        .label Close 
</template>
<script setup>
import { Icon } from "@vicons/utils";
import {
  SettingsRound,
  KeyboardDoubleArrowLeftFilled,
  KeyboardDoubleArrowRightFilled,
} from "@vicons/material";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const active = ref(false);
function toggle() {
  active.value = !active.value;
}
</script>
<style lang="scss" scoped>
.right-menu {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  height: 100%;
  width: 140px;
  position: relative;
  transition: right 0.2s linear;
  background-color: var(--light);
  padding-bottom: 50px;
  right: 0px;
}
.right-menu.active {
  right: 90px;
  transition: right 0.2s linear;
}
.item {
  display: flex;

  align-items: center;
  width: 100%;
  column-gap: 0px;
  background-color: var(--light);
  .icon {
    flex-basis: 40%;

    display: flex;
    justify-content: center;
  }
  .label {
    font-size: 18px;
    font-weight: bold;
    color: var(--light-dark);
    flex-basis: 60%;
  }
  svg,
  path {
    color: var(--light-dark);
  }
  cursor: pointer;
  &:hover {
    background-color: var(--dark);

    .label {
      color: var(--light);
    }
    svg,
    path {
      color: var(--light);
    }
  }

  padding: 10px 0px;
}
</style>
