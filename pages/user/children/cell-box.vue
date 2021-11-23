<template>
	<view class="cell-warpper ">
		<view class="cell-box flex">
			<text class="cell-label">{{ label }}</text>
			<view class="cell-value flex-sub text-right">
				<slot name="value">
					<text class="text-grey">{{ value }}</text>
				</slot>
			<!-- 	<view class="" v-if="showArrow">
					<text class="cuIcon-right text-grey" ></text>
				</view> -->
			</view>
			
		</view>
	</view>
</template>

<script>
export default {
	props: {
		label: {
			type: String,
			default: ''
		},
		value: {
			type: String,
			default: ''
		},
		showArrow: false
	},
	data() {
		return {};
	}
};
</script>

<style lang="scss">
/* 输入框容器样式 */
.cell-warpper {
	background-color: #ffffff;
	padding: 0 30rpx;
	.cell-label{
		// min-width: 4em;
	}
	.cell-box {
		padding: 16rpx 0;
		width: 100%;
		border-bottom: 2rpx #f6f6f6 solid;
	}
}
</style>
