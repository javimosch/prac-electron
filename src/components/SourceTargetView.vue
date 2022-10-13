<template lang="pug">
.steps
    StepZeroBar
    .main
        SourceFolderList
        TargetFolderList
        ExtensionsSelect
        BigButton(@click="$emit('clickNext')") Next
    StepTwoBar
    StepThreeBar
</template>
<script setup>
</script>
<style scoped>
    .steps{
        display:flex;
        justify-content: flex-start;
        
    }

    .main{
        padding:20px;
        background-color: var(--grey-light);
        display:flex;
        flex-direction: column;
        justify-content: start;
        row-gap:20px;
        width: calc(100vw - 200px);
    }
</style>
