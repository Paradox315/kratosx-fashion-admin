import { ref } from 'vue';

export default function useModal() {
  const showModal = ref(false);
  const setModal = (value: boolean) => {
    showModal.value = value;
  };
  return {
    showModal,
    setModal,
  };
}
