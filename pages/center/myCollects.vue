<template>
	<view class="content">
		<view>
			<view v-if="pagination.total !== 0" class="total">
				商品收藏
				<u-badge type="primary" :offset="[8,35]" :count="pagination.total"></u-badge>
			</view>
			<view v-else class="total">
				当前并无收藏商品
			</view>
		</view>
		<view class="goods" v-for="(item,index) in myCollectsList">
			<view class="center">
				<view  @click="toShow(item.goods_id)">
					<u-image width="200" height="200" :src="item.goods.cover_url"></u-image>
				</view>
				<view class="goodsInfo"  @click="toShow(item.goods_id)">
					<view class="title">{{item.goods.title}}</view>
					<view class="description">{{item.goods.description}}</view>
					<view class="price">￥{{item.goods.price}}</view>
				</view>
				<view class="collect" @click="isCollect(item.goods_id,index)">
					<u-icon name="star-fill" size="50" color="#FB6496"></u-icon>
				</view>
			</view>
			<view class="create">
				收藏时间：{{item.created_at}}
			</view>
		</view>
		<view class="loading">
			<u-loading :show="status"></u-loading>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				myCollectsList:[],
				pagination:[],
				count:0,
				page:1,
				status:false,
			}
		},
		onShow() {
			this.getCollects();
		},
		
		methods: {
			async getCollects(){
				
				const {data,meta} = await this.$u.api.myCollects(this.page);
				this.myCollectsList = [...this.myCollectsList,...data];
				this.pagination = meta.pagination;
				this.status = false;
				
				//console.log(this.myCollectsList);
				//console.log(this.pagination);
			},
			
			async isCollect(id,index){
				this.myCollectsList.splice(index,1);
				await this.$u.api.collects(id);
				this.$u.toast('已取消商品收藏');
				this.getCollects();
			},
			
			toShow(id){
				this.$u.route({
					url:'/pages/goods/show',
					params:{
						id:id
					}
				})
			},
			
			onReachBottom(){
				this.status = true;
				this.page = this.page + 1;
				this.getCollects();
			}
		}
	}
</script>

<style lang="scss" scoped>
.content{
	padding-bottom: 40rpx;
	.total{
		margin:20rpx 0rpx;
		padding-bottom: 20rpx ;
		padding-left: 20rpx;
		font-size: 30rpx;
		color: #999;
		font-weight: 600;
		border-bottom: 2rpx solid #eee ;
		box-shadow: 0 30rpx 20rpx -30rpx #000;
	}
	.goods{
		display: flex;
		padding: 20rpx;
		flex-direction: column;
		justify-content: space-around;
		border: 2rpx solid #fff;
		margin: 30rpx;
		border-radius: 15rpx;
		box-shadow: 0 0 20rpx #999;
		.center{
			display: flex;
			flex-direction: row;
			justify-content: space-around;
			.goodsInfo{
				display: flex;
				flex-direction: column;
				justify-content: space-around;
				.title{
					font-size: 32rpx;
					font-weight: 600;
					color: #000;
				}
				.description{
					font-size: 26rpx;
					color: #999;
				}
				.price{
					color: red;
					font-weight: 600;
				}
			}
			.collect{
				margin-top: 10%;
			}
		}
		.create{
			color: #6F6F6F;
			font-weight: 600;
			padding: 5rpx 20rpx;
		}
	}
	.loading{
		position: fixed;
		bottom: 1%;
		left:48%;
	}
}

</style>
