<template lang="pug">
.step-one
    .center
        BrandCenter
        .btn-group
            BigButton(@click="$emit('click')") Start from scratch
            BigButton(@click="$emit('click')") Half way done
</template>

<script setup></script>
<style scoped>
.step-one {
  background-color: var(--grey);
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh);
}
.center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.btn-group {
  margin-top: calc(5%);
  display: flex;
  column-gap: 20px;
}
</style>
