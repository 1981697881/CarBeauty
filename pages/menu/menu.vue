<template>
	<view>
		<view class="container" v-if="!loading">
			<view class="main" v-if="goods.length">
				<view class="nav">
					<view class="coupon">
						<text class="title">精品套餐</text>
						<view class="iconfont iconarrow-right"></view>
					</view>
				</view>
				<view class="content">
					<!-- goods list begin -->
					<scroll-view class="goods" scroll-with-animation scroll-y :scroll-top="cateScrollTop" @scroll="handleGoodsScroll">
						<view class="wrapper">
							<view class="list">
								<!-- category begin -->
								<view class="category" >
									<view class="items">
										<!-- 商品 begin  "-->
										<view class="good" v-for="(good, key) in goods" :key="key">
											<image @tap="jump('/pages/menu/detail', { PackageId: good.playId })" :src="good.playPhoto|| 'https://cfzx.gzfzdev.com/movie/uploadFiles/image/zanwu.jpg'" class="image"></image>
											<view class="right">
												<text class="name">{{good.playName}}</text>
												<text class="tips">{{good.Note}}</text>
												<view class="price_and_action">
													<text class="price">￥{{ good.playPrice }} <text class="price text-gray" style="text-decoration:line-through">￥{{ good.originalPrice || good.playPrice }}</text></text> 
													<view class="btn-group">
														<button class="cu-btn cuIcon sm round shadow bg-orange" @tap="toPay(good)">
															<text class="cuIcon-cart"></text>
														</button>
													</view>
												</view>
											</view>
										</view>
										<!-- 商品 end -->
									</view>
								</view>
								<!-- category end -->
							</view>
						</view>
					</scroll-view>
					<!-- goods list end -->
				</view>
				<!-- content end -->
				<!-- 购物车栏 begin -->
				<view class="cart-box" v-if="cart.length > 0">
					<view class="mark">
						<image src="/static/imgs/menu/cart.png" class="cart-img" @tap="openCartPopup"></image>
						<view class="tag">{{ getCartGoodsNumber }}</view>
					</view>
					<view class="price">￥{{ getCartGoodsPrice }}</view>
					<button type="primary" class="pay-btn" @tap="toPay" :disabled="disabledPay">{{ disabledPay ? `差${spread}元起送` : '去结算' }}</button>
				</view>
				<!-- 购物车栏 end -->
			</view>
			<!-- 商品详情模态框 begin -->
			<modal :show="goodDetailModalVisible" class="good-detail-modal" color="#5A5B5C" width="90%" custom padding="0rpx" radius="12rpx">
				<view class="cover">
					<image v-if="good.images" :src="good.images" class="image"></image>
					<view class="btn-group">
						<image src="/static/imgs/menu/share-good.png"></image>
						<image src="/static/imgs/menu/close.png" @tap="closeGoodDetailModal"></image>
					</view>
				</view>
				<scroll-view class="detail" scroll-y>
					<view class="wrapper">
						<view class="basic">
							<view class="name">{{ good.name }}</view>
							<view class="tips">{{ good.content }}</view>
						</view>
						<view class="properties" v-if="good.use_property">
							<view class="property" v-for="(item, index) in good.property" :key="index">
								<view class="title">
									<text class="name">{{ item.name }}</text>
									<view class="desc" v-if="item.desc">({{ item.desc }})</view>
								</view>
								<view class="values">
									<view
										class="value"
										v-for="(value, key) in item.values"
										:key="key"
										:class="{ default: value.is_default }"
										@tap="changePropertyDefault(index, key)"
									>
										{{ value.value }}
									</view>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
				<view class="action">
					<view class="left">
						<view class="price">￥{{ good.price }}</view>
						<view class="props" v-if="getGoodSelectedProps(good)">{{ getGoodSelectedProps(good) }}</view>
					</view>
					<view class="btn-group">
						<button type="default" plain class="btn" size="mini" hover-class="none" @tap="handlePropertyReduce"><view class="iconfont iconsami-select"></view></button>
						<view class="number">{{ good.number }}</view>
						<button type="primary" class="btn" size="min" hover-class="none" @tap="handlePropertyAdd"><view class="iconfont iconadd-select"></view></button>
					</view>
				</view>
				<view class="add-to-cart-btn" @tap="handleAddToCartInModal"><view>加入购物车</view></view>
			</modal>
			<!-- 商品详情模态框 end -->
		</view>
		<view class="loading" v-else><image src="/static/imgs/loading.gif"></image></view>
		<view class="foot_box"></view>
		<!-- 自定义底部导航 -->
		<!-- <app-tabbar></app-tabbar> -->
		<!-- 关注弹窗 -->
		<app-float-btn></app-float-btn>
		<!-- 连续弹窗提醒 -->
		<app-notice-modal></app-notice-modal>
		<!-- 登录提示 -->
		<app-login-modal></app-login-modal>
		<!-- 门店选择 -->
		<app-address-model @init="init"></app-address-model>
	</view>
</template>

<script>
import modal from '@/components/modal/modal';
import popupLayer from '@/components/popup-layer/popup-layer';
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';

export default {
	components: {
		modal,
		popupLayer
	},
	data() {
		return {
			goods: [], //所有商品
			ads: [
				{ image: 'http://139.159.136.187:50080/uploadFiles/image/32a545c356d8054f42612132a3535d31.jpeg' },
			],
			loading: true,
			currentCateId: 6905, //默认分类
			cateScrollTop: 0,
			menuScrollIntoView: '',
			cart: [], //购物车
			goodDetailModalVisible: false, //是否饮品详情模态框
			good: {}, //当前饮品
			category: {}, //当前饮品所在分类
			cartPopupVisible: false,
			routerTo: this.$tools.routerTo,
			sizeCalcState: false,
			payType: 'wechat',
			orderType: 'dinein',
			address: '123',
			store: '1'
		};
	},
	async onShow() {
		let that = this
		await this.getUserDetails();
		await this.init();
	},
	/* async onLoad() {
		await this.init();
	}, */
	computed: {
		...mapState({
			userInfo: state => state.user.userInfo,
			 storeInfo: state => state.user.storeInfo,
		}),
		goodCartNum() {
			//计算单个饮品添加到购物车的数量
			return goodsId =>
				this.cart.reduce((acc, cur) => {
					if (cur.goodsId === goodsId) {
						return (acc += cur.goodsCount);
					}
					return acc;
				}, 0);
		},
		menuCartNum() {
			return goodsId =>
				this.cart.reduce((acc, cur) => {
					if (cur.goodsId === goodsId) {
						return (acc += cur.goodsCount);
					}
					return acc;
				}, 0);
		},
		getCartGoodsNumber() {
			//计算购物车总数
			return this.cart.reduce((acc, cur) => acc + cur.goodsCount, 0);
		},
		getCartGoodsPrice() {
			//计算购物车总价
			return this.cart.reduce((acc, cur) => acc + cur.goodsCount * cur.goodsPrice, 0);
		},
		disabledPay() {
			//是否达到起送价
			return this.orderType == 'takeout' && this.getCartGoodsPrice < this.store.min_price ? true : false;
		},
		spread() {
			//差多少元起送
			if (this.orderType != 'takeout') return;
			return parseFloat((this.store.min_price - this.getCartGoodsPrice).toFixed(2));
		}
	},
	methods: {
		...mapActions(['getUserDetails']),
		// 初始化
		async init() {
			//页面初始化
			this.loading = true;
			let me = this;
			this.goods = {}
			me.$api('bill.playList', {
			}).then(res => {
				if (res.flag) {
					this.goods = res.data;
				}
			});
			this.loading = false;
			this.cart = uni.getStorageSync('cart') || [];
		},
		takout() {
			if (this.orderType == 'takeout') return;
			uni.navigateTo({
				url: '/pages/address/address?is_choose=true'
			});
		},
		handleMenuTap(id) {
			//点击菜单项事件
			if (!this.sizeCalcState) {
				this.calcSize();
			}
			this.currentCateId = id;
			this.$nextTick(() => (this.cateScrollTop = this.goods.find(item => item.id == id).top));
		},
		handleGoodsScroll({ detail }) {
			//商品列表滚动事件
			if (!this.sizeCalcState) {
				this.calcSize();
			}
			const { scrollTop } = detail;
			let tabs = this.goods.filter(item => item.top <= scrollTop).reverse();
			if (tabs.length > 0) {
				this.currentCateId = tabs[0].id;
			}
		},
		calcSize() {
			let h = 10;

			let view = uni.createSelectorQuery().select('#ads');
			view.fields(
				{
					size: true
				},
				data => {
					h += Math.floor(data.height);
				}
			).exec();

			this.goods.forEach(item => {
				let view = uni.createSelectorQuery().select(`#cate-${item.id}`);
				view.fields(
					{
						size: true
					},
					data => {
						item.top = h;
						h += data.height;
						item.bottom = h;
					}
				).exec();
			});
			this.sizeCalcState = true;
		},
		handleAddToCart(cate, good, num) {
			//添加到购物车
			const index = this.cart.findIndex(item => {
				if (good.use_property) {
					return item.goodsId === good.goodsId && item.props_text === good.props_text;
				} else {
					return item.goodsId === good.goodsId;
				}
			});
			if (index > -1) {
				this.cart[index].goodsCount += num;
			} else {
				this.cart.push({
					goodsId: good.goodsId,
					goodsName: good.goodsName,
					goodsPrice: good.goodsPrice,
					goodsCount: num,
				});
			}
		},
		handleReduceFromCart(item, good) {
			const index = this.cart.findIndex(item => item.goodsId === good.goodsId);
			this.cart[index].goodsCount -= 1;
			if (this.cart[index].goodsCount <= 0) {
				this.cart.splice(index, 1);
			}
		},
		showGoodDetailModal(item, good) {
			this.good = JSON.parse(JSON.stringify({ ...good, number: 1 }));
			this.category = JSON.parse(JSON.stringify(item));
			this.goodDetailModalVisible = true;
		},
		closeGoodDetailModal() {
			//关闭饮品详情模态框
			this.goodDetailModalVisible = false;
			this.category = {};
			this.good = {};
		},
		changePropertyDefault(index, key) {
			//改变默认属性值
			this.good.property[index].values.forEach(value => this.$set(value, 'is_default', 0));
			this.good.property[index].values[key].is_default = 1;
			this.good.number = 1;
		},
		getGoodSelectedProps(good, type = 'text') {
			//计算当前饮品所选属性
			if (good.use_property) {
				let props = [];
				good.property.forEach(({ values }) => {
					values.forEach(value => {
						if (value.is_default) {
							props.push(type === 'text' ? value.value : value.id);
						}
					});
				});
				return type === 'text' ? props.join('，') : props;
			}
			return '';
		},
		handlePropertyAdd() {
			this.good.number += 1;
		},
		handlePropertyReduce() {
			if (this.good.number === 1) return;
			this.good.number -= 1;
		},
		handleAddToCartInModal() {
			const product = Object.assign({}, this.good, { props_text: this.getGoodSelectedProps(this.good), props: this.getGoodSelectedProps(this.good, 'id') });
			this.handleAddToCart(this.category, product, this.good.number);
			this.closeGoodDetailModal();
		},
		openCartPopup() {
			//打开/关闭购物车列表popup
			this.cartPopupVisible = !this.cartPopupVisible;
		},
		handleCartClear() {
			//清空购物车
			uni.showModal({
				title: '提示',
				content: '确定清空购物车么',
				success: ({ confirm }) => {
					if (confirm) {
						this.cartPopupVisible = false;
						this.cart = [];
						uni.removeStorageSync('cart');
					}
				}
			});
		},
		handleCartItemAdd(index) {
			this.cart[index].number += 1;
		},
		handleCartItemReduce(index) {
			if (this.cart[index].number === 1) {
				this.cart.splice(index, 1);
			} else {
				this.cart[index].number -= 1;
			}
			if (!this.cart.length) {
				this.cartPopupVisible = false;
			}
		},
		toPay(good) {
			uni.showLoading({ title: '加载中' });
			/* uni.setStorageSync('cart', JSON.parse(JSON.stringify(this.cart))) */
			this.$Router.push({
				path: '/pages/menu/pay', 
				query: {
					pay: JSON.stringify([{
					playId: good.playId,
					playPhoto: good.playPhoto,
					playName: good.playName,
					Note: '',
					goodsCount: 1,
					playPrice: good.playPrice,
					}])
				}
			});
			uni.hideLoading();
		},
		// 路由跳转
		jump(path, parmas) {
			this.showShare = false;
			this.$Router.push({
				path: path,
				query: parmas
			});
		},
	}
};
</script>

<style lang="scss" scoped>
@import '~@/pages/menu/menu.scss';
</style>
