<template>
  <Button
  @click="emit('click')"
  :color="color"
  :border-color="borderColor"
  :disabled="disabled"
  :full-width="fullWidth"
  :bg-color="bgColor"
  style="border:2px solid white;"
  >
  <slot></slot>
  </Button>
</template>
<script setup>
const emit = defineEmits(['click'])
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
    },
    fullWidth:{
    type:Boolean,
    default:false
    },
    bgColor:{
    type:String,
    default: 'var(--light-dark)'
    }
});

</script>