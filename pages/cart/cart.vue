<template>
	<view class="content u-p-b-80">
		<template v-if="vuex_token">
			<view v-if="cartInfo.length !== 0">
				<view class="cartItem" v-for="(item,index) in cartInfo" :key="item.id">
					<!-- 单选按钮 -->
					<view class="btn">
						<u-checkbox 
						v-model="item.is_checked?true:false" 
						:name="item.id" 
						@change="checkChange"
						size="40" 
						shape="circle">
						</u-checkbox>
					</view>
					<!-- 商品信息 -->
					<view class="cart">
						<view class="left">
							<u-image width="180" height="180" :src="item.goods.cover_url"></u-image>
						</view>
						<view class="right">
							<view class="top">
								<view class="title">{{item.goods.title}}</view>
								<view class="description">{{item.goods.description}}</view>
								<view class="stock">库存：{{item.goods.stock}}</view>
							</view>
							<view class="bottom">
								<view class="price">￥{{item.goods.price}}</view>
								<view class="number">
									<u-number-box 
									v-model="item.num" 
									:min="1" 
									:max="item.goods.stock" 
									:index="item.id"
									@change="numChange"></u-number-box>
									<u-icon name="trash" color="red" size="44" @click="cartDel(item.id)"></u-icon>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="empty" v-else>
				<u-empty text="购物车空空如也" mode="car"></u-empty>
			</view>
		</template>
		<template v-else>
			<view class="empty">
				<u-empty text="请先登录用户" mode="permission"></u-empty>
			</view>
		</template>
		<!-- 底部 -->
		<view class="allbtm">
			<view class="bLeft">
				<u-checkbox v-model="allCheck" size="40" shape="circle">全选</u-checkbox>
			</view>
			<view class="bRight">
				<view>
					<text class="sum">合计：</text>
					<text class="red">￥</text>
					<text class="total">{{totalPrice}}</text>
					<text class="decimal">.00</text>
				</view>
				<view v-if="totalPrice !== 0">
					<u-button type="error" :ripple="true" shape="square" @click="toOrders">去结算</u-button>
				</view>
				<view v-else>
					<u-button type="error" :ripple="true" shape="square" disabled>去结算</u-button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cartInfo:[],
			}
		},
		computed:{
			allCheck:{
				get(){
					return this.cartInfo.every(item => {
						return item.is_checked;
					})
				},
				//监视当前属性值的变化，当属性值发生变化时执行
				set(val){
					//console.log(val);
					this.cartAllCheck(val);
				}
			},
			//商品总价格
			totalPrice(){
				return this.cartInfo.filter(item => {
					if(item.is_checked){
						return true;
					}
				}).reduce((pre,item) => {
					//价格累加
					return parseInt(pre) + parseInt(item.goods.price) * item.num //商品数量
				},0)
			}
		},
		onShow(){
			if(this.vuex_token){
				this.getCartData();
			}
		},
		
		methods: {
			//跳转订单预览
			toOrders(){
				this.$u.route({
					url:'/pages/orders/orders'
				})
			},
			//获取购物车数据
			async getCartData(){
				const res = await this.$u.api.cartInfo();
				this.cartInfo = res.data;
				//console.log(this.cartInfo);
			},
			
			//改变数量
			async numChange(val){
				//console.log(val);
				const {value,index} = val;
				await this.$u.api.cartNum(value,index)
			},
			
			//删除购物车商品
			async cartDel(id){
				await this.$u.api.cartDelete(id);
				this.getCartData();
				this.$u.toast('已移除购物车');
			},
			
			//商品选中状态
			async checkChange(val){
				//console.log(val);
				const {value,name} = val;
				let ids = [];
				//把已选中的商品id添加进数组
				this.cartInfo.forEach(item => {
					if(item.is_checked === 1){
						ids.push(item.id)
					}
				});
				if(!value){
					//选中被点击成false，把该商品的id从数组中删除
					ids.splice(ids.indexOf(name),1);
					//提交改变状态的id
					await this.$u.api.cartChange(ids);
				}else{
					//没被选中 点击之后变成true 就把该商品的id添加进数组
					ids.push(name);
					await this.$u.api.cartChange(ids);
				}
				//重新调用购物车数据
				this.getCartData();
			},
			
			//设置全选和全不选
			async cartAllCheck(val){
				let ids = [];
				if(!val){
					ids = [];
					await this.$u.api.cartChange(ids)
				}else{
					this.cartInfo.forEach(item => {
						ids.push(item.id)
					})
					await this.$u.api.cartChange(ids);
				}
				this.getCartData()
			},
		}
	}
</script>

<style lang="scss" scoped>
.empty{
	margin-top: 80rpx;
}

.cartItem{
	display: flex;
	flex-direction: row;
	align-items: center;
	padding-top: 20rpx;
	border-top: 20rpx solid #fff;
	.btn{
		padding: 0 20rpx;
	}
	.cart{
		background-color: #fff;
		display: flex;
		flex-direction: row;
		width: 80%;
		padding: 30rpx;
		border-radius: 10rpx;
		box-shadow: 0 0 10rpx #000;
		.right{
			width: 100%;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			margin-left: 10rpx;
			.title{
				font-size: 26rpx;
				color: #000;
				font-weight: 600;
			}
			.description{
				font-size: 20rpx;
				color: #827F7F;
			}
			.stock{
				font-size: 20rpx;
				color: #827F7F;
			}
			.bottom{
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				.price{
					font-size: 30rpx;
					color: #EB1B23;
					font-weight: 600;
				}
				.number{
					display: flex;
					align-items: center;
				}
			}
		}
	}
}
.empty{
	margin-top: 40%;
}
.allbtm{
	background-color: #fff;
	width: 100%;
	position: fixed;
	/* #ifdef H5 */
	bottom: 8%;
	/* #endif */
	/* #ifndef H5 */
	bottom: 1%;
	/* #endif */
	
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	.bLeft{
		width: 30%;
		display: flex;
		flex-direction: row;
		align-items: center;
		padding-left: 20rpx;
		font-weight: 600;
		color: #000;
	}
	.bRight{
		width: 65%;
		display: flex;
		flex-direction: row;
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
}
</style>
