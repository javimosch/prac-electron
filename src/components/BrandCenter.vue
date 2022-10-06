<template lang="pug">
.brand-top
    img.brand-img(:src="logoIconSrc")
    img.brand-img(:src="logoIconSrc")
    img.brand-img(:src="logoIconSrc")
    img.brand-img(:src="logoIconSrc")
.brand
    .brand-title PRAK
</template>
<script setup>
import logoIconSrc from "@/assets/home-logo-icon.svg";
</script>
<style scoped>
.brand-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  column-gap: 30px;
}
.brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 5px;
  justify-content: flex-end;
}
.brand-img {
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+/Edge */
  user-select: none; /* Standard */
}
.brand-title {
  font-family: "Aclonica";
  font-weight: normal;
  font-style: normal;
  font-size: 120px;
  color: white;
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+/Edge */
  user-select: none; /* Standard */
}
</style>
