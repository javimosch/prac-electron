<template lang="pug">
.button(:class="{disabled:disabled, enabled:!disabled, fullWidth: fullWidth}")
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

const bgColor  = computed(()=>props.bgColor)

let computedBorderColor = computed({
    get: () =>
    props.borderColor || props.color
});
</script>
<style scoped>
.button {
    border: 0px solid v-bind(computedBorderColor);
    width: fit-content;
    padding: 15px 30px;
    font-family: "Aclonica";
    font-size: 25px;
    text-transform: uppercase;
    font-weight: bold;
    color: v-bind(color);
    text-transform: uppercase;
    background-color: v-bind(bgColor);
    box-sizing: border-box;
}
.button.disabled{
    background-color:lightgrey;
    opacity:0.5;
}
.button.enabled:hover {
    opacity: 0.9;
    cursor: pointer;
}
.button.fullWidth{
    width: 100%;
    text-align: center;
}
</style>
    