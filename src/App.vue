<template>
	<el-date-picker v-model="datetime" type="datetime" placeholder="Select date and time" />
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
		<el-col :span="8" class="col"></el-col>
	</el-row>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import { dayjs } from 'element-plus';

	import LwMaskDateTimePicker from '@/lw-mask-datetime-picker/LwMaskDateTimePicker.vue';

	const datetime = ref<Date>(dayjs().toDate());
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
</style>
