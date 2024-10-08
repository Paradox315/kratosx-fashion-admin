<template>
  <a-form
    ref="formRef"
    :model="formData"
    class="form"
    :label-col-props="{ span: 8 }"
    :wrapper-col-props="{ span: 16 }"
    @submit="handleSubmit"
  >
    <a-form-item
      field="email"
      :label="$t('userSetting.basicInfo.form.label.email')"
      :rules="[
        {
          match: emailPattern,
          message: $t('userSetting.basicInfo.form.error.email'),
        },
      ]"
    >
      <a-input
        v-model="formData.email"
        :placeholder="$t('userSetting.basicInfo.placeholder.email')"
      />
    </a-form-item>
    <a-form-item
      field="mobile"
      :label="$t('userSetting.basicInfo.form.label.mobile')"
      :rules="[
        {
          match: mobilePattern,
          message: $t('userSetting.basicInfo.form.error.mobile'),
        },
      ]"
    >
      <a-input
        v-model="formData.mobile"
        :placeholder="$t('userSetting.basicInfo.placeholder.mobile')"
      />
    </a-form-item>
    <a-form-item
      field="nickname"
      :label="$t('userSetting.basicInfo.form.label.nickname')"
    >
      <a-input
        v-model="formData.nickname"
        :placeholder="$t('userSetting.basicInfo.placeholder.nickname')"
      />
    </a-form-item>
    <a-form-item
      field="gender"
      :label="$t('userSetting.basicInfo.form.label.gender')"
    >
      <a-radio-group v-model="formData.gender" type="button">
        <a-radio :value="0"
          >{{ $t('userSetting.basicInfo.form.label.unknown') }}
        </a-radio>
        <a-radio :value="1"
          >{{ $t('userSetting.basicInfo.form.label.male') }}
        </a-radio>
        <a-radio :value="2"
          >{{ $t('userSetting.basicInfo.form.label.female') }}
        </a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item
      field="age"
      :label="$t('userSetting.basicInfo.form.label.age')"
    >
      <a-input-number
        v-model="formData.age"
        :default-value="18"
      ></a-input-number>
    </a-form-item>
    <a-form-item
      field="birthday"
      :label="$t('userSetting.basicInfo.form.label.birthday')"
    >
      <a-date-picker
        v-model="formData.birthday"
        :default-value="dayjs().format('YYYY-MM-DD')"
      ></a-date-picker>
    </a-form-item>
    <a-form-item
      field="country"
      :label="$t('userSetting.basicInfo.form.label.countryRegion')"
    >
      <a-select
        v-model="formData.country"
        :placeholder="$t('userSetting.basicInfo.placeholder.area')"
        :options="countryOptions"
      >
      </a-select>
    </a-form-item>
    <a-form-item
      field="city"
      :label="$t('userSetting.basicInfo.form.label.area')"
    >
      <a-select
        v-model="formData.city"
        :placeholder="$t('userSetting.basicInfo.placeholder.area')"
        :options="cityOptions"
        allow-clear
      />
    </a-form-item>
    <a-form-item
      field="address"
      :label="$t('userSetting.basicInfo.form.label.address')"
    >
      <a-input
        v-model="formData.address"
        :placeholder="$t('userSetting.basicInfo.placeholder.address')"
      />
    </a-form-item>
    <a-form-item
      field="description"
      :label="$t('userSetting.basicInfo.form.label.profile')"
      :rules="[
        {
          maxLength: 200,
          message: $t('userSetting.form.error.profile.maxLength'),
        },
      ]"
      row-class="keep-margin"
    >
      <a-textarea
        v-model="formData.description"
        :placeholder="$t('userSetting.basicInfo.placeholder.profile')"
      />
    </a-form-item>
    <a-form-item>
      <a-space>
        <a-button
          type="primary"
          html-type="submit"
          :loading="loading"
          @click="validate"
        >
          {{ $t('userSetting.save') }}
        </a-button>
        <a-button type="secondary" @click="reset">
          {{ $t('userSetting.reset') }}
        </a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import { UserRequest } from '@/api/model/user';
  import { ValidatedError } from '@arco-design/web-vue/es/form/interface';
  import { useUserStore } from '@/store';
  import useLoading from '@/hooks/loading';
  import { Message } from '@arco-design/web-vue';
  import { useI18n } from 'vue-i18n';
  import { mobilePattern, emailPattern } from '@/types/global';
  import dayjs from 'dayjs';

  const { t } = useI18n();
  const errorMessage = ref('');
  const { loading, setLoading } = useLoading();
  const userStore = useUserStore();
  const formRef = ref<FormInstance>();
  const getGender = (gender: string | undefined) => {
    if (gender === '男') {
      return 1;
    }
    if (gender === '女') {
      return 2;
    }
    return 0;
  };
  const formData = reactive<UserRequest>({
    email: userStore.email,
    nickname: userStore.nickname,
    mobile: userStore.mobile,
    address: userStore.address,
    country: userStore.country,
    city: userStore.city,
    description: userStore.description,
    birthday: userStore.birthday,
    gender: getGender(userStore.gender),
    figures: userStore.figures,
  });

  const countryOptions = ['中国'];
  const cityOptions = ['上海', '北京', '广州', '深圳', '武汉', '成都', '天津'];
  const validate = async () => {
    await formRef.value?.validate();
  };
  const reset = async () => {
    await formRef.value?.resetFields();
  };
  // 提交表单
  const handleSubmit = async ({
    errors,
    values,
  }: {
    errors: Record<string, ValidatedError> | undefined;
    values: UserRequest;
  }) => {
    if (!errors) {
      setLoading(true);
      try {
        await userStore.update(values);
        Message.success(t('userSetting.form.submit.success'));
      } catch (err) {
        errorMessage.value = (err as Error).message;
      } finally {
        setLoading(false);
      }
    }
  };
</script>

<style scoped lang="less">
  .form {
    width: 540px;
    margin: 0 auto;
  }
</style>
