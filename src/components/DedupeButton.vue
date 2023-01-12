<template lang="pug">
.button(:class="{disabled:disabled, enabled:!disabled}")
    slot
</template>
<script setup>
import {computed} from 'vue'
const props = defineProps({
  color: {
    type: String,
    default: "white",
  },
  borderColor: {
    type: String,
    default: null,
  },
  disabled:{
    type:Boolean,
    default:false
  }
});

let computedBorderColor = computed({
  get: () =>
  props.borderColor || props.color
});
</script>
<style scoped>
.button {
  border: 2px solid v-bind(computedBorderColor);
  width: fit-content;
  padding: 5px 10px;
  font-size: 25px;
  text-transform: uppercase;
  font-weight: 400;
  color: v-bind(color);
  text-transform: uppercase;
  background-color: var(--dark);
}
.button.disabled{
    background-color:lightgrey;
    opacity:0.5;
}
.button.enabled:hover {
  opacity: 0.9;
  cursor: pointer;
}
</style>
