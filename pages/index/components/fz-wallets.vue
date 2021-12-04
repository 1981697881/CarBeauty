<template>
	<view class="activity-goods-box x-bc">
		<slot name="item-close"></slot>
		
		<view class="img-box">
			<slot name="tag"></slot>
			<image class="img" :src="detail.carPhoto" mode="scaleToFill"></image>
		</view>
		<view class="goods-right y-bc">
			<view class="title one-t padding-top">
				车牌：{{ detail.carNumber }}{{ detail.carBrand?'（'+detail.carBrand+'）':'' }}</view>
			<view class="tip one-t">接单时间：{{ detail.createDate }}</view>
			<view class="one-t">手机号码：{{ detail.phoneNumber  || '' }}</view>
			<view class="one-t">付款方式：{{ detail.payType  || '未收款' }}</view>
			<view class="slod-end">
				<slot name="sell"></slot>
			</view>
			<view class="price-box">
				<view class="current">美容项目：</view>
				<view class="x-f">
					<view class="flex flex-wrap">
						<view class="padding-xs" v-for="(item, tagindex) in cosmetologyName" :key="tagindex">
							<view class="cu-tag radius" :class="'line-' + item.name">{{ item.title }}</view>
						</view>
					</view>
					<!-- <view class="original">￥{{ originalPrice }}</view> -->
				</view>
			</view>
		</view>
		<view class="cir-info">
			<view class="cir-left"></view>
			<view class="cir-right"></view>
			<view class="cir-line"></view>
		</view>
		<view class="fot-content">
			<slot name="btn"></slot>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'walletCard',
		components: {},
		data() {
			return {
				cosmetologyName: [],
			};
		},
		props: {
			detail: { //数据
				type: Object,
				default: null
			},
		},
		computed: {},
		created() {
			if (this.detail.cosmetologyName) {
				let keyword = this.detail.cosmetologyName.split(",");
				keyword.forEach((item, index) => {
					let obj = {
						name: this.ColorList[index].name,
						title: item
					}
					this.cosmetologyName.push(obj)
				})
			}
		},
		methods: {
			
			// 路由跳转
			jump(path, parmas) {
				this.$Router.push({
					path: path,
					query: parmas
				});
			}
		}
	};
</script>

<style lang="scss">
	

	.activity-goods-box {
		margin: 30rpx;
		box-shadow: 1px 2px 2px 2px #f6f6f6;
		border-radius: 10rpx;
		background: #fff;
		flex-wrap: wrap;

		.cir-info {
			width: 100%;
			margin-top: 15rpx;
			display: flex;
			height: 48rpx;
			background: #f6f6f6;
			position: relative;

			.cir-line {
				position: absolute;
				height: 1px;
				box-shadow: 1px 1px 1px 1px #fff;
				background: linear-gradient(to right, #DCDCDC, #DCDCDC 5px, transparent 5px, transparent);
				background-size: 15rpx 100%;
				top: 45%;
				width: 93%;
				left: 3.5%;
			}

			.cir-left {
				width: 50%;
				background: radial-gradient(circle at 1% 24rpx, transparent 20rpx, #fff 0) top left 49% no-repeat;
			}

			.cir-right {
				width: 50%;
				background: radial-gradient(circle at 99% 24rpx, transparent 20rpx, #fff 0) top right 49% no-repeat;
			}
		}

		.fot-content {
			padding: 10rpx;
			width: 100%;
			display: inline-block;
		}

		.img-box {
			padding: 20rpx;
			padding-bottom: 0;
			width: 200rpx;
			overflow: hidden;
			position: relative;

			.img {
				width: 200rpx;
				border-radius: 15rpx;
				height: 210rpx;
				background-color: #ccc;
			}
		}
	
	.goods-right {
			padding: 10rpx;
			width: 450rpx;
			min-height: 200rpx;
			position: relative;
			align-items: flex-start;
			position: relative;

			.title {
				line-height: 28rpx;
				width: 500rpx;
			}

			.tip {
				color: #a8700d;
				width: 500rpx;
			}

			.price-box {
				.current {
					font-size: 28rpx;
					font-weight: 500;
					color: rgba(125, 103, 43, 1);
				}

				.original {
					font-size: 22rpx;
					font-weight: 400;
					text-decoration: line-through;
					color: rgba(153, 153, 153, 1);
					margin-left: 14rpx;
				}
			}
		}
	}
</style>
