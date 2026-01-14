<template>
  <el-row :gutter="10" class="row">
    <el-col :span="8" class="col">{{ inputDateTime }}</el-col>
    <el-col :span="4" class="col"></el-col>
    <el-col :span="4" class="col">
      <LwDateTime v-model="datetime" :width="90" :height="90" :date-type="1" />
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { dayjs } from 'element-plus';

import LwDateTime from '@/lw-datetime/LwDateTime.vue';

const datetime = ref<Date>(dayjs().toDate());
const inputDateTime = ref<string>('');

watch(() => datetime.value, (newValue) => {
  inputDateTime.value = dayjs(newValue).format('DD-MM-YYYY HH:mm:ss');
})
</script>

<style scoped lang="scss">
.row {
  height: 50px;
  margin-top: 16px;
  background-color: darkkhaki;
  border-radius: 5px;
}

.col {
  height: 100%;
  display: flex !important;
  align-items: center;
  justify-content: center;
  border: 1px solid rosybrown;
  border-radius: 5px;
}

.test-input {
  height: 100%;
  padding: 0;
  text-align: center;
  box-sizing: border-box;
  border: none;
  &:focus,
  &:hover {
    outline: none;
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
}
</style>
