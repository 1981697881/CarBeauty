<template>
	<view v-if="isShowModal">
		<view class="masking" v-if="showMasking" :style="{ 'background-color': bgColor }"></view>
		<view class="model-wraper">
			<view class="modal-title" v-if="modalTitle !== ''">{{ modalTitle }}</view>
			<view class="modal-body">
				<input type="number" v-model="inputSerialNum"
					style="padding-left: 10rpx;font-size: 30rpx;border: 1rpx solid rgba(0, 0, 0, 0.1);"
					class="uni-input margin-bottom" focus placeholder="价格" />
				<ld-select :multiple="true" :list="detail" label-key="name" value-key="name" placeholder="操作人员"
					clearable v-model="value" @change="selectChange"></ld-select>
				<picker class="picker-size" mode="selector" :value="payType" range-key="platformName" :range="platformsList"
					@change="onModelChange">
					<view class="user-list x-bc">
						<text class="list-name">付款方式:</text>
						<view class="x-f">
							<text class="list-val">{{ payType || '' }}</text>
							<text class="cuIcon-right icon-size"></text>
						</view>
					</view>
				</picker>
				<block v-if="type == 0">
					<view class="cu-form-group text-bold" style="border-bottom: 1rpx solid #eeeeee;">可抵扣：</view>
					<view class="content_box">
						<view class="y-f money-box">
							<view style="clear: both;width: 100%;border-bottom: 1rpx solid #eeeeee;"
								v-for="(item, index) in projectList" :key="index" v-if="item.projectCount > 0"
								class="grid text-left col-2 padding-sm">
								<view>项目：<text class="text-orange">{{item.cosmetologyProject}}</text></view>
								<view class="text-grey text-right">{{item.projectCount}}</view>
							</view>
						</view>
					</view>
					<view class="cu-form-group text-bold" style="border-bottom: 1rpx solid #eeeeee;">不可抵扣：</view>
					<view class="content_box">
						<view class="y-f money-box">
							<view style="clear: both;width: 100%;border-bottom: 1rpx solid #eeeeee;"
								v-for="(item, index) in projectList" :key="index" v-if="item.projectCount == null"
								class="grid text-left col-1 padding-sm">
								<view>项目：<text class="text-orange">{{item.cosmetologyProject}}</text></view>
							</view>
						</view>
					</view>
				</block>
			</view>
			<view>
				<view class="btn cancel" :style="{ color: cancelTextColor }" @click="handleCancel">{{ cancelText }}
				</view>
				<view class="btn confirm" :style="{ color: confirmTextColor }" @click="handleConfirm">{{ confirmText }}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import ldSelect from '@/components/ld-select/ld-select.vue';
	export default {
		components: {
			ldSelect
		},
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
			},
			detail: {
				type: Array,
				default: []
			},
			platformsList: {
				type: Array,
				default: []
			},
		},
		data() {
			return {
				isShowModal: false,
				inputSerialNum: '',
				type: null,
				payType: '',
				projectList: [],
				value: []
			};
		},
		methods: {
			// 选择车型
			onModelChange(e) {
				this.payType = this.platformsList[e.detail.value].platformName;
				if (this.payType == '抵扣') {
					this.getDeduction(this.val, this.vipNumber);
					this.type = 0
				} else {
					this.type = 1
				}
			},
			selectChange(val) {
				this.value = val;
			},
			showModal(val, vipNumber) {
				this.val = val;
				this.vipNumber = vipNumber;
				this.isShowModal = true;
				this.inputSerialNum = '';
				this.value = [];
			},
			handleCancel() {
				this.isShowModal = false;
				this.$emit('onClickCancel', 'cancel');
			},
			getDeduction(val, vipNumber) {
				let that = this;
				that.$api('bill.selectRecharge', {
					vipNumber: vipNumber,
					projectIds: val.split(',')
				}).then(res => {
					if (res.flag) {
						that.projectList = res.data
					}
				});
			},
			handleConfirm() {
				if (this.inputSerialNum.replace(/(^s*)|(s*$)/g, "").length > 0 && this.value.length > 0) {
					this.isShowModal = false;
					this.$emit('onClickConfirm', {
						price: this.inputSerialNum,
						user: this.value,
						orderDeductionCars: this.projectList,
						payType: this.payType
					});
				} else {
					this.$tools.toast('价格和操作人员不能为空');
				}
			}
		}
	};
</script>

<style scoped>
	.picker-size {
		padding: 10rpx;
		margin-top: 20rpx;
		border: 0.5px solid rgba(0, 0, 0, 0.1);
	}
	.cu-form-group {
		padding: 1rpx 20rpx;
	}

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
		top: 20%;
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
