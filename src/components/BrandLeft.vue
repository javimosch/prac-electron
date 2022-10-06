<template lang="pug">
.brand
    .brand-title PRAK
    img.brand-img(:src="logoIconSrc")
</template>
<script setup>
import logoIconSrc from "@/assets/home-logo-icon.svg";
</script>
<style scoped>
.brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 5px;
  justify-content: flex-end;
}
.brand > div,
.brand > img {
  min-height: 50px;
}
.brand-title {
  font-family: "Aclonica";
  font-weight: normal;
  font-style: normal;
  font-size: 20px;
  color: white;
  transform: rotateZ(-90deg);
  display: flex;
  align-items: center;
  flex-basis: 70px;
  position: relative;
  bottom: -5px;
}
.brand-img {
  max-width: 50px;
}
</style>
