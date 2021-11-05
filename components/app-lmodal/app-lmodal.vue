<template>
	<view v-if="isShowModal">
		<view class="masking" v-if="showMasking" :style="{ 'background-color': bgColor }"></view>
		<view class="model-wraper">
			<view class="modal-title" v-if="modalTitle !== ''">{{ modalTitle }}</view>
			<view class="modal-body">
				<input type="number" v-model="inputSerialNum" style="padding-left: 10rpx;font-size: 30rpx;border: 1rpx solid rgba(0, 0, 0, 0.1);" class="uni-input margin-bottom" focus placeholder="价格" />
				<ld-select :multiple="true" :list="options" label-key="label" value-key="value" placeholder="操作人员" clearable v-model="value2" @change="selectChange2"></ld-select>
			</view>
			<view>
				<view class="btn cancel" :style="{ color: cancelTextColor }" @click="handleCancel">{{ cancelText }}</view>
				<view class="btn confirm" :style="{ color: confirmTextColor }" @click="handleConfirm">{{ confirmText }}</view>
			</view>
		</view>
	</view>
</template>

<script>
import ldSelect from '@/components/ld-select/ld-select.vue';
export default {
	components: { ldSelect },
	props: {
		// 是否显示蒙层
		showMasking: {
			type: Boolean,
			default: true
		},
		// 蒙层背景色
		bgColor: {
			type: String,
			default: 'rgba(0,0,0,.6)'
		},
		// 模态框标题
		modalTitle: {
			type: String,
			default: ''
		},
		// 取消按钮文字
		cancelText: {
			type: String,
			default: '取消'
		},
		// 确定按钮文字
		confirmText: {
			type: String,
			default: '确定'
		},
		// 取消按钮文字颜色
		cancelTextColor: {
			type: String,
			default: '#666'
		},
		// 确定按钮文字颜色
		confirmTextColor: {
			type: String,
			default: '#5999FF'
		}
	},
	data() {
		return {
			isShowModal: false,
			inputSerialNum: '',
			options: [
				{
					value: '选项1',
					label: '黄金糕'
				},
				{
					value: '选项2',
					label: '双皮奶'
				},
				{
					value: '选项3',
					label: '蚵仔煎'
				},
				{
					value: '选项4',
					label: '龙须面'
				},
				{
					value: '选项5',
					label: '北京烤鸭'
				}
			],
			value2: []
		};
	},
	methods: {
		selectChange2(val) {
			this.value2 = val;
		},
		showModal() {
			this.isShowModal = true;
		},
		handleCancel() {
			this.isShowModal = false;
			this.$emit('onClickCancel', 'cancel');
		},
		handleConfirm() {
			if (this.inputSerialNum.replace(/(^s*)|(s*$)/g, "").length >0 && this.value2.length>0) {
				this.isShowModal = false; 
				this.$emit('onClickConfirm', {price: this.inputSerialNum,user: this.value2});
			} else {
				this.$tools.toast('价格和操作人员不能为空');
			}
		}
	}
};
</script>

<style scoped>
.masking {
	height: 100vh;
	width: 100vw;
	position: fixed;
	top: 0;
	left: 0;
	z-index: 999;
}

.model-wraper {
	width: 600rpx;
	background-color: #fff;
	border-radius: 16rpx;
	position: absolute;
	z-index: 1000;
	top: 50%;
	left: 50%;
	margin-top: -161rpx;
	margin-left: -300rpx;
	box-shadow: #dcdcdc 0px 0px 20rpx;
}

.modal-title {
	height: 90rpx;
	line-height: 90rpx;
	width: 100%;
	text-align: center;
	font-size: 32rpx;
	color: #666;
}

.modal-body {
	padding: 30rpx 30rpx 80rpx 30rpx;
}

.btn {
	width: 300rpx;
	height: 90rpx;
	text-align: center;
	line-height: 90rpx;
	font-size: 32rpx;
	float: left;
	border-top: 1rpx solid #ddd;
}

.btn.cancel {
	width: 299rpx;
	border-right: 1rpx solid #dcdcdc;
}
</style>
