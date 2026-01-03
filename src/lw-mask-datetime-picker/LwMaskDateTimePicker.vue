<template>
	<div class="lw-dt-picker">
		<el-input
			v-model="inputDateStr"
			ref="inputDateRef"
			:class="{ 'lw-dt-picker__input': true, 'is-invalid': !isValid }"
			@blur="handleBlur"
			@keyup.enter="handleBlur"
			@focus="handleFocus"
		/>
		<el-icon class="lw-dt-picker__icon" @click="onPickerShowToggle"><Calendar /></el-icon>
		<el-date-picker
			v-model="dateValue"
			ref="dateTimePickre"
			class="lw-dt-picker__hidden"
			type="datetime"
			:format="props.format"
		/>
	</div>
</template>

<script setup lang="ts">
	import { computed, nextTick, onMounted, ref, watch } from 'vue';
	import { dayjs } from 'element-plus';
	import customParseFormat from 'dayjs/plugin/customParseFormat';
	import utc from 'dayjs/plugin/utc';
	import IMask from 'imask';
	import type { InputMask } from 'imask';

	dayjs.extend(customParseFormat);
	dayjs.extend(utc);

	// Преобразование Date в строку для отображения
	const formatDateToString = (date: Date): string => {
		if (!date) return '';
		const d = dayjs(date);
		if (!d.isValid()) return '';
		// Используем ваш формат для согласованности
		return d.format('DD-MM-YYYY HH:mm:ss');
	};

	// Обратная функция - преобразование строки в Date
	const parseStringToDate = (dateString: string): Date | null => {
		if (!dateString) return null;
		const d = dayjs(dateString, 'DD-MM-YYYY HH:mm:ss', true); // strict mode
		if (!d.isValid()) return null;
		return d.toDate();
	};

	interface IProps {
		modelValue: Date | null;
		format: string;
		width?: number;
		height?: number;
		widthUnit?: '%' | 'px';
		heightUnit?: '%' | 'px';
	}

	const props = withDefaults(defineProps<IProps>(), {
		width: 100,
		height: 100,
		widthUnit: '%',
		heightUnit: '%',
	});

	const emit = defineEmits<{
		'update:modelValue': [type: Date | null];
	}>();

	// v-model для datetime-piker
	const dateValue = computed({
		get: () => props.modelValue,
		set: (value: Date | null) => emit('update:modelValue', value),
	});

	// v-model для input
	const inputDateStr = ref<string>('');
	const inputDateRef = ref();
	let mask: InputMask | null = null;
	const isValid = ref(true);

	const createMask = (inputElement: HTMLInputElement) => {
		return IMask(inputElement, {
			mask: 'd`-m`-Y` H`:M`:S`',
			lazy: false,
			placeholderChar: ' ',
			overwrite: true,
			blocks: {
				d: { mask: IMask.MaskedRange, from: 1, to: 31, maxLength: 2 },
				m: { mask: IMask.MaskedRange, from: 1, to: 12, maxLength: 2 },
				Y: { mask: IMask.MaskedRange, from: 1900, to: 2100, maxLength: 4 },
				H: { mask: IMask.MaskedRange, from: 0, to: 23, maxLength: 2 },
				M: { mask: IMask.MaskedRange, from: 0, to: 59, maxLength: 2 },
				S: { mask: IMask.MaskedRange, from: 0, to: 59, maxLength: 2 },
			},
			autofix: true,
		});
	};

	onMounted(() => {
		nextTick(() => {
			const input = inputDateRef.value?.$el?.querySelector('input');
			if (input) {
				mask = createMask(input);
				updateDisplayValue(props.modelValue);

				mask.on('accept', () => {
					// Обновляем ref, чтобы Vue перерисовал input
					inputDateStr.value = mask!.value;
				});

				mask.on('complete', () => {
					// Выполняем валидацию и emit только когда маска полностью заполнена
					validateAndEmit();
				});
			}
		});
	});

	const validateAndEmit = () => {
		const date = parseStringToDate(mask!.value);
		if (date) {
			isValid.value = true;
			// Сравниваем, чтобы избежать лишних emit
			if (props.modelValue?.getTime() !== date.getTime()) {
				emit('update:modelValue', date);
			}
		} else {
			isValid.value = false;
			// Если значение невалидно, можно отправить null
			if (props.modelValue !== null) {
				emit('update:modelValue', null);
			}
		}
	};

	const updateDisplayValue = (value: Date | null) => {
		const formatted = value ? formatDateToString(value) : '';
		inputDateStr.value = formatted;
		if (mask) {
			mask.value = formatted;
		}
		// При программной установке значение всегда считаем валидным
		isValid.value = true;
	};

	const handleBlur = () => {
		// При потере фокуса проверяем, заполнена ли маска
		if (!mask?.masked.isComplete && mask?.value) {
			// Если маска не заполнена, но есть значение - она невалидна
			isValid.value = false;
			if (props.modelValue !== null) {
				emit('update:modelValue', null);
			}
		} else if (mask?.masked.isComplete) {
			// Если заполнена, валидируем
			validateAndEmit();
		} else {
			// Если пустая, то это валидное состояние (нет даты)
			isValid.value = true;
			if (props.modelValue !== null) {
				emit('update:modelValue', null);
			}
		}
	};

	const handleFocus = () => {
		nextTick(() => {
			inputDateRef.value?.$el?.querySelector('input')?.select();
		});
	};

	// Следим только за внешними изменениями modelValue
	watch(
		() => props.modelValue,
		(newValue) => {
			// Обновляем маску только если внешнее значение не совпадает с текущим в маске
			const maskDate = parseStringToDate(mask?.value || '');
			if (newValue?.getTime() !== maskDate?.getTime()) {
				updateDisplayValue(newValue);
			}
		}
	);

	// ---- Логика для DatePicker ----
	const dateTimePickre = ref();
	const isPickerVisible = ref<boolean>(false);

	const onPickerShowToggle = () => {
		if (isPickerVisible.value) {
			dateTimePickre.value.handleClose();
			isPickerVisible.value = false;
		} else {
			dateTimePickre.value.handleOpen();
			isPickerVisible.value = true;
		}
	};
</script>

<style scoped lang="scss">
	.lw-dt-picker {
		position: relative;
		width: v-bind('width + widthUnit');
		height: v-bind('height + heightUnit');
		background-color: darkcyan;
		border-radius: 5px;
		&__icon {
			z-index: 100;
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			right: 15px;
		}
		&__hidden {
			visibility: hidden !important;
		}
	}

	:deep(.el-input.lw-dt-picker__input) {
		width: 100% !important;
		height: 100% !important;
	}

	// стили input для отображения и ввода по маске
	:deep(.el-input.lw-dt-picker__input .el-input__wrapper .el-input__inner) {
		padding: 0 40px 0 0;
	}

	:deep(.el-input.lw-dt-picker__hidden) {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translateX(-50%), translateY(-50%);
		min-width: 0;
		min-height: 0;
		width: 5px !important;
		height: 50% !important;
		visibility: hidden !important;
	}

	.is-invalid {
		:deep(.el-input__wrapper) {
			box-shadow: 0 0 0 1px var(--el-color-error) inset;
		}
	}
</style>
