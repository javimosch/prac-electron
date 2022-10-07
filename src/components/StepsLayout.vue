<template lang="pug">
.steps
    StepZeroBar
    StepOneBar(@click="$emit('gotoStep','StepOne')")
    .main
        slot  
    StepThreeBar
    StepFourBar
</template>
<script setup></script>
<style scoped>
.steps {
  display: flex;
  justify-content: flex-start;
}

.main {
  padding: 20px;
  background-color: var(--sand);
  display: flex;
  flex-direction: column;
  justify-content: start;
  row-gap: 20px;
  min-height:calc(100vh - 40px);
  width: calc(100vw - 240px);
}
</style>
