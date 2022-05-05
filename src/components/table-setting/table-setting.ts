import { reactive, ref } from 'vue';

export default function useTableSetting() {
  const setting = reactive({
    border: false,
    hover: true,
    stripe: false,
    checkbox: false,
    columnResizable: true,
    size: 'medium',
    scroll: {
      x: 1350,
      y: 1000,
    },
  });
  const showSetting = ref(false);
  const setSetting = (value: boolean) => {
    showSetting.value = value;
  };
  return {
    setting,
    showSetting,
    setSetting,
  };
}
