<script setup>
import Menu from '@/components/Menu.vue'
</script>
<template lang="pug">
.layout
    Menu
    .layout-content
        slot
</template>
<style lang="scss" scoped>
.layout{
    display:flex;
    column-gap: 15px;
}
</style>