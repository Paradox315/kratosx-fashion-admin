<template>
  <a-card class="general-card" :title="$t('monitor.disk')" :loading="loading">
    <a-progress
      type="circle"
      size="large"
      animation
      :stroke-width="10"
      :percent="usage"
      :style="{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        margin: '20px 0',
      }"
      :color="{
        '0%': 'rgb(var(--primary-6))',
        '100%': 'rgb(var(--success-6))',
      }"
    />
    <a-descriptions :data="diskInfo" :column="1"></a-descriptions>
  </a-card>
</template>

<script lang="ts" setup>
  import { useI18n } from 'vue-i18n';
  import { ref } from 'vue';
  import { DescData } from '@arco-design/web-vue';
  import { useRequest } from 'vue-request';
  import { HttpResponse } from '@/types/response';
  import { DiskReply } from '@/api/model/monitor';
  import { getDiskInfo } from '@/api/monitor';

  const { t } = useI18n();
  const diskInfo = ref<DescData[]>([
    {
      label: t('monitor.disk.total'),
      value: '0',
    },
    {
      label: t('monitor.disk.free'),
      value: '0',
    },
    {
      label: t('monitor.disk.used'),
      value: '0',
    },
  ]);
  const usage = ref<number>(0);
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / k ** i).toPrecision(3)} ${sizes[i]}`;
  };
  const { loading } = useRequest<HttpResponse<DiskReply>>(getDiskInfo, {
    onSuccess: (resp: HttpResponse<DiskReply>) => {
      const { metadata } = resp;
      diskInfo.value[0].value = formatBytes(
        parseInt(metadata.total as string, 10)
      );
      diskInfo.value[1].value = formatBytes(
        parseInt(metadata.free as string, 10)
      );
      diskInfo.value[2].value = formatBytes(
        parseInt(metadata.used as string, 10)
      );
      usage.value = parseFloat(
        ((metadata.usedPercent as number) / 100)?.toFixed(2)
      );
    },
  });
</script>

<style scoped></style>
