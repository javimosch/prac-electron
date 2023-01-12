<script setup>
import {storeToRefs} from 'pinia'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
const { currentViewName } = storeToRefs(appStore)

function gotoStepOne(){
    currentViewName.value = 'SourceTargetView'
    brandSubtitle.value="Select source"
}
function gotoAnalysis(){
    currentViewName.value = 'AnalysisView'
    brandSubtitle.value = "Run Analysis";
}
</script>
<template lang="pug">
.menu
    MenuOption(icon="icon1" :number="1" topText="Select" bottomText="Source" :selected="currentViewName==='SourceTargetView'"
    @click="gotoStepOne()"
    )
    MenuOption(icon="icon2" :number="2" topText="Select" bottomText="File types" :selected="currentViewName==='SourceTargetView'"
        @click="gotoStepOne()"
    )
    MenuOption(icon="icon3" :number="3" topText="Run" bottomText="Analysis" :selected="currentViewName==='AnalysisView'" 
        @click="gotoAnalysis()"
    )
    MenuOption(icon="icon4" :number="4" topText="Dedupe" bottomText="Files" :selected="currentViewName==='ProcessingView'" :disabled="true")
</template>