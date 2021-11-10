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
						<input :adjust-position="false" type="text" v-model.trim="listParams.phoneNumber"  placeholder="搜索"
							confirm-type="search"></input>
					</view>
					<view class="action">
						<button class="cu-btn bg-green shadow-blur round" @tap="search">搜索</button>
					</view>
				</view>
			</view>
			<view class="content_box">
				<scroll-view :style="{ height: hHeight + 'px' }" class="scroll-box bg-white" scroll-y enable-back-to-top
					scroll-with-animation @scrolltolower="loadMore">
					<view class="content-box">
						<view class="goods-list x-f">
							<view class="goods-item" v-for="goods in vipList" @tap="
									jump('/pages/user/wallet/recharge', {
										vipName: goods.vipName,
										phoneNumber: goods.phoneNumber,
										carModel: goods.carModel,
										carNumber: goods.carNumber,
										id: goods.id
									})
								">
								<view class="goods-box">
									<view class="content-box">
										<view class="cont-tier flex flex-wrap justify-between">
											<view class="tier-left">
												<view class="">会员名称：{{goods.vipName}}</view>
												<view class="cent-tip">会员手机：{{goods.phoneNumber}}</view>
											</view>
											<view class="tier-center">
												<view class="">车型：{{goods.carModel}}</view>
												<view class="cent-tip">车牌号：{{goods.carNumber}}</view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
						<!-- 加载更多 -->
						<view v-if="vipList.length" class="cu-load text-gray" :class="loadStatus"></view>
						<!-- load -->
						<app-load v-model="isLoading"></app-load>
					</view>
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
	import appNoticeModal from '@/components/app-notice-modal/app-notice-modal.vue';
	import {
		mapMutations,
		mapActions,
		mapState
	} from 'vuex';
	export default {
		components: {
			shUserinfo,
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
			// 加载更多
			loadMore() {
				if (this.listParams.page < this.lastPage) {
					this.listParams.page += 1;
					this.getVipList();
				}
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
	.goods-box {
		width: 700rpx;
		margin-top: 20rpx;
		margin-left: 28rpx;
		background-color: #C0C4CC;
		color: white;
		border-radius: 10rpx;
		overflow: hidden;

		.content-box {
			width: 100%;
			height: auto;
			overflow: hidden;
			position: relative;
			padding: 30rpx;

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
