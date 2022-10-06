<template lang="pug">
.title {{props.title}}
</template>
<script setup>
     const props =  defineProps({
      title: {
        type:String,
        default:'title'
      },
   })
</script>
<style scoped>
    .title{
        color:white;
        font-family: "Aclonica";
        font-size:20px;
    }
</style>