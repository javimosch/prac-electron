<template lang="pug">
.steps
    StepZeroBar
    .main
        SelectMultiple(title="FIND DUPLICATES BY EXTENSIONS")
    StepTwoBar
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
    }
</style>
