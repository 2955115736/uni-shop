<template>
	<view>
		<view v-if="address.length !== 0 && isShow === true" class="address" @click="toAddress">
			<view class="formation">
				<u-icon name="map" size="50"></u-icon>
				<view class="left" v-for="item in address">
					<view class="info" v-if="item.is_default === 1">
						<view class="adrInfo u-line-1">
							{{item.province}}{{item.city}}{{item.county}}
						</view>
						<view class="userInfo">
							{{item.name}} {{item.phone}}
						</view>
					</view>
				</view>
			</view>
			<u-icon name="arrow-right"></u-icon>
		</view>
		
		<view class="payInfo" v-else-if="isShow === false">
			<view class="window">
				<view class="info">
					<view class="title">支付</view>
					<u-icon size="36" class="close" name="close" @click="closeWindow"></u-icon>
				</view>
				<view class="payimg">
					<u-image width="500" height="500" :src="payImg"></u-image>
				</view>
				<view class="text" @click="toDetial">稍后支付</view>
			</view>
		</view>
		
		<view v-else>
			<u-empty text="请先填写收货地址" mode="address"></u-empty>
		</view>
		
		<view>
			<view class="goodsInfo" v-for="goods in cartsList">
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
		
		<view class="orderSumit">
			<view>
				<text class="sum">合计：</text>
				<text class="red">￥</text>
				<text class="total">{{totalPrice}}</text>
				<text class="decimal">.00</text>
			</view>
			<view>
				<u-button :disabled="totalPrice === 0  || address.length === 0" type="error" @click="submitOrder">提交订单并支付</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				address:[],
				cartsList:[],
				orderId:null,
				payImg:'',
				isShow:true,
			}
		},
		computed:{
			totalPrice(){
				return this.cartsList.map(item => {
					return item
				}).reduce((pre,item) => {
					//价格累加
					return parseInt(pre) + parseInt(item.goods.price) * item.num //商品数量
				},0)
			}
		},
		onShow() {
			this.getOrders();
		},
		methods: {
			//获取订单信息
			async getOrders(){
				const {address,carts} = await this.$u.api.ordersInfo();
				this.address = address;
				this.cartsList = carts;
				//console.log(address);
				//console.log(carts);
			},
			//跳转到地址管理
			toAddress(){
				this.$u.route({
					url:'/pages/orders/address'
				})
			},
			//提交订单
			async submitOrder(){
				let orders = this.address.filter(item => {
					if(item.is_default === 1){
						return item;
					}
				})
				const params = {
					address_id : orders[0].id
				}
				const res = await this.$u.api.ordersSubmit(params);
				this.orderId = res.id;
				
				const payRes = await this.$u.api.ordersPay(this.orderId,'aliyun');
				//console.log(payRes);
				this.payImg = payRes.qr_code_url;
				
				this.isShow = false;
				
			},
			
			//关闭支付窗口
			closeWindow(){
				this.isShow = true;
				this.$u.route({
					type:'switchTab',
					url:'/pages/cart/cart'
				})
			},
			
			//跳转订单详情
			toDetial(){
				this.$u.route({
					type:'redirectTo',
					url:'pages/orders/details',
					params:{
						id:this.orderId
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.address{
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	border-bottom: 2rpx solid #f8f8f8;
	align-items: center;
	height: 10vh;
	.formation{
		display: flex;
		.left{
			display: flex;
			flex-direction: row;
			.noAddress{
				font-size: 34rpx;
				font-weight: 600;
				color: #000;
			}
			.info{
				display: flex;
				flex-direction: column;
				line-height: 60rpx;
				.adrInfo{
					color: #000;
					font-size: 35rpx;
				}
				.userInfo{
					color: #999;
				}
			}
		}
	}
}


.none{
	font-size: 34rpx;
	color: black;
	font-weight: 600;
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
		.bottom{
			display: flex;
			flex-direction: row;
			justify-content: space-between;
		}
	}
}
.title{
	font-size: 30rpx;
	font-weight: 600;
	color: #000;
}
.price{
	color: red;
	font-weight: 600;
}
.num{
	font-size: 30rpx;
	color: #000;
	font-weight: 600;
}
.orderSumit{
	width:100vw;
	padding: 0 20rpx;
	position: fixed;
	bottom: 2%;
	display: flex;
	align-items: center;
	justify-content: space-around;
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
.payInfo{
	padding: 55rpx;
	height: 100vh;
	width: 100vw;
	z-index: 999;
	position: fixed;
	background-color: #424242;
	opacity: 0.9;
	box-sizing: border-box;
	.window{
		width: 100%;
		/* #ifdef H5 */
		height: 52%;
		/* #endif */
		/* #ifndef H5 */
		height: 58%;
		/* #endif */
		background-color: #fff;
		border-radius: 40rpx;
		margin-top: 25%;
		text-align: center;
		.payimg{
			/* #ifdef MP-WEIXIN */
			margin-left: 10%;
			/* #endif */
			.u-image{
				margin-left: 10%;
			}
		}
		
		.info{
			position: relative;
			.close{
				position: absolute;
				right: 5%;
				top:30%;
			}
			.title{
				color: #000;
				font-weight: 600;
				font-size: 34rpx;
				padding-top: 20rpx;
			}
			
		}
		.text{
			font-weight: 600;
			font-size: 34rpx;
			color: #454545;
			border-top: 2rpx solid #BBBBBB;
			padding-top: 2%;
		}
		
	}
}
</style>
