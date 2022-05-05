<template>
  <a-list :bordered="false">
    <a-list-item>
      <a-list-item-meta>
        <template #avatar>
          <a-typography-paragraph>
            {{ $t('userSetting.SecuritySettings.form.label.password') }}
          </a-typography-paragraph>
        </template>
        <template #description>
          <div class="content">
            <a-typography-paragraph>
              {{ $t('userSetting.SecuritySettings.placeholder.password') }}
            </a-typography-paragraph>
          </div>
          <div class="operation">
            <a-button @click="showModal = true">
              {{ $t('userSetting.SecuritySettings.button.update') }}
            </a-button>
          </div>
        </template>
      </a-list-item-meta>
    </a-list-item>
    <a-list-item>
      <a-list-item-meta>
        <template #avatar>
          <a-typography-paragraph>
            {{ $t('userSetting.SecuritySettings.form.label.phone') }}
          </a-typography-paragraph>
        </template>
        <template #description>
          <div class="content">
            <a-typography-paragraph>
              已绑定：{{ userStore.mobile }}
            </a-typography-paragraph>
          </div>
        </template>
      </a-list-item-meta>
    </a-list-item>
    <a-list-item>
      <a-list-item-meta>
        <template #avatar>
          <a-typography-paragraph>
            {{ $t('userSetting.SecuritySettings.form.label.email') }}
          </a-typography-paragraph>
        </template>
        <template #description>
          <div class="content">
            <a-typography-paragraph v-if="userStore.email">
              已绑定：{{ userStore.email }}
            </a-typography-paragraph>
            <a-typography-paragraph v-else class="tip">
              {{ $t('userSetting.SecuritySettings.placeholder.email') }}
            </a-typography-paragraph>
          </div>
        </template>
      </a-list-item-meta>
    </a-list-item>
  </a-list>
  <a-modal
    v-model:visible="showModal"
    :title="$t('userSetting.SecuritySettings.modal.password')"
    :ok-loading="loading"
    unmount-on-close
    @ok="handlePassword"
    @cancel="showModal = false"
  >
    <a-form ref="formRef" :model="passwordInfo">
      <a-form-item
        field="oldPassword"
        :label="$t('userSetting.SecuritySettings.form.oldPassword')"
        :rules="[
          { required: true, message: $t('login.form.password.errMsg') },
          { minLength: 6, message: $t('login.form.password.match.errMsg') },
        ]"
        :validate-trigger="['change', 'blur']"
      >
        <a-input-password v-model="passwordInfo.oldPassword" allow-clear>
          <template #prefix>
            <icon-lock />
          </template>
        </a-input-password>
      </a-form-item>
      <a-form-item
        field="newPassword"
        :label="$t('userSetting.SecuritySettings.form.newPassword')"
        :rules="[
          { required: true, message: $t('login.form.password.errMsg') },
          { minLength: 6, message: $t('login.form.password.match.errMsg') },
          { validator: validatePassword },
        ]"
        :validate-trigger="['change', 'blur']"
      >
        <a-input-password v-model="passwordInfo.newPassword" allow-clear>
          <template #prefix>
            <icon-lock />
          </template>
        </a-input-password>
      </a-form-item>
      <a-form-item
        field="confirm_password"
        :label="$t('userSetting.SecuritySettings.form.confirmPassword')"
        :rules="[
          { required: true, message: $t('login.form.password.errMsg') },
          { minLength: 6, message: $t('login.form.password.match.errMsg') },
          { validator: validateConfirmCheck },
        ]"
        :validate-trigger="['change', 'blur']"
      >
        <a-input-password v-model="passwordInfo.confirmPassword" allow-clear>
          <template #prefix>
            <icon-lock />
          </template>
        </a-input-password>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
  import { useUserStore } from '@/store';
  import { useI18n } from 'vue-i18n';
  import { reactive, ref } from 'vue';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import { Message } from '@arco-design/web-vue';
  import { updatePassword } from '@/api/user';
  import { PasswordRequest } from '@/api/model/user';
  import useLoading from '@/hooks/loading';
  import { useToggle } from '@vueuse/core';

  const { t } = useI18n();
  const userStore = useUserStore();
  const [showModal] = useToggle();
  const { loading, setLoading } = useLoading();
  const formRef = ref<FormInstance>();
  const passwordInfo = reactive<PasswordRequest>({
    id: userStore.id,
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const validateConfirmCheck = (
    value: any,
    callback: (error?: string) => void
  ) => {
    if (value === undefined) {
      callback();
      return;
    }
    if (value !== passwordInfo.newPassword) {
      callback(t('userSetting.SecuritySettings.form.match.errMsg'));
      return;
    }
    callback();
  };

  const validatePassword = (value: any, callback: (error?: string) => void) => {
    if (value === undefined) {
      callback();
      return;
    }
    if (value === passwordInfo.oldPassword) {
      callback(t('userSetting.SecuritySettings.form.newPassword.match.errMsg'));
      return;
    }
    callback();
  };
  const handlePassword = () => {
    formRef.value?.validate(async (errors: any) => {
      if (!errors) {
        setLoading(true);
        try {
          await updatePassword(passwordInfo);
          Message.success(t('userSetting.SecuritySettings.form.success'));
          showModal.value = false;
        } catch (error) {
          Message.error(t('userSetting.SecuritySettings.form.fail'));
        } finally {
          setLoading(false);
        }
      }
    });
  };
</script>

<style scoped lang="less">
  :deep(.arco-list-item) {
    border-bottom: none !important;

    .arco-typography {
      margin-bottom: 20px;
    }

    .arco-list-item-meta-avatar {
      margin-bottom: 1px;
    }

    .arco-list-item-meta {
      padding: 0;
    }
  }

  :deep(.arco-list-item-meta-content) {
    flex: 1;
    border-bottom: 1px solid var(--color-neutral-3);

    .arco-list-item-meta-description {
      display: flex;
      flex-flow: row;
      justify-content: space-between;

      .tip {
        color: rgb(var(--gray-6));
      }

      .operation {
        margin-right: 6px;
      }
    }
  }
</style>
