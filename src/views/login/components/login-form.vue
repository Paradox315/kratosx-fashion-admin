<template>
  <div class="login-form-wrapper">
    <div class="login-form-title">{{ $t('login.form.title') }}</div>
    <div class="login-form-sub-title">{{ $t('login.form.title') }}</div>
    <div class="login-form-error-msg">{{ errorMessage }}</div>
    <a-form
      ref="loginForm"
      :model="userInfo"
      class="login-form"
      layout="vertical"
      @submit="handleSubmit"
    >
      <a-form-item
        field="username"
        :rules="[{ required: true, message: $t('login.form.username.errMsg') }]"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <a-input
          v-model="userInfo.username"
          :placeholder="$t('login.form.userName.placeholder')"
        >
          <template #prefix>
            <icon-user />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item
        field="password"
        :rules="[{ required: true, message: $t('login.form.password.errMsg') }]"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <a-input-password
          v-model="userInfo.password"
          :placeholder="$t('login.form.password.placeholder')"
          allow-clear
        >
          <template #prefix>
            <icon-lock />
          </template>
        </a-input-password>
      </a-form-item>
      <a-form-item
        field="captcha"
        :rules="[{ required: true, message: $t('login.form.captcha.errMsg') }]"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <div class="pic-box">
          <a-input
            v-model="userInfo.captcha"
            style="width: 60%"
            :placeholder="$t('login.form.captcha.placeholder')"
          >
            <template #prefix>
              <icon-safe />
            </template>
          </a-input>
          <div class="pic">
            <img
              :src="captcha.src"
              :alt="$t('login.form.captcha.alt')"
              @click="captcha.refresh"
            />
          </div>
        </div>
      </a-form-item>
      <a-space :size="16" direction="vertical">
        <a-button type="primary" html-type="submit" long :loading="loading">
          {{ $t('login.form.login') }}
        </a-button>
        <a-button
          type="text"
          long
          class="login-form-register-btn"
          @click="openModal"
        >
          {{ $t('login.form.register') }}
        </a-button>
      </a-space>
    </a-form>
    <a-modal
      v-model:visible="showModal"
      :title="$t('login.form.register')"
      unmount-on-close
      :ok-loading="loading"
      :ok-text="$t('login.form.register')"
      @cancel="showModal = false"
      @ok="handleRegister"
    >
      <a-form ref="formRef" :model="registerInfo">
        <a-form-item
          field="username"
          :label="$t('login.form.register.username')"
          :rules="[
            { required: true, message: $t('login.form.username.errMsg') },
            {
              match: usernamePattern,
              message: $t('login.form.username.errMsg'),
            },
          ]"
          :extra="$t('login.form.register.username.extra')"
          :validate-trigger="['change', 'blur']"
        >
          <a-input v-model="registerInfo.username">
            <template #prefix>
              <icon-user />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item
          field="password"
          :label="$t('login.form.register.password')"
          :rules="[
            { required: true, message: $t('login.form.password.errMsg') },
            { minLength: 6, message: $t('login.form.password.errMsg') },
          ]"
          :extra="$t('login.form.register.password.extra')"
          :validate-trigger="['change', 'blur']"
        >
          <a-input-password v-model="registerInfo.password" allow-clear>
            <template #prefix>
              <icon-lock />
            </template>
          </a-input-password>
        </a-form-item>
        <a-form-item
          field="email"
          :label="$t('login.form.register.email')"
          :rules="[
            { match: emailPattern, message: $t('login.form.email.errMsg') },
          ]"
        >
          <a-input v-model="registerInfo.email">
            <template #prefix>
              <icon-email />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item
          field="mobile"
          :label="$t('login.form.register.mobile')"
          :rules="[
            { match: mobilePattern, message: $t('login.form.mobile.errMsg') },
          ]"
        >
          <a-input v-model="registerInfo.mobile">
            <template #prefix>
              <icon-phone />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item
          field="captcha"
          :label="$t('login.form.register.captcha')"
          :rules="[
            { required: true, message: $t('login.form.captcha.errMsg') },
          ]"
          :validate-trigger="['change', 'blur']"
        >
          <div class="pic-box">
            <a-input
              v-model="registerInfo.captcha"
              style="width: 60%"
              :placeholder="$t('login.form.captcha.placeholder')"
            >
              <template #prefix>
                <icon-safe />
              </template>
            </a-input>
            <div class="pic">
              <img
                v-if="captcha.src"
                :src="captcha.src"
                :alt="$t('login.form.captcha.alt')"
                @click="captcha.refresh"
              />
            </div>
          </div>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { Message } from '@arco-design/web-vue';
  import { ValidatedError } from '@arco-design/web-vue/es/form/interface';
  import { useI18n } from 'vue-i18n';
  import { useUserStore } from '@/store';
  import useLoading from '@/hooks/loading';
  import { getCaptcha, userRegister } from '@/api/public';
  import { LoginRequest, RegisterRequest } from '@/api/model/public';
  import { mobilePattern, emailPattern, usernamePattern } from '@/types/global';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import { useToggle } from '@vueuse/core';

  const router = useRouter();
  const { t } = useI18n();
  const errorMessage = ref('');
  const { loading, setLoading } = useLoading();
  const [showModal] = useToggle();
  const userStore = useUserStore();

  const formRef = ref<FormInstance>();
  const userInfo = reactive<LoginRequest>({
    username: 'admin',
    password: '123456',
    captchaId: '',
    captcha: '',
  });
  const registerInfo = reactive<RegisterRequest>({
    username: '',
    password: '',
    mobile: '',
    email: '',
    captchaId: '',
    captcha: '',
  });
  const captcha = reactive({
    src: '',
    refresh: async () => {
      const res = await getCaptcha();
      userInfo.captchaId = res.metadata.captchaId;
      registerInfo.captchaId = res.metadata.captchaId;
      captcha.src = res.metadata.picPath as string;
    },
  });
  const openModal = () => {
    formRef.value?.resetFields();
    showModal.value = true;
  };
  // 提交表单
  const handleSubmit = async ({
    errors,
    values,
  }: {
    errors: Record<string, ValidatedError> | undefined;
    values: LoginRequest;
  }) => {
    if (!errors) {
      setLoading(true);
      try {
        await userStore.login(values);
        const { redirect, ...othersQuery } = router.currentRoute.value.query;
        router.push({
          name: (redirect as string) || 'Workplace',
          query: {
            ...othersQuery,
          },
        });
        Message.success(t('login.form.login.success'));
      } catch (err) {
        errorMessage.value = (err as Error).message;
      } finally {
        setLoading(false);
      }
    }
  };
  const handleRegister = () => {
    formRef.value?.validate(async (errors: any) => {
      if (!errors) {
        setLoading(true);
        try {
          await userRegister(registerInfo);
          Message.success(t('login.form.register.success'));
          showModal.value = false;
        } catch (err) {
          errorMessage.value = (err as Error).message;
        } finally {
          setLoading(false);
        }
      }
    });
  };
  onMounted(() => {
    captcha.refresh();
  });
</script>

<style lang="less" scoped>
  .login-form {
    &-wrapper {
      width: 320px;
    }

    &-title {
      color: var(--color-text-1);
      font-weight: 500;
      font-size: 24px;
      line-height: 32px;
    }

    &-sub-title {
      color: var(--color-text-3);
      font-size: 16px;
      line-height: 24px;
    }

    &-error-msg {
      height: 32px;
      color: rgb(var(--red-6));
      line-height: 32px;
    }

    &-password-actions {
      display: flex;
      justify-content: space-between;
    }

    &-register-btn {
      color: var(--color-text-3) !important;
    }
  }

  .pic-box {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  .pic {
    width: 33%;
    height: 38px;
    background: #ccc;

    img {
      width: 100%;
      height: 100%;
      vertical-align: middle;
    }
  }
</style>
