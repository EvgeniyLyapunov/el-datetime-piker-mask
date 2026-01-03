<template>
  <div
    class="lw-date-time"
    tabindex="0"
    ref="mainElemRef"
    @click="mainElemClick"
    @focus="mainElemFocus"
  >
    <input
      v-if="
        props.dateType === DateTypeEnum.date ||
        props.dateType === DateTypeEnum.datetime
      "
      v-model="modelFormatObject!.DD"
      ref="inputDaysRef"
      type="text"
      class="lw-date-time__input"
      :style="{ width: String(modelFormatObject!.DD).length + 0.5 + 'ch' }"
      data-input="DD"
      @focus="inputFocus"
      @blur="inputBlur"
    />
    <span
      v-if="
        props.dateType === DateTypeEnum.date ||
        props.dateType === DateTypeEnum.datetime
      "
      >-</span
    >
    <input
      v-if="
        props.dateType === DateTypeEnum.date ||
        props.dateType === DateTypeEnum.datetime
      "
      v-model="modelFormatObject!.MM"
      ref="inputMonthRef"
      type="text"
      class="lw-date-time__input"
      :style="{ width: String(modelFormatObject!.MM).length + 0.5 + 'ch' }"
      data-input="MM"
      @blur="inputBlur"
    />
    <span
      v-if="
        props.dateType === DateTypeEnum.date ||
        props.dateType === DateTypeEnum.datetime
      "
      >-</span
    >
    <input
      v-if="
        props.dateType === DateTypeEnum.date ||
        props.dateType === DateTypeEnum.datetime
      "
      v-model="modelFormatObject!.YYYY"
      ref="inputYearsRef"
      type="text"
      class="lw-date-time__input"
      :style="{ width: String(modelFormatObject!.YYYY).length + 0.5 + 'ch' }"
      data-input="YYYY"
      @blur="inputBlur"
    />
    <div
      v-if="props.dateType === DateTypeEnum.datetime"
      class="lw-date-time__space-divider"
    ></div>
    <input
      v-if="props.dateType === DateTypeEnum.datetime"
      v-model="modelFormatObject!.HH"
      ref="inputHoursRef"
      type="text"
      class="lw-date-time__input"
      :style="{ width: String(modelFormatObject!.HH).length + 0.5 + 'ch' }"
      data-input="HH"
      @blur="inputBlur"
    />
    <span v-if="props.dateType === DateTypeEnum.datetime">:</span>
    <input
      v-if="props.dateType === DateTypeEnum.datetime"
      v-model="modelFormatObject!.mm"
      ref="inputMinutesRef"
      type="text"
      class="lw-date-time__input"
      :style="{ width: String(modelFormatObject!.mm).length + 0.5 + 'ch' }"
      data-input="mm"
      @blur="inputBlur"
    />
    <span v-if="props.dateType === DateTypeEnum.datetime">:</span>
    <input
      v-if="props.dateType === DateTypeEnum.datetime"
      v-model="modelFormatObject!.ss"
      ref="inputSecondsRef"
      type="text"
      class="lw-date-time__input"
      :style="{ width: String(modelFormatObject!.ss).length + 0.5 + 'ch' }"
      data-input="ss"
      @blur="inputBlur"
    />
    <!-- кнопка-иконка пикера -->
    <el-icon class="lw-date-time__icon" @click="onPickerShowToggle"
      ><Calendar
    /></el-icon>

    <!-- скрытый дата пикер -->
    <el-date-picker
      v-model="model"
      ref="dateTimePickref"
      class="lw-dt-picker__hidden"
      :type="getType"
      :format="getFormat"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import {
  DateTypeEnum,
  type IDateFormatObject
} from '@/lw-datetime/lw-datetime-types';
import { dayjs } from 'element-plus';
import {
  daysArrowInput,
  monthArrowInput,
  yearsArrowInput,
  hoursArrowInput,
  minutesOrSecondsArrowInput
} from '@/lw-datetime/lw-arrows-inputs';
import { getValidModel } from '@/lw-datetime/lw-valid-model';

interface IProps {
  modelValue: Date;
  dateType: DateTypeEnum;
  width?: number;
  height?: number;
  widthUnit?: '%' | 'px';
  heightUnit?: '%' | 'px';
  bg?: string;
}

type inputSubjType = 'DD' | 'MM' | 'YYYY' | 'HH' | 'mm' | 'ss';

const model = defineModel<Date>({ required: true });

const modelFormatObject = ref<IDateFormatObject>({
  DD: '',
  MM: '',
  YYYY: '',
  HH: '',
  mm: '',
  ss: ''
});

const mainElemRef = ref();
const isListenerExist = ref<boolean>(false);

const inputDaysRef = ref<HTMLInputElement | null>(null);
const inputMonthRef = ref<HTMLInputElement | null>(null);
const inputYearsRef = ref<HTMLInputElement | null>(null);
const inputHoursRef = ref<HTMLInputElement | null>(null);
const inputMinutesRef = ref<HTMLInputElement | null>(null);
const inputSecondsRef = ref<HTMLInputElement | null>(null);

const focusableElems = [
  inputDaysRef,
  inputMonthRef,
  inputYearsRef,
  inputHoursRef,
  inputMinutesRef,
  inputSecondsRef
];

const focusable = ref<HTMLInputElement[]>([]);

watch(
  () => model.value,
  newValue => {
    if (newValue) {
      const obj = dayjs(newValue as unknown as Date);
      modelFormatObject.value!.DD = obj.format('DD');
      modelFormatObject.value!.MM = obj.format('MM');
      modelFormatObject.value!.YYYY = obj.format('YYYY');
      modelFormatObject.value!.HH = obj.format('HH');
      modelFormatObject.value!.mm = obj.format('mm');
      modelFormatObject.value!.ss = obj.format('ss');
    }
  },
  { immediate: true }
);

const props = withDefaults(defineProps<IProps>(), {
  width: 100,
  height: 100,
  widthUnit: '%',
  heightUnit: '%',
  bg: '#fff'
});

const mainElemClick = (e: MouseEvent) => {
  if (!isListenerExist.value) {
    document.addEventListener('keydown', handleKeydown);
    isListenerExist.value = true;
    if (!(e.target as HTMLElement).dataset.input) {
      inputDaysRef.value?.focus();
    } else {
      (e.target as HTMLElement).focus();
    }
    focusable.value = focusableElems
      .filter(item => item.value)
      .map(item => item.value!);
  }
};

const mainElemFocus = (e: Event) => {
  if (!isListenerExist.value) {
    document.addEventListener('keydown', handleKeydown);
    isListenerExist.value = true;
    inputDaysRef.value?.focus();
    focusable.value = focusableElems
      .filter(item => item.value)
      .map(item => item.value!);
  }
};

const inputFocus = (e: FocusEvent) => {};

const inputBlur = (e: FocusEvent) => {
  if (isListenerExist.value && e.relatedTarget === mainElemRef.value) {
    (e.target as HTMLInputElement).focus();
    return;
  }
  if (!mainElemRef.value?.contains(e.relatedTarget)) {
    if (isListenerExist.value) {
      model.value = getValidModel(modelFormatObject.value);
      document.removeEventListener('keydown', handleKeydown);
      isListenerExist.value = false;
      focusable.value = [];
    }
  }
};

const handleKeydown = (e: KeyboardEvent) => {
  if (!mainElemRef.value) return;

  const currentIndex = focusable.value.findIndex(
    el => el === document.activeElement
  );

  if (currentIndex === -1) return;
  let nextIndex = -1;

  switch (e.key) {
    case 'ArrowRight':
      e.preventDefault();
      nextIndex =
        currentIndex + 1 >= focusable.value.length ? 0 : currentIndex + 1;
      break;
    case 'ArrowLeft':
      e.preventDefault();
      nextIndex =
        currentIndex - 1 < 0 ? focusable.value.length - 1 : currentIndex - 1;
      break;
    case 'ArrowUp':
      setNewValueByArrows(focusable.value[currentIndex]!, 'up');
      break;
    case 'ArrowDown':
      setNewValueByArrows(focusable.value[currentIndex]!, 'down');
      break;
    default:
      return;
  }

  if (nextIndex !== -1) {
    focusable.value[nextIndex]!.focus();
  }
};

const setNewValueByArrows = (
  input: HTMLInputElement,
  direction: 'up' | 'down'
) => {
  const subj = input.dataset.input! as inputSubjType;
  const currentValue = input.value;
  const newValue = newValidValue(subj, currentValue, direction);
  input.value = newValue;
  modelFormatObject.value[subj] = newValue;
};

const setNewValueByNums = () => {};

const newValidValue = (
  subj: inputSubjType,
  currentValue: string,
  direction: 'up' | 'down'
) => {
  let newValue = '';
  switch (subj) {
    case 'DD':
      newValue = daysArrowInput(currentValue, direction);
      break;
    case 'MM':
      newValue = monthArrowInput(currentValue, direction);
      break;
    case 'YYYY':
      newValue = yearsArrowInput(currentValue, direction);
      break;
    case 'HH':
      newValue = hoursArrowInput(currentValue, direction);
      break;
    case 'mm':
      newValue = minutesOrSecondsArrowInput(currentValue, direction);
      break;
    case 'ss':
      newValue = minutesOrSecondsArrowInput(currentValue, direction);
      break;
  }
  return newValue;
};

// ---- Логика для DatePicker ----
const dateTimePickref = ref();
const isPickerVisible = ref<boolean>(false);

const onPickerShowToggle = () => {
  if (isPickerVisible.value) {
    dateTimePickref.value.handleClose();
    isPickerVisible.value = false;
  } else {
    dateTimePickref.value.handleOpen();
    isPickerVisible.value = true;
  }
};

const getType = computed<'datetime' | 'date'>(() => {
  switch (props.dateType) {
    case 1:
      return 'datetime';
    case 2:
      return 'date';
    default:
      return 'datetime';
  }
});

const getFormat = computed<string>(() => {
  switch (props.dateType) {
    case 1:
      return 'DD-MM-YYYY HH:mm:ss';
    case 2:
      return 'DD-MM-YYYY';
    default:
      return 'DD-MM-YYYY HH:mm:ss';
  }
});
</script>

<style scoped lang="scss">
@use './lw-datetime.scss' as *;

.lw-date-time {
  position: relative;
  width: v-bind('width + widthUnit');
  height: v-bind('height + heightUnit');
  background-color: v-bind('bg');
  border-radius: 5px;
}
</style>
