<template lang="pug">    
.step-bar
  span Target / Source / Filters        
</template>
<script setup></script>
<style scoped>
.step-bar {
  width: 60px;
  
  display: flex;
  justify-content: center;
  align-items: flex-end;
  background-color: var(--grey-light);
}
span{
  position:absolute;
  top:150px;
  transform: rotateZ(-90deg); 
  font-size:25px;
  white-space: nowrap;
  color:white;
}
</style>
