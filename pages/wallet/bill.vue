<template>
	<view class="box">
		<cu-custom :isBack="true" bgColor="bg-gray">
			<block slot="backText"></block>
			<block slot="content">管理</block>
		</cu-custom>
		<view class="detail_box app-selector">
			<view class="detail-content">
				<!-- 选项卡 -->
				<view class="sticky-box">
					<view class="tab-box x-f">
						<view class="tab-item y-f x-c" @tap="onTab(tab.id)" v-for="tab in tabList" :key="tab.id">
							<view class="tab-title">{{ tab.title }}</view>
							<text class="tab-line" :class="{ 'line-active': tabCurrent === tab.id }"></text>
						</view>
					</view>
					<view class="tab-detail margin-top">
						<view class="goods-size" v-if="tabCurrent === 'tab0'">
							<view class="goodes_detail_swiper-box">
								<view class="user-list x-bc">
									<text class="list-name">车牌</text>
									<view class="x-f">
										<input class="list-val" disabled="inputDisabled" @tap="plateShow = true"
											v-model.trim="form.carNumber" placeholder="请输入车牌" />
										<ocr-navigator @onSuccess="platenumSuccess"  certificateType="platenum">
										  <text class="cuIcon-scan icon-size"></text>
										</ocr-navigator>
										<plate-input v-if="plateShow" :plate="form.carNumber" @export="setPlate"
											@close="plateShow = false" />
									</view>
								</view>
								<view class="user-list x-bc">
									<text class="list-name">手机号码</text>
									<view class="x-f">
										<input class="list-val" v-model="form.phoneNumber" placeholder="请输入手机号码" />
										<text class="cuIcon-phone icon-size"></text>
									</view>
								</view>
								<!-- <picker style="width: 750rpx;" :value="form.createDate" mode="time" start="09:01" end="21:01" @change="onTimeChange">
									<view class="user-list x-bc">
										<text class="list-name">日期</text>
										<view class="x-f">
											<text class="list-val">{{ form.createDate }}</text>
											<text class="cuIcon-right"></text>
										</view>
									</view>
								</picker> -->
								<picker style="width: 750rpx;" :value="form.carModel" :range="modelArray"
									@change="onModelChange">
									<view class="user-list x-bc">
										<text class="list-name">车型</text>
										<view class="x-f">
											<text class="list-val">{{ form.carModel || '' }}</text>
											<text class="cuIcon-right icon-size"></text>
										</view>
									</view>
								</picker>
								<view class="user-list x-bc">
									<text class="list-name">美容项目</text>
									<jsfun-picker :listArr="priceList" :defaultArr="form.cosmetologyName"
										type="multiple" ref="jsfun" @click="priceChange"></jsfun-picker>
									<view class="x-f" @tap="showPicker">
										<view class="project-tier">{{ form.cosmetologyName }}</view>
										<text class="cuIcon-right icon-size"></text>
									</view>
								</view>
								<view class="user-list x-bc">
									<text class="list-name">预计费用</text>
									<view class="x-f"><input class="list-val" v-model="form.estimatePrice"
											disabled="true" /></view>
								</view>
								<view class="user-list x-bc">
									<text class="list-name">预计提成</text>
									<view class="x-f"><input class="list-val" v-model="form.projectCommission"
											disabled="true" /></view>
								</view>
							</view>
						</view>
						<view class="rich-box" v-show="tabCurrent === 'tab1'">
							<scroll-view :style="{ height: 950 + 'rpx' }" class="scroll-box" scroll-y enable-back-to-top
								scroll-with-animation @scrolltolower="loadMore">
								<view class="content-box">
									<view class="goods-list">
										<view class="goods-item" v-for="(goods,index) in goodsList" :key="index">
											<fz-circuit-card :detail="goods" :isTag="true"></fz-circuit-card>
										</view>
									</view>
									<!-- 空白页 -->
									<app-empty :isFixed="false" v-if="!goodsList.length" :emptyData="emptyData">
									</app-empty>
								</view>
							</scroll-view>
						</view>
					</view>
				</view>
			</view>
			<!-- 其他商品foot -->
			<view class="detail-foot_box  x-f" v-if="!showSku && !showServe && detailType !== 'score'">
				<view class="left x-f">
					<view class="tools-item y-f">
						累计消费：
						<text class="tool-title app-selector-rect text-blue">￥ {{cumulativeAmount}}</text>
					</view>
					<!-- <view class="tools-item y-f">
						余额：
						<text class="tool-title app-selector-rect text-red">￥ {{balance}}</text>
					</view> -->
				</view>
				<view class="detail-right">
					<view class="detail-btn-box x-ac" v-if="!goodsInfo.activity"><button class="cu-btn tool-btn pay-btn"
							@tap="billSave">立即开单</button></view>
				</view>
			</view>
			<!-- 分享组件 -->
			<!-- 登录提示 -->
			<app-login-modal></app-login-modal>
			<!-- 自定义底部导航 -->
			<app-tabbar></app-tabbar>
			<!-- 连续弹窗提醒 -->
			<app-notice-modal></app-notice-modal>
		</view>
	</view>
</template>
+
<script>
	import fzCircuitCard from '@/components/fz-circuit-card/fz-circuit-minicard.vue';
	import jsfunPicker from '@/components/jsfun-picker/jsfun-picker.vue';
	import plateInput from '@/components/uni-plate-input/uni-plate-input.vue';
	import {
		mapMutations,
		mapActions,
		mapState
	} from 'vuex';
	export default {
		components: {
			plateInput,
			jsfunPicker,
			fzCircuitCard
		},
		data() {
			return {
				priceList: [],
				balance: 0,
				cumulativeAmount: 0,
				detailType: '',
				showServe: false,
				tools: this.$tools,
				goodsInfo: {},
				goodsList: [],
				modelArray: ['五座', 'SUV/商务车'],
				confirmGoodsInfo: {},
				tabCurrent: 'tab0',
				emptyData: {
					img: '/static/imgs/empty/comment_empty.png',
					tip: '暂无消费记录~'
				},
				form: {
					createDate: '',
					carNumber: '',
					cosmetologyName: '',
					cosmetologyId: '',
					phoneNumber: '',
					carModel: '五座',
					estimatePrice: 0,
					projectCommission: 0
				},
				plateNo: '',
				plateShow: false,
				inputDisabled: true,
				tabList: [{
						id: 'tab0',
						title: '开单'
					},
					{
						id: 'tab1',
						title: '消费记录'
					}
				]
			};
		},
		computed: {},
		onLoad() {
			this.form.createDate = this.$tools.getDayList(0, 0).HS;
			this.getProject();
		},
		onUnload(options) {
			let that = this;
			let params = {
				filmId: that.filmId
			};
		},
		onReady() {},
		methods: {
			platenumSuccess(val){
				this.form.carNumber = val.target.number.text;
			},
			photoRecognition() {
				let that = this;
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['camera'], //这要注意，camera掉拍照，album是打开手机相册
					success: res => {
						const tempFilePaths = res.tempFilePaths;
						tempFilePaths.forEach(img => {
							that.$tools.uploadImage('file/imgUpload', img).then(uploadFileRes => {
								that.$api('bill.licensePlateRecognition', {
									url: uploadFileRes
								}).then(reso => {
									if (reso.flag) {
										that.form.carNumber = reso.data.result[0]
											.plate_number;
										that.$api('bill.findOrdersByStatus', {
											carNumber: that.form.carNumber,
											status: '1'
										}).then(rescar => {
											if (rescar.flag) {
												that.goodsList = rescar.data
													.orderCars
												that.form.carModel = rescar
													.data.carModel
												that.form.phoneNumber = rescar
													.data.phoneNumber
												that.form.vipNumber = rescar
													.data.vipNumber
												that.balance = rescar.data
													.balance
												that.cumulativeAmount = rescar
													.data.cumulativeAmount
											}
										});
									}
								});
							});
						});
					}
				});
			},
			showPicker() {
				let that = this;
				that.$nextTick(function() {
					that.$refs.jsfun.showPicker();
				});
			},
			priceChange(data) {
				this.form.cosmetologyName = data.textStr;
				this.form.cosmetologyId = data.valStr;
				this.form.estimatePrice = data.standardPrice;
				this.form.projectCommission = data.commissionPrice;
			},
			// 加载更多
			loadMore() {},
			// 选择日期
			onTimeChange(e) {
				this.form.createDate = e.detail.value;
			},
			// 选择车型
			onModelChange(e) {
				this.form.carModel = this.modelArray[e.detail.value];
			},
			setPlate(plate) {
				if (plate.length >= 7) this.form.carNumber = plate;
				this.$api('bill.findOrdersByStatus', {
					carNumber: this.form.carNumber,
					status: '1'
				}).then(rescar => {
					if (rescar.flag) {
						this.goodsList = rescar.data.orderCars
						console.log(this.goodsList)
						this.form.carModel = rescar.data.carModel
						this.form.phoneNumber = rescar.data.phoneNumber
						this.form.vipNumber = rescar.data.vipNumber
						this.balance = rescar.data.balance
						this.cumulativeAmount = rescar.data.cumulativeAmount
					}
				});
				this.plateShow = false;
			},
			onBack() {
				this.$Router.back();
			},
			// 路由跳转
			jump(path, parmas) {
				this.showShare = false;
				this.$Router.replace({
					path: path,
					query: parmas
				});
			},
			// 选项卡
			onTab(id) {
				this.tabCurrent = id;
			},
			// 商品详情
			getGoodsDetail() {
				let that = this;
				that.$api('cinema.movieMessage', {
					filmId: '051201092021'
				}).then(res => {
					if (res.flag) {
						that.goodsInfo = res.data;
					} else {
						that.$tools.toast(res.msg);
					}
				});
			},
			billSave() {
				let that = this;
				if (!that.form.carNumber) {
					return that.$tools.toast('请录入车牌');
				}
				if (!that.form.cosmetologyName) {
					return that.$tools.toast('请选择项目');
				}
				that.$api('bill.addOrder', that.form).then(res => {
					if (res.flag) {
						that.$tools.toast(res.msg);
					} else {
						that.$tools.toast(res.msg);
					}
				});
				that.$Router.back();
			},
			// 获取项目
			getProject() {
				let that = this;
				that.$api('bill.projectForm', {}).then(res => {
					if (res.flag) {
						that.priceList = res.data;
					}
				});
			}
		}
	};
</script>

<style lang="scss">
	.icon-size {
		font-size: 50rpx !important;
	}

	.project-tier {
		width: 500rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.user-list {
		background: #fff;
		height: 100rpx;
		border-bottom: 1rpx solid #f6f6f6;
		padding: 0 20rpx;

		.list-name {
			font-size: 28rpx;
		}

		.avatar {
			width: 67rpx;
			height: 67rpx;
			border-radius: 50%;
			// background: #ccc;
		}

		.cuIcon-right {
			margin-left: 25rpx;
		}

		.list-val {
			color: #999;
			font-size: 28rpxc;
			text-align: right;
		}
	}

	.box {
		padding-bottom: 100rpx;
	}

	.about-unline {
		padding: 30rpx;
	}

	.load-box {
		/deep/.skeletons_box {
			z-index: 11;
		}
	}

	.detail-content {
		&::-webkit-scrollbar {
			width: 0;
			height: 0;
			color: transparent;
		}
	}

	.sticky-box {
		.tab-box {
			position: -webkit-sticky;
			position: sticky;
			border-bottom: 1px solid #f8f8ff;
			z-index: 99;
		}
	}

	.goods-title {
		font-size: 28rpx;
		font-weight: 500;
		line-height: 42rpx;
		background-color: #fff;
		padding-bottom: 10rpx;
		padding: 10rpx 20rpx;
	}

	.sub-title {
		padding: 0 20rpx;
		color: #a8700d;
		font-size: 24rpx;
		font-weight: 500;
		line-height: 42rpx;
		background-color: #fff;
		padding-bottom: 10rpx;
	}

	// 选项卡
	.tab-box {
		height: 102rpx;
		background: #fff;
		border-bottom: 1rpx solid rgba(#dfdfdf, 0.8);

		.tab-item {
			flex: 1;
			height: 100%;
			position: relative;
			font-size: 30rpx;
			font-weight: bold;

			.tab-line {
				width: 123rpx;
				height: 4rpx;
				left: 50%;
				bottom: 20rpx;
				transform: translateX(-50%);
				background: transparent;
				position: absolute;
				z-index: 2;
			}

			.line-active {
				background: rgba(168, 112, 13, 1);
			}
		}
	}

	.tab-detail {
		min-height: 275rpx;
		background: #fff;
		background: #fff;

		.rich-box {
			/deep/ img {
				display: block;
			}
		}

		.goods-size {
			.table-box {
				width: 710rpx;
				margin: auto;
				background: rgba(255, 255, 255, 1);
				border: 1rpx solid rgba(223, 223, 223, 1);

				.t-tr {
					border-bottom: 1rpx solid rgba(223, 223, 223, 1);

					&:last-child {
						border-bottom: none;
					}

					.t-head {
						font-size: 26rpx;
						color: #999;
						flex: 1;
						padding: 15rpx 20rpx;
						height: 100%;
						border-right: 1rpx solid rgba(223, 223, 223, 1);
					}

					.t-detail {
						font-size: 26rpx;
						flex: 4;
						padding: 15rpx 20rpx;
						height: 100%;
					}
				}
			}
		}
	}

	// 底部工具栏
	.detail-foot_box {
		background: rgba(255, 255, 255, 1);
		border-top: 1rpx solid rgba(238, 238, 238, 1);
		width: 100%;
		position: fixed;
		bottom: 0;
		z-index: 999;

		.left,
		.detail-right {
			flex: 1;
			text-align: center;
		}

		.tools-item {
			flex: 1;

			.tool-img {
				width: 46rpx;
				height: 46rpx;
			}

			.tool-title {
				font-size: 22rpx;
				line-height: 22rpx;
				padding-top: 8rpx;
			}
		}

		.detail-btn-box {
			flex: 1;
			line-height: 100rpx;

			display: inline-block;

			.tool-btn {
				font-size: 28rpx;
				font-weight: 500;
				color: rgba(#fff, 0.9);
				width: 210rpx;
				border-radius: 35rpx;
				padding: 0;

				.price {
					font-size: 24rpx;
					font-weight: bold;
					color: rgba(#fff, 0.9);
				}

				.price-title {
					font-size: 20rpx;
					font-weight: 500;
					color: rgba(#fff, 0.9);
					padding-top: 8rpx;
				}
			}

			.add-btn {
				box-shadow: 0px 2rpx 5rpx 0px rgba(102, 103, 104, 0.46);
				background: linear-gradient(90deg, rgba(103, 104, 105, 1), rgba(82, 82, 82, 1));
			}

			.pay-btn {
				box-shadow: 0px 7rpx 6rpx 0px rgba(229, 138, 0, 0.22);
				background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
			}

			.seckill-btn {
				width: 432rpx;
				height: 70rpx;
				background: linear-gradient(93deg, rgba(208, 19, 37, 1), rgba(237, 60, 48, 1));
				box-shadow: 0px 7rpx 6rpx 0px rgba(#ed3c30, 0.22);
				font-size: 28rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: rgba(255, 255, 255, 1);
				border-radius: 35rpx;
				padding: 0;
				margin-right: 20rpx;
			}

			.seckilled-btn {
				width: 432rpx;
				height: 70rpx;
				background: rgba(221, 221, 221, 1);
				font-size: 28rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: #999999;
				border-radius: 35rpx;
				padding: 0;
				margin-right: 20rpx;
			}

			.groupon-btn {
				width: 210rpx;
				height: 70rpx;
				background: linear-gradient(90deg, rgba(254, 131, 42, 1), rgba(255, 102, 0, 1));
				box-shadow: 0px 7rpx 6rpx 0px rgba(255, 104, 4, 0.22);
				border-radius: 35rpx;
			}
		}
	}
</style>
