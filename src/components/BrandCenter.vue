<template lang="pug">
.brand-top
    img.brand-img.lineVector1Img(:src="lineVector1Src")
    img.brand-img.lineVector2Img(:src="lineVector2Src")
    img.brand-img.lineVector3Img(:src="lineVector3Src")
    img.brand-img.lineVector4Img(:src="lineVector4Src")
.brand
    .brand-title PRAK
</template>
<script setup>
import lineVector1Src from "@/assets/line-vector-1.svg";
import lineVector2Src from "@/assets/line-vector-2.svg";
import lineVector3Src from "@/assets/line-vector-3.svg";
import lineVector4Src from "@/assets/line-vector-4.svg";
</script>
<style scoped>
.brand-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  column-gap: 115px;
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

.lineVector1Img{
  transform: rotate(-93deg);
}
.lineVector2Img{
  transform: rotate(-93deg);
}
.lineVector3Img{
  transform: rotate(-91deg);
}
.lineVector4Img{
  transform: rotate(-91deg);
}
</style>
