<template lang="pug">
.bar
    .inner
</template>
<script setup>
import {computed} from 'vue'
const props = defineProps({
    percent:{
        type: Number,
        default: 0
    }
})
const cssPercent = computed({
    get:()=>`${props.percent}%`
})
</script>
<style scoped>
.bar{
    width:100%;
    height:30px;
    background-color: grey;
}
.inner{
    height: 30px;
    width: v-bind(cssPercent);
    background-color: white;
    transition: width 2s ease;
}
</style>