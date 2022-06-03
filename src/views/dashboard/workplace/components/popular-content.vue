<template>
  <a-spin :loading="latestLoading && popularLoading" style="width: 100%">
    <a-card
      class="general-card"
      :header-style="{ paddingBottom: '0' }"
      :body-style="{ padding: '17px 20px 21px 20px' }"
    >
      <template #title>
        {{ $t('workplace.popularContent') }}
      </template>
      <template #extra>
        <a-link @click="refreshData">{{ $t('workplace.refresh') }}</a-link>
      </template>
      <a-space direction="vertical" :size="10" fill>
        <a-radio-group v-model:model-value="type" type="button">
          <a-radio value="popular">
            {{ $t('workplace.popularContent.popular') }}
          </a-radio>
          <a-radio value="latest">
            {{ $t('workplace.popularContent.latest') }}
          </a-radio>
        </a-radio-group>
        <a-table
          :data="renderList"
          :pagination="{
            pageSize: pageSize,
            current: type === 'popular' ? currentPopular : currentLatest,
            simple: true,
            total: 100,
          }"
          page-position="tr"
          :columns="columns"
          :scroll="{ x: '100%', y: '264px' }"
          @page-change="changePage"
        >
          <template #image="{ record }">
            <a-image :src="record.image" width="100" />
          </template>
          <template #labels="{ record }">
            <a-space wrap>
              <a-tag>{{ record.type }}</a-tag>
              <a-tag>{{ record.region }}</a-tag>
              <a-tag>{{ record.style }}</a-tag>
            </a-space>
          </template>
          <template #action="{ record }">
            <a-button @click="openTryOn(record)"
              >{{ $t('workplace.item.tryon') }}
            </a-button>
          </template>
        </a-table>
      </a-space>
    </a-card>
  </a-spin>
  <a-modal
    v-model:visible="showModal"
    :title="$t('workplace.figures.choose')"
    width="auto"
    :ok-loading="loading"
    :on-before-ok="handleTryOn"
    unmount-on-close
    @cancel="showModal = false"
  >
    <a-spin :loading="loading">
      <a-space>
        <a-radio-group
          v-model="tryonForm.img"
          direction="horizontal"
          size="large"
        >
          <a-radio
            v-for="(figure, index) of figures"
            :key="index"
            :value="figure"
          >
            <img
              :src="figure"
              alt="figure"
              style="
                padding: 10px;
                border: 1px solid #ced6e0;
                border-radius: 25px;
              "
            />
          </a-radio>
        </a-radio-group>
      </a-space>
    </a-spin>
  </a-modal>
</template>

<script lang="ts" setup>
  import { computed, h, reactive, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { getLatest, getPopular } from '@/api/recommend';
  import { usePagination } from 'vue-request';
  import { useUserStore } from '@/store';
  import useModal from '@/hooks/modal';
  import { TryOnRequest } from '@/api/model/tryon';
  import { Modal } from '@arco-design/web-vue';
  import useLoading from '@/hooks/loading';
  import { tryOnClothes } from '@/api/clothes';
  import { ClothesReply } from '@/api/model/clothes';

  const { t } = useI18n();
  const userStore = useUserStore();
  const { showModal } = useModal();
  const { loading, setLoading } = useLoading();
  const figures = computed(() => userStore.figures || []);
  const type = ref('popular');
  const {
    current: currentPopular,
    pageSize,
    changeCurrent: changePopularCurrent,
    data: popularData,
    loading: popularLoading,
    run: refreshPopular,
  } = usePagination(getPopular);
  const {
    current: currentLatest,
    changeCurrent: changeLatestCurrent,
    data: latestData,
    loading: latestLoading,
    run: refreshLatest,
  } = usePagination(getLatest);
  const tryonForm = reactive<TryOnRequest>({
    img: '',
    clothes: '',
    clothesId: '',
  });
  const renderList = computed(() => {
    if (type.value === 'popular') {
      return popularData.value?.metadata.list || [];
    }
    return latestData.value?.metadata.list || [];
  });
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: t('workplace.item.image'),
      dataIndex: 'image',
      slotName: 'image',
    },
    {
      title: t('workplace.item.labels'),
      slotName: 'labels',
      width: 180,
    },
    {
      title: t('system.table.actions'),
      slotName: 'action',
    },
  ];
  const changePage = (page: number) => {
    if (type.value === 'popular') {
      changePopularCurrent(page);
    } else {
      changeLatestCurrent(page);
    }
  };
  const refreshData = () => {
    if (type.value === 'popular') {
      refreshPopular({
        current: currentPopular.value,
        pageSize: pageSize.value,
      });
    } else {
      refreshLatest({
        current: currentLatest.value,
        pageSize: pageSize.value,
      });
    }
  };
  const openTryOn = (clothes: ClothesReply) => {
    tryonForm.clothesId = clothes.id;
    tryonForm.clothes = clothes.image;
    showModal.value = true;
  };
  const handleTryOn = async (done: any) => {
    setLoading(true);
    try {
      setLoading(true);
      const { metadata } = await tryOnClothes(tryonForm);
      Modal.open({
        title: t('workplace.tryon.success'),
        content: () => {
          return h('img', {
            src: metadata.result,
          });
        },
        width: 'auto',
        onOk: () => {
          done();
        },
      });
    } catch (e) {
      done(false);
    } finally {
      setLoading(false);
    }
  };
</script>

<style scoped lang="less">
  .general-card {
    min-height: 388px;
  }

  :deep(.arco-table-tr) {
    height: 44px;

    .arco-typography {
      margin-bottom: 0;
    }
  }

  .increases-cell {
    display: flex;
    align-items: center;

    span {
      margin-right: 4px;
    }
  }
</style>
