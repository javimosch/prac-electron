<template lang="pug">
.button
    slot
</template>
<style scoped>
.button {
  font-family: "Aclonica";
  border: 2px solid white;
  width: fit-content;
  padding: 5px 10px;
  font-size: 20px;
  color: white;
  text-transform: uppercase;
}
.button:hover{
    opacity: 0.8;
    cursor:pointer;
}
</style>
