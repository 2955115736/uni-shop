<template>
	<view>
		<view>
			<view class="empty" v-if="isEmpty">
				<u-empty text="订单为空" mode="order"></u-empty>
			</view>
			<view v-else>
				<view class="top">
					<view class="title">
						<u-icon name="file-text" size="50"></u-icon>
						<text>订单信息</text>
					</view>
					<view>
						<u-tag v-if="detailList.status === 1" text="未支付" shape="circle" type="error" mode="dark" :closeable="false" />
						<u-tag v-else text="已支付" shape="circle" type="success" mode="dark" :closeable="false" />
					</view>
				</view>
				
				<view class="info">
					<view class="formation">{{addressList.name}} {{addressList.phone}}</view>
					<view class="address u-line-1">{{addressList.province}}{{addressList.city}}{{addressList.county}}</view>
				</view>
				
				<view>
					<view class="goodsInfo" v-for="goods in ordersDetails">
						<view class="left">
							<u-image width="200" height="200" :src="goods.goods.cover_url"></u-image>
						</view>
						<view class="right">
							<view class="top">
								<view class="title">
									{{goods.goods.title}}
								</view>
							</view>
							<view class="bottom">
								<view class="price">
									￥{{goods.goods.price}}
								</view>
								<view class="num">
									× {{goods.num}}
								</view>
							</view>
						</view>
					</view>
				</view>
				
				<view class="getInfo">
					<view class="orderid">
						<text class="black">订单编号：</text>
						<text>{{detailList.order_no}}</text>
					</view>
					<view class="create">
						<text class="black">下单时间：</text>
						<text>{{detailList.created_at}}</text>
					</view>
					
					<view class="total">
						<text class="black">商品总额：</text>
						<text class="red">￥{{totalPrice}}</text>
					</view>
				</view>
			</view>
		</view>
		
		<view class="btn">
			<view class="all">
				<text class="sum">合计：</text>
				<text class="red">￥</text>
				<text class="total">{{totalPrice}}</text>
				<text class="decimal">.00</text>
			</view>
			<u-button type="error" size="medium" :disabled="totalPrice === 0">立即付款</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				detailList:[],
				ordersDetails:[],
				addressList:[],
				orderId:null,
				isEmpty:true,
			}
		},
		onLoad(option) {
			this.orderId = option.id;
			this.getOrdersDetail()
		},
		
		computed:{
			totalPrice(){
				return this.ordersDetails.filter(item => {
					if(item.num !== 0){
						return true;
					}
				}).reduce((pre,item) => {
					return parseInt(pre) + parseInt(item.goods.price) * item.num
				},0)
			}
		},
		methods: {
			async getOrdersDetail(){
				if(this.orderId !== undefined){
					const res = await this.$u.api.orders(this.orderId);
					this.isEmpty = false;
					this.detailList = res;
					//console.log(res);
					this.ordersDetails = res.orderDetails.data;
					this.addressList = res.address;
				}else{
					this.$u.toast('目前并无订单')
				}
				//console.log(this.ordersDetails);
				//onsole.log(res);
			}
		}
	}
</script>

<style lang="scss" scoped>
.empty{
	margin-top: 45%;
}
.top{
	display: flex;
	justify-content: space-between;
	padding: 20rpx;
	.title{
		display: flex;
		align-items: center;
		color: #000;
		font-size: 32rpx;
		font-weight: 600;
	}
}

.info{
	padding: 20rpx;
	.formation{
		font-size: 34rpx;
		font-weight: 600;
	}
	.address{
		font-size: 34rpx;
		
		color: #989494;
		padding-top: 10rpx;
	}
}
.goodsInfo{
	display: flex;
	flex-direction: row;
	background-color: #f8f8f8;
	padding: 10rpx;
	margin-top: 20rpx;
	.right{
		width: 70%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		.top{
			.title{
				font-size: 30rpx;
				font-weight: 600;
				color: #000;
			}
		}
		.bottom{
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			.price{
				color: red;
				font-weight: 600;
			}
			.num{
				font-size: 30rpx;
				color: #000;
				font-weight: 600;
			}
			
		}
	}
}


.getInfo{
	padding: 20rpx;
	.total{
		margin-top: 50rpx;	
	}
	.black{
		color: black;
		font-size: 34rpx;
	}
	.red{
		color: red;
		font-weight: 600;
	}
}
.btn{
	position: fixed;
	display: flex;
	flex-direction: row;
	align-items: center;
	bottom: 2%;
	right: 4%;
	.all{
		margin-right: 20rpx;
		.sum{
			font-size: 35rpx;
			color: #000;
		}
		.red{
			color: red;
		}
		.total{
			font-size: 45rpx;
			color: red;
		}
		.decimal{
			color: red;
		}
	}
}
</style>
