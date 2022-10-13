<template lang="pug">
.steps
    StepZeroBar(@click="$emit('gotoStep','StartView')")
    StepOneBar(@click="$emit('gotoStep','SourceTargetView')")
    StepTwoBar(@click="$emit('gotoStep','AnalysisView')")
    .main
        .center
            ResultStat(title="Files found" value="4030")
            ResultStat(title="Duplicates" value="587")
            ResultStat(title="Space saved" value="5.6 GB")
        BigButton(@click="finish") Finish
    </template>
<script setup>
import {inject} from "vue"
import { PrakStateSymbol } from "@/constants.js";

const state = inject(PrakStateSymbol);
const emit = defineEmits(['gotoStep'])
function finish(){
  //status.value='analysis_required'
  state.reset.value()
  emit('gotoStep','StartView')
}

</script>
<style scoped>
.steps {
  display: flex;
  justify-content: flex-start;
}

.main {
  padding: 20px;
  background-color: var(--orange);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 20px;
  width: calc(100vw - 200px);
}
.center{
    display:flex;
    column-gap: 10px;
}
</style>
