<template>
  <a-row style="margin-bottom: 16px">
    <a-col :span="24" style="text-align: right">
      <a-button @click="openSetting">
        <template #icon>
          <icon-settings />
        </template>
        {{ $t('system.table.setting') }}
      </a-button>
    </a-col>
  </a-row>
  <a-table
    row-key="id"
    :columns="columns"
    :scroll="setting.scroll"
    :bordered="{ cell: setting.border }"
    :hoverable="setting.hover"
    :stripe="setting.stripe"
    :size="setting.size"
    :column-resizable="setting.columnResizable"
    :loading="loading"
    :data="renderData"
    :pagination="pagination"
    @page-change="onPageChange"
  >
    <template #method="{ record }">
      <a-space wrap>
        <a-tag
          v-for="(item, index) of getMethods(record)"
          :key="index"
          :color="item.color"
          >{{ item.method }}</a-tag
        >
      </a-space>
    </template>
  </a-table>
  <a-drawer
    :visible="showDrawer"
    :width="500"
    unmount-on-close
    :footer="false"
    @ok="saveSetting"
    @cancel="cancelSetting"
  >
    <template #title>
      {{ $t('system.table.setting') }}
    </template>
    <a-form>
      <a-form-item :label="$t('system.table.setting.border')" field="border">
        <a-switch v-model="setting.border" />
      </a-form-item>
      <a-form-item :label="$t('system.table.setting.hover')" field="hover">
        <a-switch v-model="setting.hover" />
      </a-form-item>
      <a-form-item :label="$t('system.table.setting.stripe')" field="stripe">
        <a-switch v-model="setting.stripe" />
      </a-form-item>
      <a-form-item
        :label="$t('system.table.setting.resizeColumn')"
        field="columnResizable"
      >
        <a-switch v-model="setting.columnResizable" />
      </a-form-item>
      <a-form-item :label="$t('system.table.setting.size')" field="size">
        <a-radio-group v-model="setting.size" type="button">
          <a-radio value="mini">
            {{ $t('system.table.setting.size.mini') }}
          </a-radio>
          <a-radio value="small">
            {{ $t('system.table.setting.size.small') }}
          </a-radio>
          <a-radio value="medium">
            {{ $t('system.table.setting.size.medium') }}
          </a-radio>
          <a-radio value="large">
            {{ $t('system.table.setting.size.large') }}
          </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item :label="$t('system.table.setting.scroll')" field="scroll">
        <a-space direction="vertical">
          <a-input-number
            v-model="setting.scroll.x"
            :style="{ width: '320px' }"
            :default-value="setting.scroll.x"
            :step="100"
            mode="button"
            class="input-demo"
          />
          <a-input-number
            v-model="setting.scroll.y"
            :style="{ width: '320px' }"
            :default-value="setting.scroll.y"
            :step="100"
            mode="button"
            class="input-demo"
          />
        </a-space>
      </a-form-item>
    </a-form>
  </a-drawer>
</template>

<script lang="ts" setup>
  import { Pagination } from '@/types/global';
  import { reactive, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import { Router, RouterGroup } from '@/types/resource';
  import { Message } from '@arco-design/web-vue';
  import Error from '@/views/result/error/index.vue';
  import { getRouterList } from '@/api/resource';

  const { t } = useI18n();
  const { loading, setLoading } = useLoading(true);
  const basePagination: Pagination = {
    current: 1,
    pageSize: 10,
  };
  const showDrawer = ref<boolean>(false);
  const renderData = ref<RouterGroup[] | undefined>([]);
  const pagination = reactive({
    ...basePagination,
  });
  const setting = reactive({
    border: false,
    hover: true,
    stripe: false,
    columnResizable: true,
    size: 'medium',
    scroll: {
      x: 1000,
      y: 1000,
    },
  });
  const columns = [
    {
      title: t('system.router.name'),
      dataIndex: 'name',
    },
    {
      title: t('system.router.path'),
      dataIndex: 'path',
    },
    {
      title: t('system.router.method'),
      dataIndex: 'method',
      slotName: 'method',
    },
    {
      title: t('system.router.params'),
      dataIndex: 'params',
    },
  ];
  const fetchData = async (
    params: Pagination = { current: 1, pageSize: 10 }
  ) => {
    setLoading(true);
    try {
      const res = await getRouterList(pagination);
      renderData.value = res.metadata.list;
      pagination.current = params.current;
      pagination.total = res.metadata.total;
    } catch (err) {
      Message.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
  const onPageChange = (current: number) => {
    pagination.current = current;
    fetchData(pagination);
  };
  const openSetting = () => {
    showDrawer.value = true;
  };
  const saveSetting = () => {
    showDrawer.value = false;
  };
  const cancelSetting = () => {
    showDrawer.value = false;
  };
  const getMethods = (record: RouterGroup | Router) => {
    return record?.method?.split('|').map((item) => {
      const getColor = () => {
        switch (item.substring(1, item.length - 1)) {
          case 'GET':
            return '#1abc9c';
          case 'POST':
            return '#ffa502';
          case 'PUT':
            return '#1e90ff';
          case 'DELETE':
            return '#f5222d';
          default:
            return '#1abc9c';
        }
      };
      return {
        method: item.substring(1, item.length - 1),
        color: getColor(),
      };
    });
  };
</script>

<style scoped></style>
