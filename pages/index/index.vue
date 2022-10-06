<template>
	<view class="u-skeleton">
		<u-swiper class="u-skeleton-fillet" border-radius="20" height="320" :list="slides" name="img_url"></u-swiper>
		
		<view class="banner">
			<u-tabs :list="tabsList" bar-width="100" item-width="170" :current="current" @change="tabsChange"></u-tabs>
		</view>
		
		<view class="content">
			<u-row gutter="16">
				<u-col span="6" v-for="item in goods.length !== 0 ? goods : 4">
					<goods-card :item="item"></goods-card>
				</u-col>
			</u-row>
		</view>
		
		<!-- 骨架屏 -->
		<u-skeleton :loading="isLoding" :animation="true"></u-skeleton>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				slides:[],
				goods:[],
				tabsList:[
					{name:'默认'},
					{name:'推荐'},
					{name:'销量'},
					{name:'最新'}
				],
				current:0,
				page:1,
				isLoding:false,
			}
		},
		async onLoad() {
			this.getData();
		},
		methods:{
			tabsChange(index){
				//console.log(index);
				this.current = index;
				//切换菜单，清空商品列表和页数
				this.goods = [];
				this.page = 1;
				this.getData();
			},
			
			async getData(){
				this.isLoding = true;
				const params = {
					page:this.page
				};
				//判断选中的标签
				if(this.current == 1) params.recommend = 1;
				if(this.current == 2) params.sales = 1;
				if(this.current == 3) params.new = 1;
				
				const res = await this.$u.api.index(params);
				this.isLoding = false;
				//轮播图
				this.slides = res.slides;
				//将其他页面的商品添加进商品列表
				this.goods = [...this.goods,...res.goods.data];
				//console.log(res);
			},
		},
		// 可以在 pages.json 的页面配置中设置触发距离onReachBottomDistance在触发距离内滑动期间,本事件只会被触发—次。
		onReachBottom() {
			this.page = this.page+1;
			//console.log(this.page);
			this.getData();
		}
	}
</script>

<style lang="scss" scoped>
	.banner{
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		margin: 20rpx 0 10rpx;
		border-bottom: 2rpx solid #eee;
		box-shadow: 0rpx 30rpx 20rpx -30rpx #999;
	}
</style>
