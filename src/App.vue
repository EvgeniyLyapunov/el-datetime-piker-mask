<template>
  <el-date-picker
    v-model="datetime"
    type="datetime"
    placeholder="Select date and time"
  />
  <input
    v-model="date1"
    type="number"
    class="test-input"
    :style="{ width: String(date1).length + 0.5 + 'ch' }"
  />
  <span>-</span>
  <input
    v-model="date2"
    type="number"
    class="test-input"
    :style="{ width: String(date2).length + 0.5 + 'ch' }"
  />
  <span>-</span>
  <input
    v-model="date3"
    type="number"
    class="test-input"
    :style="{ width: String(date3).length + 0.5 + 'ch' }"
  />

  <el-row :gutter="10" class="row">
    <el-col :span="8" class="col"></el-col>
    <el-col :span="8" class="col">
      <LwMaskDateTimePicker
        v-model="datetime"
        :width="90"
        :height="90"
        :format="'DD-MM-YYYY HH:mm:ss'"
      />
    </el-col>
    <el-col :span="8" class="col">
      <LwDateTime v-model="datetime" :width="90" :height="90" :date-type="1" />
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { dayjs } from 'element-plus';

import LwMaskDateTimePicker from '@/lw-mask-datetime-picker/LwMaskDateTimePicker.vue';
import LwDateTime from '@/lw-datetime/LwDateTime.vue';

const datetime = ref<Date>(dayjs().toDate());

const date1 = ref<number>(13);
const date2 = ref<number>(12);
const date3 = ref<number>(2025);
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
