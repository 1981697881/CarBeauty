<template>
	<view class="wrap-box">
		<view class="user-box">
			<view class="head_box">
				<block v-if="template.length" v-for="(item, index) in template" :key="index">
					<!-- 个人信息 -->
					<sh-userinfo v-if="item.type === 'user'" :detail="item.content"></sh-userinfo>
				</block>
				<view class="cu-bar search bg-white" style="height: 60upx;">
					<view class="search-form round">
						<text class="cuIcon-search"></text>
						<input :adjust-position="false" type="text" v-model.trim="listParams.phoneNumber"
							placeholder="搜索会员，手机号码" confirm-type="search"></input>
					</view>
					<view class="action">
						<button class="cu-btn bg-green shadow-blur round" @tap="search">搜索</button>
					</view>
				</view>
			</view>
			<uni-fab v-if="!isUse" :pattern="pattern" :horizontal="horizontal" :vertical="vertical" :popMenu="popMenu"
				distable :direction="direction" @fabClick="fabClick"></uni-fab>
			<view class="content_box">
				<scroll-view :style="{ height:  '820rpx' }" class="scroll-box bg-white" scroll-y enable-back-to-top
					scroll-with-animation @scrolltolower="loadMore">
					<view class="goods-list x-f">
						<view class="goods-item" v-for="goods in vipList" @tap="handlerVip(goods)">
							<view class="goods-box">
								<view class="content-box">
									<view class="cont-tier flex flex-wrap justify-between">
										<view class="tier-left">
											<view class="">会员卡号：{{goods.vipNumber}}</view>
											<view class="cent-tip">会员名称：{{goods.vipName}}</view>
											<view class="">充值记录<text class="icon-size"
													:class="goods.queryPackage?'cuIcon-fold':'cuIcon-unfold'"
													@tap.stop="queryPackage(goods)"></text></view>
										</view>
										<view class="tier-center">
											<view class="">手机号码：{{goods.phoneNumber}}</view>
											<view class="">车辆数量：{{goods.vipCarmessageCars.length}}</view>
											<view class="">消费记录<text class="icon-size"
													:class="goods.queryConsumption?'cuIcon-fold':'cuIcon-unfold'"
													@tap.stop="queryConsumption(goods)"></text></view>
										</view>
									</view>
								</view>
								<view class="content-item" v-if="goods.queryPackage">
									<block v-for="(item,index) in goods.rechargeList" :key='index'>
										<view class="cont-tier flex flex-wrap justify-between">
											<view class="tier-left">
												<view class="">({{index+1}}) 充值时间：{{item.createDate}}</view>
												<view class="cent-tip">充值金额：￥{{item.rechargeAmount}}</view>
											</view>
										</view>
									</block>
								</view>
								<view class="content-item" v-if="goods.queryConsumption">
									<block v-for="(item,index) in goods.consumptionList" :key='index'>
										<view class="cont-tier flex flex-wrap justify-between">
											<view class="tier-left">
												<view class="">({{index+1}}) 消费时间：{{item.createDate}}</view>
												<view class="cent-tip">消费项目：{{item.cosmetologyName}}</view>
												<view class="cent-tip">金额：{{item.settlementPrice}}</view>
											</view>
										</view>
									</block>
								</view>
							</view>
						</view>
					</view>
					<!-- 加载更多 -->
					<view v-if="vipList.length" class="cu-load text-gray" :class="loadStatus"></view>
					<!-- load -->
					<app-load v-model="isLoading"></app-load>
				</scroll-view>
			</view>
			<!-- 版本号 -->
			<view class="foot_box">
				<view class="copyright y-f" v-if="info">
					<view class="code1">{{ info.copyright[0] }}</view>
					<view class="code2">{{ info.copyright[1] }} {{ info.version }}</view>
				</view>
			</view>
			<!-- 关注弹窗 -->
			<app-float-btn></app-float-btn>
			<!-- 连续弹窗提醒 -->
			<app-notice-modal></app-notice-modal>
			<!-- 登录提示 -->
			<app-login-modal></app-login-modal>
		</view>
		<!-- 自定义底部导航 -->
		<!-- <app-tabbar></app-tabbar> -->
	</view>
</template>

<script>
	import Wechat from '@/common/wechat/wechat';
	import shUserinfo from './components/sh-userinfo.vue';
	import uniFab from '@/components/uni-fab/uni-fab.vue';
	import appNoticeModal from '@/components/app-notice-modal/app-notice-modal.vue';
	import {
		mapMutations,
		mapActions,
		mapState
	} from 'vuex';
	export default {
		components: {
			shUserinfo,
			uniFab,
			appNoticeModal
		},
		data() {
			return {
				platform: uni.getStorageSync('platform'), //当前平台。
				isRefresh: false, //更新
				scrollTop: 0, //页面滚动距离
				hHeight: 0, //页面滚动距离
				bgcolor: '',
				listParams: {
					phoneNumber: '',
				},
				horizontal: 'right',
				vertical: 'bottom',
				popMenu: false,
				direction: 'horizontal',
				pattern: {
					color: '#7A7E83',
					backgroundColor: '#fff',
					selectedColor: '#FFCCCC',
					buttonColor: '#726930'
				},
				isLoading: false, //loading和空白页。
				loadStatus: '', //loading,over
				lastPage: 1,
				vipList: []
			};
		},
		computed: {
			...mapState({
				initData: state => state.init.initData, //初始化数据
				template: state => state.init.templateData.user, //模板数据
				userInfo: state => state.user.userInfo,
				forceOauth: state => state.user.forceOauth
			}),
			info() {
				if (this.initData) {
					return this.initData.info;
				}
			},
			popupUser() {
				if (this.initData.popup) {
					return this.initData.popup.content.user;
				}
			}
		},
		onPullDownRefresh() {
			this.init();
		},
		onLoad() {},
		onShow() {
			/* this.$store.commit('CART_NUM'); */
			this.init();
			this.getScrHeight();
			this.getVipList();
		},
		methods: {
			...mapActions(['getUserDetails']),
			/* , 'getOrderNum' */
			// 初始化
			init() {
				return Promise.all([this.getUserDetails()]) /* , this.getOrderNum() */
					.then(() => {
						uni.stopPullDownRefresh();
					})
					.catch(() => {
						uni.stopPullDownRefresh();
					});
			},
			queryPackage(item) {
				let that = this;
				if (item.queryPackage) {
					item.queryPackage = false
				} else {
					uni.showLoading({
						title: 'Loading....'
					});
					that.$api('bill.rechargeList', {
						phoneNumber: item.vipNumber
					}).then(res => {
						if (res.flag) {
							item.queryConsumption = false
							item.rechargeList = res.data
							uni.hideLoading();
							if(item.rechargeList.length>0){
								item.queryPackage = true
							}else{
								uni.showToast({
									title: '无充值记录',
									mask: true,
									icon: 'none',
									duration: 1500
								});
							}
						}
					});
					
				}
			},
			queryConsumption(item) {
				let that = this;
				if (item.queryConsumption) {
					item.queryConsumption = false
				} else {
					uni.showLoading({
						title: 'Loading....'
					});
					that.$api('bill.recordHistory', {
						vipNumber: item.vipNumber
					}).then(res => {
						if (res.flag) {
							item.queryPackage = false
							item.consumptionList = res.data
							uni.hideLoading();
							if(item.consumptionList.length>0){
								item.queryConsumption = true
							}else{
								uni.showToast({
									title: '无消费记录',
									mask: true,
									icon: 'none',
									duration: 1500
								});
							}
						}
					});
					
				}
			},
			// 加载更多
			loadMore() {
				if (this.listParams.page < this.lastPage) {
					this.listParams.page += 1;
					this.getVipList();
				}
			},
			handlerVip(goods) {
				let that = this;
				let handlerType = ['充值', '修改充值信息', '修改用户信息']
				uni.showActionSheet({
					itemList: handlerType,
					success: function(res) {
						if (res.tapIndex == 2) {
							that.jump('/pages/user/establish', {
								vipName: goods.vipName,
								vipNumber: goods.vipNumber,
								phoneNumber: goods.phoneNumber,
								handlerType: res.tapIndex,
								vipCarmessageCars: JSON.stringify(goods.vipCarmessageCars),
								id: goods.id
							})
						} else {
							that.jump('/pages/user/wallet/recharge', {
								vipName: goods.vipName,
								vipNumber: goods.vipNumber,
								phoneNumber: goods.phoneNumber,
								handlerType: res.tapIndex,
								vipProjectCars: JSON.stringify(goods.vipProjectCars),
								id: goods.id
							})
						}
					},
					fail: function(res) {
						console.log(res.errMsg);
					}
				});
			},
			search() {
				this.getVipList();
			},
			getVipList() {
				let that = this;
				that.isLoading = true;
				that.loadStatus = 'loading';
				that.$api('bill.selectVipList', this.listParams).then(res => {
					if (res.flag) {
						that.isLoading = false;
						res.data.forEach((item) => {
							item.queryPackage = false;
							item.queryConsumption = false;
							item.rechargeList = [];
							item.consumptionList = [];
						})
						that.vipList = res.data;
						that.lastPage = res.data.last_page;
						if (that.listParams.page < res.data.last_page) {
							that.loadStatus = '';
						} else {
							that.loadStatus = 'over';
						}
					}
				});
			},
			getScrHeight() {
				let me = this;
				uni.getSystemInfo({
					success: function(res) {
						// res - 各种参数
						let info = uni.createSelectorQuery().select('.head_box');
						info.boundingClientRect(function(data) {
							//data - 各种参数
							me.hHeight = res.windowHeight - data.height - 20;
						}).exec();
					}
				});
			},
			jump(path, query) {
				this.$Router.push({
					path: path,
					query: query
				});
			},
			//新建会员
			fabClick() {
				this.jump('/pages/user/establish', {})
			},
			getbgcolor(e) {
				this.bgcolor = e;
			}
		}
	};
</script>

<style lang="scss">
	.goods-list {
		flex-wrap: wrap;
		.goods-item {
			width: 100%;
		}
	}

	.content-item {
		width: 100%;
		max-height: 200rpx;
		overflow-y: auto;
		transition: max-height .3s;
		padding: 20rpx 30rpx 20rpx 30rpx;
	}
	.content-itemt {
		width: 100%;
		max-height: 0;
		transition: max-height .3s;
		padding: 0 30rpx 00rpx 30rpx;
	}
	.item-click {
		min-height: 200rpx;
		overflow-y: auto;
		padding-top: 20rpx;
		padding-bottom: 20rpx;
	}
	.item-clickt {
		min-height: 200rpx;
		overflow-y: auto;
		padding-top: 20rpx;
		padding-bottom: 20rpx;
	}
	.goods-box {
		width: 700rpx;
		margin-top: 20rpx;
		background: linear-gradient(90deg, rgba(13, 120, 97, 1), rgba(138, 14, 137, 0.5), rgba(200, 170, 10, 0.7));
		margin-left: 28rpx;
		color: white;
		border-radius: 10rpx 10rpx 0 0;
		overflow: hidden;

		.content-box {
			width: 100%;
			height: auto;
			overflow: hidden;
			position: relative;
			padding: 30rpx;
			border-bottom: 1rpx solid white;
			.cont-tier {
				.tier-left {}

				.tier-center {
					text-align: left;

					.cent-tip {
						border-radius: 0 30rpx 30rpx 25rpx;
						padding: 3rpx;
						padding-left: 15rpx
					}
				}
			}

			.tag-star {
				position: absolute;
				right: 0;
				top: 0;
				z-index: 2;
				width: 0;
				height: 0;
				border-top: 60upx solid #ffe4b5;
				border-left: 60upx solid transparent;

				text {
					top: -55upx;
					left: -32upx;
					position: absolute;
					z-index: 999;
					display: inline-block;
				}
			}
		}

		.min-goods {
			clear: both;
			width: 190rpx;
			margin: 20rpx;
			height: 130rpx;
			background: #F8F8FF;
			box-shadow: 0px 1px 1px 0px #ccc;
			line-height: 35rpx;
			margin-top: 0;
			border-radius: 10rpx;

			.price-box {
				width: 100%;
				margin-top: 10rpx;
				padding-left: 10rpx;

				.y-f {
					.seckill-current {
						width: 100%;
						padding-top: 5rpx;
						font-family: PingFang SC;
					}

					.seckill-lau {
						width: 100%;
						padding-top: 5rpx;
						margin-left: -18rpx;
						-webkit-transform: scale(0.9);
						font-family: PingFang SC;
					}

					.original {
						width: 100%;
						margin-left: -18rpx;
						-webkit-transform: scale(0.9);
						padding-top: 5rpx;
						font-family: PingFang SC;
					}

					.cr_name {
						font-size: 20rpx;
					}
				}
			}

			.tagb text {
				font-size: 22rpx;
				font-weight: bold;
			}

			.title {
				font-size: 26rpx;
			}
		}
	}

	.user-box {
		overflow-x: hidden;
		position: relative;
		overflow-y: auto;
		// height: 100%;
	}

	// 微信登录蒙层
	.login-box {
		position: fixed;
		z-index: 9999;
		width: 100%;
		height: 100%;
		background: none;
	}

	// 顶部
	.transtion-head {
		height: 120rpx;
		background: #fff;
		width: 100%;
		position: fixed;
		top: 0;
		z-index: 99;
		transition: all 0.2s linear;
		transform: translateY(-120rpx);
		border-bottom: 1rpx solid #f2f2f2;
	}

	.transtion-head--active {
		height: 120rpx;
		background: #fff;
		width: 100%;
		position: fixed;
		top: 0;
		z-index: 99;
		transition: all 0.2s linear;
		transform: translateY(0rpx);
		border-bottom: 1rpx solid #f2f2f2;
	}

	.foot_box {
		padding-top: 0rpx;
	}

	.copyright {
		color: #999;

		.code1 {
			font-size: 24rpx;
		}

		.code2 {
			font-size: 20rpx;
			margin-top: 10rpx;
		}
	}
</style>
