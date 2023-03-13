<script setup>
//import {storeToRefs} from 'pinia'
//import { useAppStore } from '@/stores/app'
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
//const appStore = useAppStore()
//const {   } = storeToRefs(appStore)

function gotoStepOne(){
    router.push({
        name:'StepOne',
    })
}
function gotoStepTwo(){
    router.push({
        name:'StepTwo',
    })
}
function gotoAnalysis(){
    router.push({
        name:'Analysis',
    })
}
</script>
<template lang="pug">
.menu
    MenuOption(icon="icon1" :number="1" topText="Select" bottomText="Source" :selected="route.name==='StepOne'"
    @click=" gotoStepOne()"
    )
    MenuOption(icon="icon2" :number="2" topText="Select" bottomText="File types" :selected="route.name==='StepTwo'"
        @click=" gotoStepTwo()"
    )
    MenuOption(icon="icon4" :number="3" topText="Deduplicate" bottomText="Files" :selected="route.name==='StepThree'" 
        @click=" gotoAnalysis()"
    )
    //MenuOption(icon="icon4" :number="4" topText="Dedupe" bottomText="Files" :selected="route.name==='ProcessingView'" :disabled="true")
</template>
<style lang="scss" scoped>
.menu{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
}
</style>