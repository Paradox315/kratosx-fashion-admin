<template>
  <a-card class="general-card" :title="$t('userInfo.title.myFigure')">
    <template #extra>
      <a-upload
        :custom-request="uploadRequest"
        list-type="picture-card"
        accept="image/png,image/jpg"
        :file-list="fileList"
        :show-upload-button="true"
        :show-file-list="false"
        @change="uploadChange"
      >
        <template #upload-button>
          <a-link>{{ $t('userInfo.addFigure') }}</a-link>
        </template>
      </a-upload>
    </template>
    <div class="banner">
      <div class="banner-inner">
        <a-carousel
          v-if="hasFigures"
          :auto-play="true"
          animation-name="card"
          show-arrow="hover"
          indicator-position="outer"
          class="carousel"
        >
          <a-carousel-item
            v-for="(figure, index) of userStore.figures"
            :key="index"
          >
            <div :key="index" class="carousel-item">
              <img class="carousel-image" :src="figure" style="width: 150px" />
            </div>
          </a-carousel-item>
        </a-carousel>
        <a-result v-else status="404">
          <template #subtitle>
            {{ $t('userInfo.nodata') }}
          </template>
        </a-result>
      </div>
    </div>
  </a-card>
</template>

<script lang="ts" setup>
  import { useUserStore } from '@/store';
  import { computed, ref } from 'vue';
  import {
    FileItem,
    RequestOption,
  } from '@arco-design/web-vue/es/upload/interfaces';
  import { uploadFile } from '@/api/public';
  import { UserRequest } from '@/api/model/user';

  const userStore = useUserStore();
  const figures = computed(() => userStore.figures || []);
  const hasFigures = computed(() => figures.value.length > 0);
  const file: FileItem = {
    uid: '',
    name: 'figure.png',
  };
  const fileList = ref<FileItem[]>([file]);
  const uploadChange = (fileItemList: FileItem[], fileItem: FileItem) => {
    fileList.value = [fileItem];
  };
  const uploadRequest = async (options: RequestOption) => {
    const { onProgress, onError, onSuccess, fileItem, name = 'file' } = options;
    onProgress(20);
    const formData = new FormData();
    formData.append(name as string, fileItem.file as Blob);
    const onUploadProgress = (event: ProgressEvent) => {
      let percent;
      if (event.total > 0) {
        percent = (event.loaded / event.total) * 100;
      }
      onProgress(parseInt(String(percent), 10), event);
    };
    try {
      const res = await uploadFile(formData, onUploadProgress);
      userStore.figures?.push(res.metadata.url);
      await userStore.update({
        figures: userStore.figures,
        address: userStore.address,
        city: userStore.city,
        country: userStore.country,
        birthday: userStore.birthday,
        description: userStore.description,
      } as UserRequest);
      onSuccess(res);
    } catch (error) {
      onError(error);
    }
  };
</script>

<style scoped lang="less">
  :deep(.arco-card-body) {
    min-height: 128px;
    padding-bottom: 0;
  }

  .banner {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
    padding-bottom: 40px;

    &-inner {
      flex: 1;
      height: 100%;
    }
  }

  .carousel {
    height: 100%;

    &-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
    }

    &-image {
      width: 320px;
      margin-top: 30px;
    }
  }
</style>
