<template>
  <a-card class="general-card" :title="$t('userInfo.title.latestActivity')">
    <template #extra>
      <a-link @click="showMore">{{ $t('userInfo.showMore') }}</a-link>
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
        <a-list-item-meta v-else :title="getTitle(log)">
          <template #avatar>
            <a-avatar shape="square">
              <img
                :src="getAvatar(log.os)"
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
                  :data="renderData(log)"
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
  import { ref } from 'vue';
  import useLoading from '@/hooks/loading';
  import { LoginLogReply } from '@/types/user';
  import { getLogList } from '@/api/user';
  import windowsImage from '@/assets/images/os/windows.png';
  import macImage from '@/assets/images/os/mac.png';
  import linuxImage from '@/assets/images/os/linux.png';
  import iosImage from '@/assets/images/os/ios.png';
  import androidImage from '@/assets/images/os/android.png';
  import osImage from '@/assets/images/os/os.png';
  import { Message } from '@arco-design/web-vue';
  import { useI18n } from 'vue-i18n';

  const current = ref(1);
  const total = ref(0);
  const { t } = useI18n();
  const { loading, setLoading } = useLoading(true);
  const logList = ref<LoginLogReply[] | undefined>(new Array(0).fill({}));
  const fetchData = async () => {
    try {
      if ((current.value - 1) * 7 <= total.value) {
        setLoading(true);
        const res = await getLogList(current.value, 7);
        logList.value?.push(...(res.metadata.list as LoginLogReply[]));
        if (current.value === 1) {
          total.value = res.metadata.total as number;
        }
      }
    } catch (err) {
      Message.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
  const showMore = () => {
    current.value += 1;
    fetchData();
  };
  const getAvatar = (os: string) => {
    let avatar = osImage;
    if (os.toLowerCase().includes('windows')) {
      avatar = windowsImage;
    } else if (os.toLowerCase().includes('mac')) {
      avatar = macImage;
    } else if (os.toLowerCase().includes('linux')) {
      avatar = linuxImage;
    } else if (os.toLowerCase().includes('ios')) {
      avatar = iosImage;
    } else if (os.toLowerCase().includes('android')) {
      avatar = androidImage;
    }
    return avatar;
  };
  const getTitle = (log: LoginLogReply) => {
    let device = t('userInfo.loginLog.Unknown');
    let type = t('userInfo.loginLog.Unknown');
    switch (log.login_type) {
      case 1:
        type = t('userInfo.loginLog.label.loginType.login');
        break;
      case 2:
        type = t('userInfo.loginLog.label.loginType.logout');
        break;
      default:
        break;
    }
    switch (log.device_type) {
      case 1:
        device = t('userInfo.loginLog.label.device.PC');
        break;
      case 2:
        device = t('userInfo.loginLog.label.device.Mobile');
        break;
      case 3:
        device = t('userInfo.loginLog.label.device.Tablet');
        break;
      case 4:
        device = t('userInfo.loginLog.label.device.Robot');
        break;
      default:
        break;
    }
    return `${device}-${type}`;
  };
  const renderData = (log: LoginLogReply) => {
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
        value: () => {
          if (log.position?.lat && log.position?.lng) {
            return `${log.position.lat},${log.position.lng}`;
          }
          return '0°,0°';
        },
      },
      {
        label: t('userInfo.loginLog.label.os'),
        value: log.os,
      },
      {
        label: t('userInfo.loginLog.label.agent'),
        value: log.agent,
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
