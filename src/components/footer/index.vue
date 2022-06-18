<template>
  <a-layout-footer class="footer">
    <a-space>
      <a-link href="https://arco.design/" style="display: flex; padding: 5px">
        <span>Powered by Arco</span>
      </a-link>
      <a-link href="https://github.com/Paradox315" style="padding: 5px" icon
        >All rights reserved Paradox©</a-link
      >
      <a-tag size="large">鄂ICP备2022001141号</a-tag>
    </a-space>
  </a-layout-footer>
</template>

<script lang="ts" setup></script>

<style lang="less" scoped>
  .footer {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    color: var(--color-text-2);
    text-align: center;
  }
</style>
