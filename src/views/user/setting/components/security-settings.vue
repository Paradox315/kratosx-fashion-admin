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
            <a-button @click="handleClick">
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
    v-model:visible="visible"
    :title="$t('userSetting.SecuritySettings.modal.password')"
    unmount-on-close
    @before-ok="handleBeforeOk"
    @cancel="handleCancel"
  >
    <a-form ref="formRef" :model="passwordInfo">
      <a-form-item
        field="old_password"
        :label="$t('userSetting.SecuritySettings.form.oldPassword')"
        :rules="[
          { required: true, message: $t('login.form.password.errMsg') },
          { minLength: 6, message: $t('login.form.password.match.errMsg') },
        ]"
        :validate-trigger="['change', 'blur']"
      >
        <a-input-password v-model="passwordInfo.old_password" allow-clear>
          <template #prefix>
            <icon-lock />
          </template>
        </a-input-password>
      </a-form-item>
      <a-form-item
        field="new_password"
        :label="$t('userSetting.SecuritySettings.form.newPassword')"
        :rules="[
          { required: true, message: $t('login.form.password.errMsg') },
          { minLength: 6, message: $t('login.form.password.match.errMsg') },
          { validator: validatePassword },
        ]"
        :validate-trigger="['change', 'blur']"
      >
        <a-input-password v-model="passwordInfo.new_password" allow-clear>
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
        <a-input-password v-model="passwordInfo.confirm_password" allow-clear>
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

  const { t } = useI18n();
  const userStore = useUserStore();
  const visible = ref(false);
  const formRef = ref<FormInstance>();
  const passwordInfo = reactive({
    id: userStore.id,
    old_password: '',
    new_password: '',
    confirm_password: '',
  });
  const handleClick = () => {
    visible.value = true;
  };
  const handleCancel = () => {
    visible.value = false;
  };

  const validateConfirmCheck = (
    value: any,
    callback: (error?: string) => void
  ) => {
    if (value === undefined) {
      callback();
      return;
    }
    if (value !== passwordInfo.new_password) {
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
    if (value === passwordInfo.old_password) {
      callback(t('userSetting.SecuritySettings.form.newPassword.match.errMsg'));
      return;
    }
    callback();
  };
  const handleBeforeOk = async (done: any) => {
    const res = await formRef.value?.validate();
    if (!res) {
      await updatePassword(passwordInfo);
      Message.success(t('userSetting.SecuritySettings.form.submit.success'));
      done();
    } else {
      Message.error(t('userSetting.SecuritySettings.form.submit.error'));
      done();
    }
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
