<template>
  <div class="container">
    <Breadcrumb :items="['menu.dashboard', 'menu.dashboard.monitor']" />
    <a-card class="general-card">
      <iframe
        id="monitor"
        :src="monitor"
        scrolling="no"
        style="
          width: 100%;
          height: 100vh;
          margin-top: 10vh;
          transform: scale(1.2);
        "
        frameborder="0"
      />
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  const monitor = `${import.meta.env.VITE_API_BASE_URL}/monitor`;
</script>

<script lang="ts">
  export default {
    name: 'Monitor',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
  }

  .layout {
    display: flex;

    &-left-side {
      flex-basis: 300px;
    }

    &-content {
      flex: 1;
      padding: 0 16px;
    }

    &-right-side {
      flex-basis: 280px;
    }
  }
</style>

<style lang="less" scoped>
  // responsive
  @media (max-width: @screen-lg) {
    .layout {
      flex-wrap: wrap;

      &-left-side {
        flex: 1;
        flex-basis: 100%;
        margin-bottom: 16px;
      }

      &-content {
        flex: none;
        flex-basis: 100%;
        order: -1;
        margin-bottom: 16px;
        padding: 0;
      }

      &-right-side {
        flex-basis: 100%;
      }
    }
  }
</style>
