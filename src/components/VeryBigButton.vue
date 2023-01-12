<template lang="pug">
.VeryBigButton
  slot
</template>
<style scoped>
.VeryBigButton {
  font-size: 20px;
  text-transform: uppercase;
  font-weight: bold;
  padding: 10px 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 2px solid white;
  cursor:pointer;
}

</style>
