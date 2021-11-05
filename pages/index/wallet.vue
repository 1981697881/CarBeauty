<template>
	<view class="page_box">
		<view class="head_box">
			<view class="tab-box x-f">
				<view class="tab-item" @tap="onTab(tab)" :class="{ 'tab-active': tabCurrent === tab.id }" v-for="tab in tabList" :key="tab.id">
					<text class="tab-title">{{ tab.title }}</text>
					<text v-show="tabCurrent === tab.id" class="tab-triangle"></text>
				</view>
			</view>
		</view>
		<uni-fab v-if="!isUse" :pattern="pattern" :horizontal="horizontal" :vertical="vertical" :popMenu="popMenu" distable :direction="direction" @fabClick="fabClick"></uni-fab>
		<view class="content_box">
			<scroll-view scroll-y="true" enable-back-to-top @scrolltolower="loadMore" class="scroll-box">
				<view class="goods-item" v-for="item in goodsList" :key="item.id">
					<wallet-list
						:confirmationId="item.confirmationId"
						:cardId="item.ticketId"
						:title="item.filmName"
						:subtitle="item.hallName"
						:img="item.filmPhoto"
						:price="item.ticketPayMoney"
						v-if="tabCurrent == 'ing'"
					>
						<block slot="sell">
							<view class="x-f">
								<view>预估费用：{{ item.showDatetime }}</view>
							</view>
						</block>
						<block slot="btn">
							<view class="fot-text">
								<view class="text-grey">
									共
									<text class="text-black text-bold text-xl padding-xs">{{ item.ticketCount }}</text>
									个项目
								</view>
								<view class="fot-btn">
									<button
										v-if="btnType[tabCurrent].color == 'btn-ing'"
										@tap.stop="collection"
										class="cu-btn buy-btn"
										:class="btnType[tabCurrent].color"
									>
										{{ btnType[tabCurrent].name }}
									</button>
								</view>
							</view>
						</block>
					</wallet-list>
					<wallet-list
						:confirmationId="item.OrderID"
						:cardId="item.ticketId"
						:title="item.PName"
						:subtitle="item.StatusName"
						:img="item.ImagePath"
						:price="item.OrderAmount"
						v-else
					>
						<block slot="sell">
							<view class="x-f">
								<view>费用：{{ item.Date }}</view>
							</view>
						</block>
						<block slot="btn">
							<view class="fot-text">
								<view class="text-grey">
									共
									<text class="text-black text-bold text-xl padding-xs">{{ item.OrderQty }}</text>
									个项目
								</view>
								<view class="fot-btn">
									<button
										v-if="btnType[tabCurrent].color == 'btn-nostart'"
										@tap.stop="jump('/pages/wallet/goodsIndex', { OrderID: item.OrderID })"
										class="cu-btn buy-btn"
										:class="btnType[tabCurrent].color"
									>
										{{ btnType[tabCurrent].name }}
									</button>
								</view>
							</view>
						</block>
					</wallet-list>
				</view>
				<!-- 空白 -->
				<app-empty v-if="!goodsList.length && !isLoading" :emptyData="emptyData"></app-empty>
				<!-- 加载更多 -->
				<view v-if="goodsList.length" class="cu-load text-gray" :class="loadStatus"></view>
				<!-- loading -->
				<app-load v-model="isLoading"></app-load>
			</scroll-view>
		</view>
		<app-lmodal ref="customModal" modalTitle="实收金额" @onClickCancel="cancel" @onClickConfirm="confirm"></app-lmodal>
		<view class="foot_box"></view>
		<!-- 自定义底部导航 -->
		<!-- <app-tabbar></app-tabbar> -->
		<!-- 关注弹窗 -->
		<app-float-btn></app-float-btn>
		<!-- 连续弹窗提醒 -->
		<app-notice-modal></app-notice-modal>
		<!-- 登录提示 -->
		<app-login-modal></app-login-modal>
	</view>
</template>
<script>
import walletList from './components/fz-wallets.vue';
import appEmpty from '@/components/app-empty/app-empty.vue';
import uniFab from '@/components/uni-fab/uni-fab.vue';
import { mapMutations, mapActions, mapState, mapGetters } from 'vuex';
export default {
	components: {
		walletList,
		uniFab,
		appEmpty
	},
	data() {
		return {
			horizontal: 'right',
			vertical: 'bottom',
			popMenu: false,
			direction: 'horizontal',
			pattern: {
				color: '#7A7E83',
				backgroundColor: '#fff',
				selectedColor: '#FFCCCC',
				buttonColor: '#FF6666'
			},
			emptyData: {
				img: '/static/imgs/empty/empty_goods.png',
				tip: '暂无订单，快去开单吧~'
			},
			isLoading: false,
			isUse: true,
			loadStatus: '', //loading,over
			lastPage: 1,
			currentPage: 1,
			status: 0,
			tabCurrent: 'ing',
			goodsList: [],
			loading: false,
			btnType: {
				ing: {
					name: '付款',
					color: 'btn-ing'
				},
				// nostart: {
				// 	name: '立即兑换',
				// 	color: 'btn-nostart'
				// }
			},
			tabList: [
				{
					id: 'ing',
					title: '未完成',
					status: '0'
				},
				{
					id: 'nostart',
					title: '已完成',
					status: '1'
				}
			]
		};
	},
	computed: {
		...mapState({
			 storeInfo: state => state.user.storeInfo,
		})
	},
	onShow() {
		/* setTimeout(() => {
			this.loading = true;
		}, 500); 
		const { query } = this.$Route;
		if (query.type == 'nostart') {
			this.tabCurrent = query.type;
			this.getMixPackageOrderList();
		}else{
			this.getGoodsList();
		}*/
		this.getIsUse();
	},
	methods: {
		...mapActions(['getUserDetails']),/* , 'getOrderNum' */
		// 初始化
		init() {
			return Promise.all([this.getUserDetails()])/* , this.getOrderNum() */
				.then(() => {
					uni.stopPullDownRefresh();
				})
				.catch(() => {
					uni.stopPullDownRefresh();
				});
		},
		getIsUse(){
			let that = this;
			that.$api('user.isUseJurisdiction', {}).then(res => {
				if (res.flag) {
					that.isUse = res.data.disable
					this.getGoodsList();
				}
			});
		},
		confirm(val){
			let that = this;
			console.log(val)
			that.$api('bill.updateOrder', {
				filmId: '051201092021'
			}).then(res => {
				if (res.flag) {
					that.$tools.toast(res.msg);
					that.getGoodsList();
				} else {
					that.$tools.toast(res.msg);
				}
			});
		},
		cancel(){
			
		},
		//收款
		collection(){
			let that = this;
			uni.showActionSheet({
			    itemList: ['余额', '现金', '微信', '支付宝', '其他'],
			    success: function (res) {
					switch(res.tapIndex){
						case 0:
						break;
						case 1:
						break;
						case 2:
						break;
						case 3:
						break;
						case 4:
						break;
					}
					that.$nextTick(function(){
						that.$refs['customModal'].showModal()
					})
			    },
			    fail: function (res) {
			        console.log(res.errMsg);
			    }
			});
		},
		//开单
		fabClick(){
			this.jump('/pages/wallet/bill', {})
		},
		jump(path, parmas) {
			this.$Router.push({
				path: path,
				query: parmas
			});
		},
		onTab(val) {
			this.tabCurrent = val.id;
			this.status = val.status;
			this.currentPage = 1;
			// this.goodsList = [];
			// if (this.tabCurrent == 'ing') {
			// 	this.getGoodsList();
			// } else {
			// 	this.getMixPackageOrderList();
			// }
		},
		// 百分比
		getProgress(sales, stock) {
			let unit = '';
			if (stock + sales > 0) {
				let num = (sales / (sales + stock)) * 100;
				unit = num.toFixed(2) + '%';
			} else {
				unit = '0%';
			}
			return unit;
		},
		// 加载更多
		loadMore() {
			if (this.currentPage < this.lastPage) {
				this.currentPage += 1;
				this.getGoodsList();
			}
		},
		// 订单列表
		getGoodsList() {
			let that = this;
			/* that.isLoading = true; */
			that.loadStatus = 'loading';
			that.$api('bill.findOrdersByStatus', {	
				status: that.status
			}).then(res => {
				if (res.flag) {
					that.isLoading = false;
					that.goodsList = res.data;
					that.loadStatus = 'over';
				}
			});
		},
	}
};
</script>

<style scoped lang="scss">
.head_box {
	background-color: #2b4055;
}
.tab-box {
	overflow: hidden;
	width: 100%;
	height: 84rpx;
	border: 1px solid #f8f8ff;
	border-radius: 40rpx 40rpx 0 0;
	.tab-item {
		flex: 1;
		line-height: 84rpx;
		text-align: center;
		background: #ffffff;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #999999;
		position: relative;
		border-right: 1rpx solid #fff;
		.tab-triangle {
			position: absolute;
			z-index: 2;
			bottom: 0;
			left: 42%;
			border-radius: 5rpx;
			width: 45rpx;
			height: 10rpx;
			background: #2b4055;
		}
	}
	.tab-active {
		color: #333333;
	}
}
.goods-item {
	position: relative;
	margin-bottom: 2rpx;
	.cu-progress {
		width: 225rpx;
		height: 16rpx;
		.progress--color {
			background: #e6b873;
		}
	}
	.progress-text {
		color: #999999;
		font-size: 20rpx;
		margin-left: 25rpx;
	}
	.fot-text {
		width: 100%;
		height: 70rpx;
		line-height: 70rpx;
		display: flex;
		.text-grey {
			width: 50%;
		}
		.fot-btn {
			text-align: right;
			width: 50%;
			height: 60rpx;
			.buy-btn {
				width: 140rpx;
				height: 60rpx;
				border-radius: 30rpx;
				font-size: 26rpx;
				font-family: PingFang SC;
				font-weight: 400;
				padding: 0;
			}
			.btn-end {
				background: linear-gradient(90deg, #c6e2ff, #b9d3ee);
				box-shadow: 1px 1px 1px 1px rgba(229, 138, 0, 0.22);
				color: white;
			}
			.btn-nostart {
				background: linear-gradient(90deg, #ffec8b, #eedc82);
				box-shadow: 1px 1px 1px 1px rgba(229, 138, 0, 0.22);
				color: #ff8247;
			}
			.btn-ing {
				background: linear-gradient(90deg, #fff0f5, #ffe4e1);
				box-shadow: 1px 1px 1px 1px rgba(229, 138, 0, 0.22);
				color: rgba(238, 99, 99, 1);
			}
		}
	}
}
</style>
