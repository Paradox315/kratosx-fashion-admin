<template>
  <div class="content">
    <a-result status="error" title="No internet ">
      <template #icon>
        <IconFaceFrownFill />
      </template>
      <template #subtitle> 网络错误 </template>

      <template #extra>
        <a-button type="primary" @click="refresh">刷新</a-button>
      </template>
    </a-result>
  </div>
</template>

<script lang="ts" setup>
  const refresh = () => {
    window.location.reload();
  };
</script>

<style scoped lang="less">
  .content {
    // padding-top: 100px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -121px;
    margin-left: -95px;
    text-align: center;
  }
</style>
