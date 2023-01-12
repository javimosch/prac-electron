<template lang="pug">
Layout
    SourceFolderList
    TargetFolderList(v-if="mainAction!=='dedupe'")
    ExtensionsSelect
    .buttons
        BigButton(@click="$emit('gotoStep','StartView')") Back
        BigButton(:disabled="!canContinue" @click="canContinue &&$emit('clickNext')") Next
    
</template>
<script setup>
import {computed, inject} from 'vue'
import { PrakStateSymbol } from "@/constants.js";

const {
    extensions,
    mainAction
} = inject(PrakStateSymbol);

const canContinue = computed({
    get: ()=> extensions.value.length > 0
})

</script>
<style scoped>
    .steps{
        display:flex;
        justify-content: flex-start;
    }
    .buttons{
        display:flex;
        justify-content: flex-start;
        column-gap: 10px;
    }

    .main{
        padding:20px;
        background-color: var(--grey-light);
        display:flex;
        flex-direction: column;
        justify-content: start;
        row-gap:20px;
        width: calc(100vw - 50px);
        min-height: calc(100vh - 40px);
    }
</style>
