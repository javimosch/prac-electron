<template lang="pug">
.VeryBigButton
  slot
</template>
<style lang="scss" scoped>
.VeryBigButton {
  font-size: 20px;
  text-transform: uppercase;
  font-weight: bold;
  padding: 10px 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0px solid white;
  cursor: pointer;
  background-color: var(--light);
  color: var(--light-dark);
}
.VeryBigButton:hover {
  opacity: 0.9;
}
</style>
