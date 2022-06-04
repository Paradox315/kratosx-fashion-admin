<template>
  <a-layout-footer class="footer">
    <a-space>
      <a-link href="https://arco.design/" style="display: flex; padding: 5px">
        <a-icon type="logo-arco" />
        <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="10" fill="#4dabf7" />
          <path
            d="M10 5H4.286l1.107 10.292L10 16.428l4.607-1.136L15.714 5H10zm3.486 3.428H8.054l.09 1.195h5.163l-.364 3.903-2.991.72-2.895-.72-.179-1.99H8.33l.09.957 1.54.398 1.63-.398.089-1.593H6.782l-.358-3.75h7.152l-.09 1.278z"
            fill="#fff"
          />
        </svg>
        <span style="margin-left: 10px">Powered by Arco</span>
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
