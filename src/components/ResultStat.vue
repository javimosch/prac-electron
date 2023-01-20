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
    font-size: 20px;
    font-weight: 300;
    color:var(--light-dark);
    display: flex;
    flex-direction: column;
    text-align: center;
    background-color: var(--light);
}
.title{
    border:0;
    font-weight: 400;
    text-transform: uppercase;
    color:white;
    background-color: var(--light-dark);
    padding:5px 20px;
    font-size:18px;
}
</style>
    