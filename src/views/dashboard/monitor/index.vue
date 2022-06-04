<template>
  <div class="container">
    <Breadcrumb :items="['menu.dashboard', 'menu.dashboard.monitor']" />
    <a-row justify="space-between" :gutter="16">
      <a-col :xs="24" :sm="18" :md="18" :lg="18" :xl="18" :xxl="18">
        <MonitorContent />
      </a-col>
      <a-col :xs="24" :sm="6" :md="6" :lg="6" :xl="6" :xxl="6">
        <Runtime />
        <Disk style="margin-top: 30px" />
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup></script>

<script lang="ts">
  import { createAsyncComponent } from '@/utils/factory';

  const MonitorContent = createAsyncComponent(
    () => import('@/views/dashboard/monitor/components/monitor-content.vue')
  );
  const Runtime = createAsyncComponent(
    () => import('@/views/dashboard/monitor/components/runtime.vue')
  );

  const Disk = createAsyncComponent(
    () => import('@/views/dashboard/monitor/components/disk.vue')
  );
  export default {
    name: 'Monitor',
    components: { Disk, Runtime, MonitorContent },
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
