<template>
	<view>
		<view class="u-p-40">
			<u-image width="100%" height="600rpx" :src="goodsInfo.cover_url"></u-image>
			<view class="title">{{goodsInfo.title}}</view>
			<view class="formation">
				<view class="price">￥{{goodsInfo.price}}</view>
				<view class="sales">销量 {{goodsInfo.sales}}</view>
			</view>
		</view>
		
		<view>
			<u-tabs class="u-m-b-10" :list="tabsList" :is-scroll="false" bar-width="100" :current="current" @change="tabsChange"></u-tabs>
		</view>
		
		<view class="u-p-b-80 u-m-b-40" v-if="current == 0">
			<u-parse class="u-p-b-20" :html="goodsInfo.details"></u-parse>
		</view>
		
		<view class="u-p-b-70" v-if="current == 1">
			<view class="center" v-if="commentList.length === 0">
				<view class="tips">暂无评论,期待你的留言</view>
			</view>
			<view v-else class="comment" v-for="(res, index) in commentList" :key="res.id">
				<view class="left">
					<u-image 
					width="120" 
					height="120" 
					:src="res.user.avatar_url" 
					mode="aspectFill" 
					:lazy-load="true"
					border-radius="50%"></u-image>
				</view>
				<view class="right">
					<view class="top">
						<view class="name">
							{{ res.user.name }}
						</view>
					</view>
					<view class="content">
						{{ res.content }}
					</view>
					<view class="time">
						{{res.created_at}}
					</view>
				</view>
			</view>
		</view>
		
		<view class="u-p-b-70" v-if="current == 2">
			<u-row gutter="16">
				<u-col span="6" v-for="item in goodsList.length !== 0 ? goodsList : 4">
					<goods-card :item="item"></goods-card>
				</u-col>
			</u-row>
		</view>
		
		<view class="bottom">
			<view class="left">
				<view class="item" @click="collect">
					<template v-if="isCollect === 0">
						<u-icon name="star" :size="40" color="black"></u-icon>
						<view class="u-line-1">收藏</view>
					</template>
					<template v-else>
						<u-icon name="star-fill" :size="40" color="#F8738D"></u-icon>
						<view class="text u-line-1">已收藏</view>
					</template>
				</view>
				<view class="item cart" @click="toCart">
					<u-badge type="error" :count="cartCount" :absolute="true" :offset="[-4,-6]"></u-badge>
					<u-icon name="shopping-cart" :size="40"></u-icon>
					<view class="u-line-1">购物车</view>
				</view>
			</view>
			<view class="right">
				<!-- <view class="cart btn u-line-1" @click="addCart">加入购物车</view>
				<view class="buy btn u-line-1" @click="toOrders">立即购买</view> -->
				<u-button type="warning" shape="circle" @click="addCart">加入购物车</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				goodsId:null,
				current:0,
				tabsList:[
					{name:'商品详情'},
					{name:'商品评论',count:0},
					{name:'商品推荐'}
				],
				goodsInfo:{
					title:'',
					price:0,
					sales:''
				},
				commentList:[],
				goodsList:[],
				isCollect:0,
				cartCount:0,
				num:0,
			}
		},
		onLoad(option) {
			//console.log(option);
			this.goodsId = option.id;
			this.getGoodsData();
			this.getCartCount();
		},
		methods: {
			tabsChange(index){
				this.current = index
				//console.log(this.current);
			},
			//获取商品数据
			async getGoodsData(){
				const res = await this.$u.api.goodsInfo(this.goodsId);
				//console.log(res);
				this.goodsInfo = res.goods;
				this.commentList = res.goods.comments;
				this.goodsList = res.like_goods;
				this.tabsList[1].count = res.goods.comments.lenght;
				this.isCollect = res.goods.is_collect
			},
			//收藏 取消收藏
			async collect(){
				await this.$u.api.goodsCollect(this.goodsId);
				//改变状态
				if(this.isCollect === 0){
					this.isCollect = 1;
					this.$u.toast('收藏成功')
				}else{
					this.isCollect = 0;
					this.$u.toast('取消收藏')
				}
			},
			//添加购物车
			async addCart(){
				this.num += 1;
				const params = {
					goods_id:this.goodsId,
					num:this.num
				}
				await this.$u.api.cartAdd(params);
				this.$u.toast('添加成功');
				this.getCartCount();
			},
			
			//获取购物车数量
			async getCartCount(){
				const token = this.vuex_token;
				if(token){
					const res = await this.$u.api.cartList();
					//console.log(res);
					this.cartCount = res.data.length;
				}
			},
			//跳转到购物车
			toCart(){
				this.$u.route({
					type:'switchTab',
					url:'/pages/cart/cart'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.comment{
	display: flex;
	padding-bottom: 60rpx;
	.left{
		.image{
			width: 100rpx;
			height: 100rpx;
		}
	}
	.right{
		display: flex;
		flex-direction: column;
		.name{
			
			color: #000;
			font-weight: 600;
		}
		.content{
			font-size: 31rpx;
			margin: 20rpx 0;
			color: #000;
		}
		.time{
			color: #999;
		}
	}
}
.title{
	font-size: 50rpx;
	font-weight: 700;
	margin: 30rpx 0;
}
.formation{
	display: flex;
	justify-content: space-between;
	margin-bottom: 20rpx;
}
.price{
	color: red;
	font-size: 40rpx;
}
.sales{
	color: #000;
	font-size: 30rpx;
}
.center{
	display: flex;
	height: 200rpx;
	align-items: center;
	justify-content: center;
}
.tips{
	font-size: 30rpx;
	font-weight: 600;
	color: #999;
}
.bottom{
	padding: 15rpx 0 10rpx;
	position: fixed;
	bottom: 0;
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	background-color: #fff;
}
.left{
	width: 30%;
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	align-items: center;
	.item{
		display: flex;
		flex-direction: column;
		align-items: center;
		.text{
			color: #F8738D;
		}
	}
	.cart{
		position: relative;
	}
}
.right{
	display: flex;
	flex-direction: row;
	margin-right: 2%;
	// .btn{
	// 	text-align: center;
	// 	width: 200rpx;
	// 	height: 80rpx;
	// 	padding-top: 15rpx;
	// 	border: 1rpx solid #fff;
	// 	color: #fff;
	// }
	// .cart{
	// 	border-right: none;
	// 	border-bottom-left-radius: 40rpx;
	// 	border-top-left-radius: 40rpx;
	// 	background-color: #FDC040;
	// }
	// .buy{
	// 	border-left: none;
	// 	border-bottom-right-radius: 40rpx;
	// 	border-top-right-radius: 40rpx;
	// 	background-color: #F57F27;
	// }
}
</style>
