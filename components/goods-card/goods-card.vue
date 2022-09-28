<template>
	<navigator class="item">
		<u-image class="u-skeleton-fillet" width="100%" height="300rpx" :src="item.cover_url"></u-image>
		<view class="title u-line-1 u-skeleton-rect">{{item.title ? item.title : "商品名称"}}</view>
		<view class="formation">
			<view class="price u-skeleton-rect">￥{{item.price}}</view>
			<view class="sales u-skeleton-rect">销量：{{item.sales}}</view>
		</view>
	</navigator>
</template>

<script>
	export default {
		props:['item'],
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
	.item{
		padding: 40rpx;
		margin-top: 20rpx;
		box-shadow: 0 12rpx 20rpx 0 rgba(0,0,0,.1);
		.title{
			font-size: 30rpx;
			font-weight: 700;
			margin: 20rpx 0;
			width: 100%;
		}
		.formation{
			font-size: 20rpx;
			display: flex;
			justify-content: space-between;
			.price{
				color: red;
				width: 40%;
			}
			.sales{
				color: #999;
				width: 40%;
			}
		}
	}
</style>
