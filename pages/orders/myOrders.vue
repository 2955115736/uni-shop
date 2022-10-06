<template>
	<view class="allContent">
		<view>
			<u-tabs :list="ordersList" active-color="#F0761B" bar-width="100" :is-scroll="false" :current="current" @change="change"></u-tabs>
		</view>
		
		<view v-if="current === 0">
			<view v-if="item.address_id === addressId" v-for="item in allOrders">
				<view class="content" v-for="goods in item.orderDetails.data" :key="goods.id">
					<view class="top">
						<view class="num">共计{{goods.num}}件商品</view>
						<u-tag text="未支付" type="error" mode="dark" :closeable="false"/>
					</view>
					
					<view class="center" @click="toOrderDetails(goods.order_id)">
						<view class="img">
							<u-image width="200" height="200" :src="goods.goods.cover_url"></u-image>
						</view>
						<view class="info">
							<view class="infoTop">
								<view class="title">{{goods.goods.title}}</view>
								<view class="description">{{goods.goods.description}}</view>
							</view>
							<view class="infoBot">
								<text class="red">￥{{goods.goods.price}}</text>
								<text class="black">×{{goods.num}}</text>
							</view>
						</view>
					</view>
					
					<view class="bottom">
						<view class="created">{{goods.goods.created_at}}</view>
						<view class="btn">
							<u-button size="mini" type="warning" @click="toOrderDetails(goods.order_id)">去付款</u-button>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view v-else-if="current === 1" >
			<view v-if="item.address_id === addressId" v-for="item in allOrders">
				<view class="content" v-for="goods in item.orderDetails.data">
					<view class="top">
						<view class="num">共计{{goods.num}}件商品</view>
						<u-tag text="已支付" type="success" mode="dark" :closeable="false"/>
					</view>
					
					<view class="center">
						<view class="img">
							<u-image width="200" height="200" :src="goods.goods.cover_url"></u-image>
						</view>
						<view class="info">
							<view class="infoTop">
								<view class="title">{{goods.goods.title}}</view>
								<view class="description">{{goods.goods.description}}</view>
							</view>
							<view class="infoBot">
								<text class="red">￥{{goods.goods.price}}</text>
								<text class="black">×{{goods.num}}</text>
							</view>
						</view>
					</view>
					
					<view class="bottom">
						<view class="created">{{goods.goods.created_at}}</view>
					</view>
				</view>
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
				ordersList:[
					{name:'待付款'},
					{name:'已支付'}
				],
				current:0,
				page:0,
				allOrders:[],
				address:[],
				addressId:null,
				status:false
			}
		},
		onLoad() {
			this.getAddress();
			this.getOrdersList();
		},
		methods: {
			//切换tab栏
			change(index){
				this.page = 1;
				this.allOrders = [];
				this.current = index;
				this.getAddress();
				this.getOrdersList();
			},
			
			//获取默认地址的id，通过地址判断获取订单
			async getAddress(){
				const res = await this.$u.api.addressList();
				this.address = res.data;
				//console.log(this.address);
				this.address.filter(item => {
					if(item.is_default === 1){
						return this.addressId = item.id
					}
				})
				// console.log(this.addressId);
			},
			
			//获取订单列表
			async getOrdersList(){
				this.status = true;
				const params = {
					page:this.page
				}
				if(this.current === 0) params.status = 1;
				if(this.current === 1) params.status = 2;
				const {data} = await this.$u.api.ordersList(params);
				this.allOrders = [...this.allOrders,...data];
				//console.log(this.allOrders);
				this.status = false;
			},
			
			//下拉刷新数据
			onReachBottom() {
				this.page = this.page+1;
				//console.log(this.page);
				this.getOrdersList();
			},
			
			//跳转商品详情
			toOrderDetails(id){
				this.$u.route({
					url:'/pages/orders/details',
					params:{
						id
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.allContent{
	padding-bottom: 40rpx;
}
.content{
	width: 95%;
	border: 2rpx solid #fff;
	margin:20rpx auto 50rpx;
	padding: 20rpx;
	border-radius: 20rpx;
	box-shadow: 0 0 20rpx #999;
	.top{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10rpx;
		.num{
			font-size: 32rpx;
			color: black;
		}
	}
	.center{
		display: flex;
		flex-direction: row;
		background-color: #FAF9F8;
		border-radius: 10rpx;
		.img{
			padding: 20rpx;
		}
		.info{
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			width: 60%;
			padding: 10rpx 0;
			.infoTop{
				.title{
					font-size: 32rpx;
					font-weight: 600;
				}
				.description{
					color: #61605F;
				}
			}
			.infoBot{
				display: flex;
				justify-content: space-between;
				.red{
					font-size: 31rpx;
					color: red;
					font-weight: 600;
				}
				.black{
					color: black;
					font-size: 31rpx;
				}
			}
		}
	}
	.bottom{
		padding: 20rpx 10rpx 0;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		.created{
			color: #999;
		}
	}
}
.empty{
	margin-top: 40%;
}
.loading{
		position: fixed;
		bottom: 1%;
		left:48%;
	}
</style>
