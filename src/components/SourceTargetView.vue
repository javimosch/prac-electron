<template lang="pug">
Layout
    .space-between
        .top
            SourceFoldersSelector
            TargetFolderList(v-if="mainAction!=='dedupe'")
            ExtensionsSelect
        .buttons
            BigButton(@click="$emit('gotoStep','StartView')") Back
            BigButton(:disabled="!canContinue" @click="canContinue &&$emit('clickNext')") Next
    
</template>
<script setup>
import {computed, inject, onMounted} from 'vue'
import { PrakStateSymbol } from "@/constants.js";
import {storeToRefs} from 'pinia'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
const { brandSubtitle } = storeToRefs(appStore)
const {
    extensions,
    mainAction
} = inject(PrakStateSymbol);

const canContinue = computed({
    get: ()=> extensions.value.length > 0
})

onMounted(()=>{
    brandSubtitle.value="Select source"
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
        margin-top:50px;
        align-self: flex-end;
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
    .space-between{
        display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    height: 100%;;
    }
</style>
