<template>
	<view class="goods-box" v-if="detail">
		<view class="content-box" @tap="jump('/pages/cinema/movie/list', { sectionId: detail.sectionId,scheduleId: detail.scheduleId,schedulekey:detail.scheduleKey,language: detail.language,dimensional: detail.dimensional,filmName:detail.filmName,filmId:detail.filmId,showDatetime:detail.showDatetime,hallId:detail.hallId,hallName:detail.hallName || ''})">
			<text v-if="isTag && detail.status" class="tag-star"><text class="lg text-red cuIcon-favorfill"></text></text>
			<view class="cont_one">
				<view><text class="text-bold">接单时间:</text></view>
				<view><text class="text-gray">预计费用:</text></view>
			</view>
			<view class="cont_two">
				<view><text class="text-bold">车牌号:</text></view>
				<view><text class="text-gray">结算金额:</text></view>
			</view>
			<view class="cont_three">
				<view class="o_price">支付方式:</view>
			</view>
			<view class="cont_four">
				<view class="text-blue">美容项目:</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'fzCircuitMiniCard',
	components: {},
	data() {
		return {
			goodsList: [],
			swiperCurrent: 0,
			platform: uni.getStorageSync('platform'),
		};
	},
	props: {
		isTag: {
			type: [Boolean, String],
			default: false
		},
		detail: {
			type: Object,
			default: null
		}
	},
	computed:{
		
	},
	created() {
	},
	methods: {
		swiperChange(e) {
			this.swiperCurrent = e.detail.current;
		},
		// 路由跳转
		jump(path, parmas) {
			console.log(parmas)
			this.$Router.push({
				path: path,
				query: parmas
			});
		}
	}
};
</script>

<style scoped lang="scss">
.o_price {
	padding-top: 20rpx;
	color: rgba(225, 33, 43, 1);
	/* &:before {
		content: '￥';
		color: rgba(225, 33, 43, 1);
		font-size: 26rpx;
	} */
}
.o_price2 {
	&:before {
		content: '￥';
		font-size: 26rpx;
	}
}
.goods-box {
	width: 750rpx;
	background: #fff;
	overflow: hidden;
	.content-box {
		width: 96%;
		margin-left: 2%;
		margin-top: 1%;
		margin-bottom: 1%;
		box-shadow: 1px 1px 1px #CCCCCC;
		border-radius: 20rpx;
		position: relative;
		padding: 20rpx;
		display: flex;
		font-family: PingFang SC;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-between;
		.cont_three {
			text-align: right;
		}
		.cont_four{
			width: 100%;
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
}
</style>
