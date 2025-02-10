<template>  
    <form
      class="flex align-items-center gap-0 bg-white shadow-2 h-3rem border-round-md"
      @submit.prevent="handleSubmit"
    >
      <InputText
        v-model="trackingNumber"
        placeholder="Enter tracking number"
        class="flex-1 tracking-input h-full"
        :class="{ 'border-red-500 border-1': props.isError }"
      />  
      <Button
        type="submit"
        label="Track"
        class="tracking-button h-full"
      /> 
    </form>  
  </template>  
  
  <script setup lang="ts">  
  import { ref, defineEmits } from 'vue';
  import InputText from 'primevue/inputtext';
  import Button from 'primevue/button';

  const props = defineProps<{
    isError: boolean;
  }>();
  
  const trackingNumber = ref('');  
  const emit = defineEmits(['submit']);
  
  const handleSubmit = () => {  
    emit('submit', trackingNumber.value);
  };  
  </script>

  <style scoped>
  .tracking-input {
    background-color: transparent !important;
    color: black;
    border-color: white;
    border-right: 0;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  .tracking-button {
    background-color: #5932EA !important;
    color: var(--color-white) !important;
    font-weight: 500;
    border: none;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  .tracking-button:hover {
    background-color: #4c2bd4 !important;
    border: none;
    opacity: .9;
  }
  </style>