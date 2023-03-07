<template>
  <div class="form-wrapper">
    <form>
      <div>
        <a href="https://prak.lunardog.com/" target="_blank">
          <Brand />
        </a>
      </div>

      <!--
      <div>
        <label>Email</label>
        <input type="email" />
      </div>
      <div>
        <label>Password</label>
        <input type="password" />
      </div>
      -->
      <div>
        <VeryBigButton @click="handleClick">Dedupe</VeryBigButton>
      </div>
      <div class="preview-wrapper">
        <div
          class="preview"
          title="This version of the application will stop working on 14/05/23. Re-download it after this period of time."
        >
          <div>Preview version</div>
          <div>
            <Icon size="14" color="white">
              <WarningFilled />
            </Icon>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
<script setup>
import { Icon } from "@vicons/utils";
import { WarningFilled } from "@vicons/material";
import { useRouter } from "vue-router";
const router = useRouter();
function handleClick() {
  router.push({
    name:'StepOne'
  });
}
</script>
<style lang="scss" scoped>
.form-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh);
}
form {
  height: 300px;
  width: 250px;
  display: flex;
  flex-direction: column;
  row-gap: 15px;
  & > div {
    display: flex;
    flex-direction: column;
    row-gap: 10px;
  }
}
.preview {
  display: flex;
  flex-direction: row;
  column-gap: 10px;
}
.preview-wrapper {
  margin-top: 15px;
  display: flex;
  justify-content: center;
  flex-direction: row;
}
</style>
