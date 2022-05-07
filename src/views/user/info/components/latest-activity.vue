<template>
  <a-card class="general-card" :title="$t('userInfo.title.latestActivity')">
    <template #extra>
      <a-pagination
        :current="current"
        :page-size="pageSize"
        :total="total"
        simple
        @change="changeCurrent"
        @page-size-change="changePageSize"
      />
    </template>
    <a-list :bordered="false">
      <a-list-item
        v-for="log in logList"
        :key="log.id"
        action-layout="horizontal"
      >
        <a-skeleton
          v-if="loading"
          :loading="loading"
          :animation="true"
          class="skeleton-item"
        >
          <a-row :gutter="6">
            <a-col :span="2">
              <a-skeleton-shape shape="circle" />
            </a-col>
            <a-col :span="22">
              <a-skeleton-line :widths="['40%', '100%']" :rows="2" />
            </a-col>
          </a-row>
        </a-skeleton>
        <a-list-item-meta v-else>
          <template #title>
            <a-space>
              <span style="margin-right: 10px; font-size: medium">{{
                log.type
              }}</span>
              <icon-schedule /><span style="font-weight: lighter">{{
                log.time
              }}</span>
            </a-space>
          </template>
          <template #avatar>
            <a-avatar shape="square">
              <img
                :src="computed(() => getAvatar(log.os)).value"
                :alt="$t('userInfo.loginLog.label.os')"
              />
            </a-avatar>
          </template>
          <template #description>
            <a-collapse :bordered="false" expand-icon-position="right">
              <a-collapse-item
                key="1"
                :header="$t('userInfo.loginLog.viewDetail')"
              >
                <a-descriptions
                  :data="computed(() => renderData(log)).value"
                  :column="{ xs: 1, md: 3, lg: 4 }"
                >
                </a-descriptions>
              </a-collapse-item>
            </a-collapse>
          </template>
        </a-list-item-meta>
      </a-list-item>
    </a-list>
  </a-card>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { getLogList } from '@/api/user';
  import windowsImage from '@/assets/images/os/windows.png';
  import macImage from '@/assets/images/os/mac.png';
  import linuxImage from '@/assets/images/os/linux.png';
  import iosImage from '@/assets/images/os/ios.png';
  import androidImage from '@/assets/images/os/android.png';
  import osImage from '@/assets/images/os/os.png';
  import { useI18n } from 'vue-i18n';
  import { UserLog } from '@/api/model/user';
  import { usePagination } from 'vue-request';

  const { t } = useI18n();
  const {
    data,
    current,
    pageSize,
    total,
    loading,
    changeCurrent,
    changePageSize,
  } = usePagination(getLogList, {
    pagination: {
      totalKey: 'metadata.total',
    },
  });
  const logList = computed(() => data.value?.metadata?.list || []);
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
  const renderData = (log: UserLog) => {
    return [
      {
        label: t('userInfo.loginLog.label.loginTime'),
        value: log.time,
      },
      {
        label: t('userInfo.loginLog.label.ip'),
        value: log.ip,
      },
      {
        label: t('userInfo.loginLog.label.country'),
        value: log.country,
      },
      {
        label: t('userInfo.loginLog.label.region'),
        value: log.region,
      },
      {
        label: t('userInfo.loginLog.label.city'),
        value: log.city,
      },
      {
        label: t('userInfo.loginLog.label.position'),
        value: `${log.position?.lat || 0}°,${log.position?.lng || 0}°`,
      },
      {
        label: t('userInfo.loginLog.label.os'),
        value: log.os,
      },
      {
        label: t('userInfo.loginLog.label.agent'),
        value: log.client,
      },
      {
        label: t('userInfo.loginLog.label.device'),
        value: log.device || t('userInfo.loginLog.label.device.browser'),
      },
    ];
  };
</script>

<style scoped lang="less">
  .latest-activity {
    &-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

  .general-card :deep(.arco-list-item) {
    padding-left: 0;
    border-bottom: none;

    .arco-list-item-meta-content {
      flex: 1;
      padding-bottom: 27px;
      border-bottom: 1px solid var(--color-neutral-3);
    }

    .arco-list-item-meta-avatar {
      padding-bottom: 27px;
    }

    .skeleton-item {
      margin-top: 10px;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--color-neutral-3);
    }
  }
</style>
