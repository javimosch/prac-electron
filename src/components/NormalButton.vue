<template lang="pug">
.button(:class="{disabled:disabled, enabled:!disabled}")
    slot
</template>
<script setup>
import { computed } from "vue";
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
  get: () => props.borderColor || props.color,
});
</script>
<style scoped>
.button {
  font-family: "Lato", sans-serif;
  font-weight: 300;
  border: 2px solid v-bind(computedBorderColor);
  width: fit-content;
  padding: 5px 10px;
  font-size: 20px;
  color: v-bind(color);
  text-transform: uppercase;
  display:flex;
  justify-content: center;
  align-items: center;
  column-gap: 10px;
}
.button.disabled{
    background-color:lightgrey;
    opacity:0.5;
}
.button.enabled:hover {
  opacity: 0.8;
  cursor: pointer;
}

</style>
