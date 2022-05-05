<template>
  <a-drawer
    :visible="visible"
    :width="500"
    unmount-on-close
    :footer="false"
    @ok="setVisible(false)"
    @cancel="setVisible(false)"
  >
    <template #title>
      {{ $t('system.table.setting') }}
    </template>
    <a-form :model="setting">
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
      <a-form-item
        v-show="!disableCheckbox"
        :label="$t('system.table.setting.checkbox')"
        field="checkbox"
      >
        <a-switch
          v-model="setting.checkbox"
          @change="$emit('checkBoxChange', setting.checkbox)"
        />
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
  import { computed } from 'vue';
  import { useVModel } from '@vueuse/core';

  const props = defineProps<{
    visible: boolean;
    setting: {
      border: boolean;
      hover: boolean;
      stripe: boolean;
      checkbox: boolean;
      columnResizable: boolean;
      size: 'mini' | 'small' | 'medium' | 'large';
      scroll: {
        x: number;
        y: number;
      };
    };
    disableCheckbox?: boolean;
  }>();
  const emit = defineEmits([
    'update:setting',
    'update:visible',
    'checkBoxChange',
  ]);

  const setting = useVModel(props, 'setting', emit);
  const visible = useVModel(props, 'visible', emit);
  const setVisible = (value: boolean) => {
    visible.value = value;
  };
</script>

<style scoped></style>
