<template>
	<view class="page_box">
		<view class="head_box margin-top">
			<view class="cu-form-group text-xl text-bold text-brown">用户：{{orderDetail.vipName || ''}}</view>
			<view class="cu-form-group">手机号码：{{ orderDetail.phoneNumber || "" }}</view>
			<view class="pay-box">
				<label class="x-bc pay-item">
					<view class="x-f">
						<image class="pay-img" src="https://i.postimg.cc/QdN88nNq/wallet-pay.png" mode=""></image>
						<text>金额</text>
					</view>
					<input type="number" class="price-input text-right" v-model.trim="rechargeAmount" placeholder="请输入金额"/>
				</label>
			</view>
			<view class="cu-form-group text-bold" style="border-bottom: 1rpx solid #eeeeee;">充值套餐：</view>
		</view>
		<scroll-view :style="{ height: hHeight + 'px' }" class="scroll-box bg-white" scroll-y enable-back-to-top
			scroll-with-animation>
			<view class="content_box">
				<view class="y-f money-box">
					<view style="clear: both;width: 100%;border-bottom: 1rpx solid #eeeeee;" v-for="(item, index) in setMeal" :key="index"
						class="grid text-left col-2 padding">
						<view>项目：<text class="text-orange">{{item.cosmetologyProject}}</text></view>
						<view class="text-grey"><input type="number" class="price-input text-right" v-model.trim="item.frequency" placeholder="项目次数"/></view>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="foot_box">
			<view class="x-c">
				<button class="cu-btn pay-btn bg-cyan" :disabled="isSubOrder" @tap="confirmPay">确认充值
					￥{{ rechargeAmount }}</button>
			</view>
		</view>
		<!-- 登录提示 -->
		<app-login-modal></app-login-modal>
	</view>
</template>

<script>
	import AppPay from '@/common/app-pay';
	import {
		mapMutations,
		mapActions,
		mapState
	} from 'vuex';
	let timer;
	export default {
		components: {},
		data() {
			return {
				setMeal: [],
				isSubOrder: false,
				payType: 'wechat',
				options: {},
				hHeight: 0,
				rechargeAmount: '',
				orderDetail: {},
				isAndroid: uni.getStorageSync('isAndroid'),
				platform: uni.getStorageSync('platform')
			};
		},
		computed: {
			...mapState({
				payment: state => state.init.initData.payment,
				userInfo: state => state.user.userInfo
			})
		},
		onLoad(options) {
			this.options = options;
			if (this.$Route.query) {
				this.orderDetail = this.$Route.query
			}
			if (options.openid) {
				//检测到回传openid
				uni.setStorageSync('openid', options.openid);
			}
			// #ifdef H5
			if (uni.getStorageSync('platform') === 'wxOfficialAccount' && uni.getSystemInfoSync().platform === 'ios' && !
				uni.getStorageSync('payReload')) {
				//检测到IOS支付路径问题
				uni.setStorageSync('payReload', true);
				window.location.reload();
				throw 'stop';
			}
			uni.removeStorageSync('payReload');
			// #endif
			this.getProject();
		},
		onShow() {},
		onHide() {
			clearInterval(timer);
		},
		methods: {
			...mapActions(['getUserBalance']),
			getScrHeight() {
				let me = this;
				uni.getSystemInfo({
					success: function(res) {
						// res - 各种参数
						let info = uni.createSelectorQuery().select('.head_box');
						info.boundingClientRect(function(data) {
							//data - 各种参数
							me.hHeight = res.windowHeight - data.height;
						}).exec();
					}
				});
			},
			checkMoney(e) {
				if (this.checkItem == e.target.dataset.target) {
					return
				} else {
					this.checkItem = e.target.dataset.target
					this.checkPrice = e.target.dataset.price
				}
			},
			// 获取项目
			getProject() {
				let that = this;
				that.$api('bill.projectForm', {}).then(res => {
					if (res.flag) {
						res.data.forEach((item)=>{
							item.frequency = 0;
						})
						that.setMeal = res.data;
					}
				});
			},
			// 发起支付
			confirmPay() {
				let that = this;
				if (that.rechargeAmount) {
					let number = 0
					that.setMeal.forEach((item)=>{
						if(item.frequency>0){
							number++
						}
					})
					if(number > 0){
						this.$api('bill.increaseRecharge', {
							custId: this.balInfo.custId,
							qty: that.checkPrice,
							placeId: that.storeInfo.v8PlaceId,
							V8Url: that.storeInfo.v8Url,
							storeId: that.storeInfo.id,
							phoneNumber: this.userInfo.phoneNumber,
						}).then(res => {
							if (res.flag) {
								uni.showToast({
									icon: 'none',
									title: res.msg
								})
								that.isSubOrder = false
								that.getUserBalance()
								/* that.jump('/pages/index/wallet', res.data); */
							} else {
								uni.showToast({
									icon: 'none',
									title: res.msg
								})
							}
						});
					}else{
						uni.showToast({
							icon: 'none',
							title: '请输入项目次数'
						})
					}
				} else {
					uni.showToast({
						icon: 'none',
						title: '请输入金额'
					})
				}
			},
		}
	};
</script>

<style lang="scss">
	.head_box {
		background: #fff;
	}

	.notice {
		margin-top: 20rpx;
		background: #fff;
		padding: 0 25rpx;
		display: inline-block;

		.notice-title {
			height: 80rpx;
			line-height: 80rpx;
			font-size: 35rpx;
			font-weight: bold;
			border-bottom: 1px solid #eeeed1;
		}

		.notice-detail {
			padding-top: 10rpx;

			view {
				line-height: 50rpx;
			}
		}
	}

	.money-box {
		background: #fff;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-items: flex-start;
		align-content: flex-start;
		.money {
			text-align: center;
			width: 220rpx;
			padding: 0 !important;
			margin: 15rpx;
			height: 120rpx;
			box-shadow: 1px 1px 1px 1px #a5a5a5;
			border-radius: 15rpx;
			line-height: 120rpx;
			color: #778899;
			background: #f8f8ff;
			font-size: 55rpx;

			&::before {
				content: '￥';
				font-size: 46rpx;
			}
		}

		.moneyAct {
			color: #e1212b;
			box-shadow: 1px 1px 1px 1px;
			background-color: #faf0e6;
		}
	}

	.pay-box {
		.pay-item {
			padding: 1rpx 30rpx;
			min-height: 100rpx;
			width: 750rpx;
			border-top: 1rpx solid #eeeeee;
			border-bottom: 1rpx solid #eeeeee;

			.pay-radio {
				transform: scale(0.8);
			}

			.pay-img {
				width: 40rpx;
				height: 40rpx;
				// background: #ccc;
				margin-right: 25rpx;
			}

			.price-input {
				border-radius: 5px;
			}
		}
	}

	.pay-btn {
		width: 690rpx;
		height: 80rpx;
		border-radius: 40rpx;
		box-shadow: 1px 1px 1px 1px #cce6ff;
	}
</style>
