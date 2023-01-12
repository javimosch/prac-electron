<template lang="pug">
.root
    div.title {{title}}
    div.value {{value}}
</template>
<script setup>
const props = defineProps({
    title: {
    type: String,
    required: true,
    },
    value: {
    type: [String, Number, Boolean],
    required: true,
    },
});
</script>
<style scoped>
.root {
    
    font-size: 25px;
    font-weight: 300;
    border: 2px solid white;
    color:white;
    padding: 25px 25px;
    display: flex;
    flex-direction: column;
    text-align: center;
    row-gap: 15px;
    justify-content: space-between;
}
.title{
    border-bottom:2px solid white;
    font-weight: 400;
}
</style>
    