import { ref } from 'vue';

export default function useDeleteBatch() {
  const deleteBatch = ref(false);
  const setDeleteBatch = (value: boolean) => {
    deleteBatch.value = value;
  };
  const resetDeleteBatch = () => {
    deleteBatch.value = false;
  };
  return {
    deleteBatch,
    setDeleteBatch,
    resetDeleteBatch,
  };
}
