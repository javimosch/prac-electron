<script setup>
import {storeToRefs} from 'pinia'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
const { currentViewName, brandSubtitle } = storeToRefs(appStore)

function gotoStepOne(){
    currentViewName.value = 'StepOneView'
    brandSubtitle.value="Select source"
}
function gotoStepTwo(){
    currentViewName.value = 'StepTwoView'
    brandSubtitle.value="Select source"
}
function gotoAnalysis(){
    currentViewName.value = 'AnalysisView'
    brandSubtitle.value = "Run Analysis";
}
</script>
<template lang="pug">
.menu
    MenuOption(icon="icon1" :number="1" topText="Select" bottomText="Source" :selected="currentViewName==='StepOneView'"
    @click="gotoStepOne()"
    )
    MenuOption(icon="icon2" :number="2" topText="Select" bottomText="File types" :selected="currentViewName==='StepTwoView'"
        @click="gotoStepTwo()"
    )
    MenuOption(icon="icon4" :number="3" topText="Deduplicate" bottomText="Files" :selected="currentViewName==='AnalysisView'" 
        @click="gotoAnalysis()"
    )
    //MenuOption(icon="icon4" :number="4" topText="Dedupe" bottomText="Files" :selected="currentViewName==='ProcessingView'" :disabled="true")
</template>
<style lang="scss" scoped>
.menu{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
}
</style>