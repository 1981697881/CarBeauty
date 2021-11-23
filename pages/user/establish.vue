<template>
	<view class="box">
		<view class="detail_box app-selector">
			<view class="detail-content">
				<view class="goods-size">
					<view class="goodes_detail_swiper-box">
						<view class="user-list x-bc">
							<text class="list-name">会员号</text>
							<view class="x-f">
								<input class="list-val" v-model="form.vipNumber" placeholder="请输入会员号" />
								<text class="cuIcon-card icon-size"></text>
							</view>
						</view>
						<view class="user-list x-bc">
							<text class="list-name">名称</text>
							<view class="x-f">
								<input class="list-val" v-model="form.vipName" placeholder="请输入会员名称" />
								<text class="cuIcon-profile icon-size"></text>
							</view>
						</view>
						<view class="user-list x-bc">
							<text class="list-name">手机号码</text>
							<view class="x-f">
								<input class="list-val" v-model="form.phoneNumber" placeholder="请输入手机号码" />
								<text class="cuIcon-phone icon-size"></text>
							</view>
						</view>
						<!-- 分页器start -->
						<cell-box style="margin-top: 30rpx;" v-if="form.vipCarmessageCars.length>0">
							<template slot="value">
								<view class="flex align-center">
									<uni-icons class="flex-sub text-center" type="arrowleft"
										@click="handlePageChange('prev', 'currentPage', form.vipCarmessageCars.length)">
									</uni-icons>
									<text class="">{{ currentPage + 1 }}/{{ form.vipCarmessageCars.length }}</text>
									<uni-icons class="flex-sub text-center" type="arrowright"
										@click="handlePageChange('next', 'currentPage', form.vipCarmessageCars.length)">
									</uni-icons>
								</view>
							</template>
						</cell-box>
						<!-- 分页器end -->
						<block v-for="(item, index) in form.vipCarmessageCars" :key="index" v-if="currentPage == index">
							<!-- 列表start -->
							<view class="user-list x-bc">
								<text class="list-name">车牌</text>
								<view class="x-f">
									<input class="list-val" disabled="inputDisabled" @tap="plateShow = true"
										v-model.trim="item.carNumber" placeholder="请输入会员车牌" />
									<text class="cuIcon-scan icon-size" @tap="photoRecognition"></text>
									<plate-input v-if="plateShow" :plate="item.carNumber"
										@export="setPlate($event,item)" @close="plateShow = false" />
								</view>
							</view>
							<picker style="width: 750rpx;" :value="item.carModel" :range="modelArray"
								@change="onModelChange(item)">
								<view class="user-list x-bc">
									<text class="list-name">车型</text>
									<view class="x-f">
										<text class="list-val">{{ item.carModel || '' }}</text>
										<text class="cuIcon-right icon-size"></text>
									</view>
								</view>
							</picker>
							<view class="user-list x-bc">
								<text class="list-name">操作</text>
								<view class="x-f">
									<button class="cu-btn round line-red shadow"
										@tap="delItem(index,item)">移除当前行</button>
								</view>
							</view>
							<!-- 列表end -->
						</block>
					</view>
				</view>
			</view>
			<!-- foot -->
			<view class="detail-foot_box  x-f">
					<view class="detail-btn-box x-ac"><button class="cu-btn round  bg-cyan"
							@tap="add">添加车辆</button></view>
					<view class="detail-btn-box x-ac"><button class="cu-btn round  bg-orange"
							@tap="billSave">保存信息</button></view>
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
	import plateInput from '@/components/uni-plate-input/uni-plate-input.vue';
	import cellBox from './children/cell-box';
	import {
		mapMutations,
		mapActions,
		mapState
	} from 'vuex';
	export default {
		components: {
			plateInput,
			cellBox
		},
		data() {
			return {
				priceList: [],
				balance: 0,
				cumulativeAmount: 0,
				currentPage: 0,
				detailType: '',
				showServe: false,
				tools: this.$tools,
				goodsInfo: {},
				goodsList: [],
				modelArray: ['五座', 'SUV/商务车'],
				confirmGoodsInfo: {},
				form: {
					vipName: '',
					vipNumber: '',
					phoneNumber: '',
					vipCarmessageCars: []
				},
				plateNo: '',
				plateShow: false,
				inputDisabled: true,
			};
		},
		computed: {},
		onLoad() {
			if(this.$Route.query.vipCarmessageCars){
				console.log(123)
				this.form = this.$Route.query
				this.form.vipCarmessageCars = JSON.parse(this.form.vipCarmessageCars)
			}
			this.getProject();
		},
		onUnload(options) {

		},
		onReady() {},
		methods: {
			// 追加
			add() {
				if(this.form.vipNumber){
					this.form.vipCarmessageCars.push({
						carModel: '五座',
						carNumber: '',
						vipNumber: this.form.vipNumber
					})
					this.currentPage = this.form.vipCarmessageCars.length - 1
				}else{
					return this.$tools.toast('请输入会员号');
				}
			},
			delItem(index, item) {
				let that = this;
				uni.showModal({
					title: '温馨提示',
					content: '是否删除，' + item.carNumber,
					success: function(res) {
						if (res.confirm) {
							that.form.vipCarmessageCars.splice(index, 1);
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			// 监听切换页
			/**
			 * @param {Object} action 上一页/下一页
			 */
			handlePageChange(action, pageKey = 'currentPage', maxPage) {
				console.log(pageKey)
				let page = this[pageKey];
				if (action === 'prev') {
					// 上一页
					this[pageKey] = page > 0 ? page - 1 : page;
				} else if (action === 'next') {
					// 下一页 
					this[pageKey] = page < maxPage - 1 ? page + 1 : page;
				}
				console.log(typeof this[pageKey])
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
									}
								});
							});
						});
					}
				});
			},
			// 加载更多
			loadMore() {},
			// 选择车型
			onModelChange(item) {
				item.carModel = this.modelArray[e.detail.value];
			},
			setPlate(plate, item) {
				if (plate.length >= 7) item.carNumber = plate;
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
			billSave() {
				let that = this;
				if (!that.form.vipNumber) {
					return that.$tools.toast('请录入会员号');
				}
				if (!that.form.vipName) {
					return that.$tools.toast('请输入会员名称');
				}
				if (!that.form.phoneNumber) {
					return that.$tools.toast('请输入会员手机号码');
				}
				if (that.form.vipCarmessageCars.length == 0) {
					return that.$tools.toast('车辆信息不能为空');
				}
				that.$api('bill.addVip', that.form).then(res => {
					if (res.flag) {
						that.$tools.toast(res.msg);
						that.$Router.back();
					} else {
						that.$tools.toast(res.message);
					}
				});
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
			text-align: center;
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
