<template lang="pug">
.bar
    .inner( :style="innerStyle" :class="{increasing:isIncreasing}" )
        .text(v-show="props.percent>5") {{ props.percent }} %
</template>
<script setup>
import {computed, watchEffect, ref} from 'vue'
const props = defineProps({
    percent:{
        type: Number,
        default: 0
    }
})

const lastPerc = ref(null)
const isIncreasing = ref(true)
const cssPercent = computed({
    get:()=>`${props.percent}%`
})
const innerStyle = computed(()=>`width: ${props.percent}%`)


watchEffect(()=>{

    if(!!lastPerc.value && lastPerc.value > props.percent){
        isIncreasing.value=false
    }else{
        isIncreasing.value=true
    }



    lastPerc.value = props.percent
})


</script>
<style lang="scss" scoped>
.bar{
    width:100%;
    height:30px;
    background-color: var(--light);
}
.inner{
    height: 30px;
    display:flex;
    justify-content: center;
    align-items: center;
    background-color: var(--dark);
    &.increasing{
        transition: width 2s ease;
    }
}
</style>