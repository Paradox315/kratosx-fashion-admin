<template>
  <a-card
    class="general-card"
    :title="$t('monitor.runtime')"
    :loading="loading"
  >
    <template #cover>
      <div
        :style="{
          height: '50%',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          marginBottom: '20px',
        }"
      >
        <img
          :style="{ width: '40%' }"
          alt="dessert"
          :src="getAvatar(runtimeInfo[1].value)"
        />
      </div>
    </template>
    <a-descriptions :data="runtimeInfo" :column="1"></a-descriptions>
  </a-card>
</template>

<script lang="ts" setup>
  import { useI18n } from 'vue-i18n';
  import { useRequest } from 'vue-request';
  import { getRuntimeInfo } from '@/api/monitor';
  import { RuntimeReply } from '@/api/model/monitor';
  import { HttpResponse } from '@/types/response';
  import { DescData } from '@arco-design/web-vue';
  import { ref } from 'vue';
  import osImage from '@/assets/images/os/os.png';
  import windowsImage from '@/assets/images/os/windows.png';
  import macImage from '@/assets/images/os/mac.png';
  import linuxImage from '@/assets/images/os/linux.png';
  import iosImage from '@/assets/images/os/ios.png';
  import androidImage from '@/assets/images/os/android.png';

  const { t } = useI18n();
  const runtimeInfo = ref<DescData[]>([
    {
      label: t('monitor.runtime.hostname'),
      value: 'Unknown',
    },
    {
      label: t('monitor.runtime.os'),
      value: 'Unknown',
    },
    {
      label: t('monitor.runtime.arch'),
      value: 'Unknown',
    },
    {
      label: t('monitor.runtime.platform'),
      value: 'Unknown',
    },
    {
      label: t('monitor.runtime.version'),
      value: 'Unknown',
    },
    {
      label: t('monitor.runtime.compiler'),
      value: 'Unknown',
    },
    {
      label: t('monitor.runtime.cpus'),
      value: '0',
    },
  ]);
  const { loading } = useRequest<HttpResponse<RuntimeReply>>(getRuntimeInfo, {
    onSuccess: (data: HttpResponse<RuntimeReply>) => {
      const { metadata } = data;
      runtimeInfo.value[0].value = metadata.host || 'Unknown';
      runtimeInfo.value[1].value = metadata.os || 'Unknown';
      runtimeInfo.value[2].value = metadata.arch || 'Unknown';
      runtimeInfo.value[3].value = metadata.platform || 'Unknown';
      runtimeInfo.value[4].value = metadata.version || 'Unknown';
      runtimeInfo.value[5].value = metadata.compiler || 'Unknown';
      runtimeInfo.value[6].value = metadata.cpus?.toString() || '0';
    },
  });
  const getAvatar = (os: string | undefined) => {
    let avatar = osImage;
    if (os?.toLowerCase().includes('windows')) {
      avatar = windowsImage;
    } else if (os?.toLowerCase().includes('mac')) {
      avatar = macImage;
    } else if (os?.toLowerCase().includes('linux')) {
      avatar = linuxImage;
    } else if (os?.toLowerCase().includes('ios')) {
      avatar = iosImage;
    } else if (os?.toLowerCase().includes('android')) {
      avatar = androidImage;
    }
    return avatar;
  };
</script>

<style scoped></style>
