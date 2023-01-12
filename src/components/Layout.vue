<script setup>
import Menu from '@/components/Menu.vue'
import {storeToRefs} from 'pinia'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
const { brandSubtitle } = storeToRefs(appStore)

</script>
<template lang="pug">
.layout
    Menu
    .layout-content
        slot
    .brand-wrapper
        Brand
        h1.brand-subtitle {{ brandSubtitle }}

</template>
<style lang="scss" scoped>
.layout{
    display:flex;
    column-gap: 15px;
    align-items: center;
    height:calc(100vh - 40px);
    justify-content: space-between;
}
.layout-content, .brand-wrapper{
    align-self: flex-start;
}
.layout-content{
    height:100%;
    flex-basis:80%;
}
.brand-subtitle{
    padding:0px;
    margin: 0px;
    text-align: right;
}
</style>