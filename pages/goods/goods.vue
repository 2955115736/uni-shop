<template>
	<view class="u-wrap">
		<view class="u-search-box">
			<u-search placeholder="搜索商品" v-model="keyword" @custom="searchGoods" @clear="clearGoods"></u-search>
		</view>
		<view class="u-m-t-10 u-m-b-20">
			<u-tabs bar-width="100" :list="tabsList" :is-scroll="false" :current="tabsPage" @change="tabsChange"></u-tabs>
		</view>
		<view class="u-menu-wrap">
			<scroll-view scroll-y scroll-with-animation class="u-tab-view menu-scroll-view" :scroll-top="scrollTop">
				<view v-for="(item,index) in categories" :key="item.id">
					<view v-for="(c,ci) in item.children" 
					:key="c.id" class="u-tab-item" 
					:class="[current==c.id ? 'u-tab-item-active' : '']"
					:data-current="c.id" @tap.stop="swichMenu(c.id)">
						<text class="u-line-1">{{c.name}}</text>
					</view>
				</view>
			</scroll-view>
			
			<scroll-view scroll-y class="right-box" @scrolltolower="scrollEvent">
				<view class="page-view">
					<view class="class-item">
						<view class="item-container">
							<navigator 
							class="thumb-box" 
							v-for="(goods, goodsIndex) in goodsList" 
							
							:url="'/pages/goods/show?id='+goods.id">
								<image class="item-menu-image" :src="goods.cover_url"></image>
								<view class="item-menu-name u-line-1">{{goods.title}}</view>
							</navigator>
							
							<view v-if="goodsList.length === 0" class="empty">
								<u-empty text="暂无商品信息" mode="data"></u-empty>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				categories:[],
				goodsList:[],
				scrollTop: 0, //tab标题的滚动条位置
				current: 0,
				page:1,
				keyword:'',
				isLast:false,
				tabsPage:0,
				tabsList:[
					{name:'分类'},
					{name:'销量'},
					{name:'推荐'},
					{name:'价格'},
					{name:'评论'},
				]
			}
		},
		onLoad() {
			this.getData()
		},
		methods: {
			//获取商品信息
			async getData(){
				const params = {
					page:this.page,
					title:this.keyword,
				}
				//判断分类是否有id
				if(this.current) params.category_id = this.current;
				//判断选中的标签
				if(this.tabsPage == 1) params.sales = 1;
				if(this.tabsPage == 2) params.recommend = 1;
				if(this.tabsPage == 3) params.price = 2;
				if(this.tabsPage == 4) params.comments_count = 1;
				const res = await this.$u.api.goodsList(params);
				//console.log(res);
				this.categories = res.categories;
				this.goodsList = [...this.goodsList,...res.goods.data];
				this.isLast = res.goods.next_page_url ? false : true;
			},
			//搜索商品
			searchGoods(){
				this.initData();
			},
			//清空搜索
			clearGoods(){
				this.keyword = '';
				this.initData();
			},
			
			// 点击左边的栏目切换
			async swichMenu(cid) {
				if(cid == this.current) return ;
				this.current = cid;
				this.initData();
			},
			
			//滚动底部加载下一页
			scrollEvent(e){
				if(this.isLast) return;
				this.page = this.page + 1;
				this.getData();
			},
			
			//重置商品和分页
			initData(){
				this.page = 1;
				this.goodsList = [];
				this.getData();
			},
			
			tabsChange(index){
				this.tabsPage = index;
				//console.log(this.tabsPage);
				this.initData();
			}
		}
	}
</script>

<style lang="scss" scoped>
	.empty{
		width: 100%;
		height: 100%;
		margin:100rpx 0;
	}
	.u-wrap {
		height: calc(100vh);
		/* #ifdef H5 */
		height: calc(100vh - var(--window-top));
		/* #endif */
		display: flex;
		flex-direction: column;
	}

	.u-search-box {
		padding: 18rpx 30rpx;
	}

	.u-menu-wrap {
		flex: 1;
		display: flex;
		overflow: hidden;
	}

	.u-search-inner {
		background-color: rgb(234, 234, 234);
		border-radius: 100rpx;
		display: flex;
		align-items: center;
		padding: 10rpx 16rpx;
	}

	.u-search-text {
		font-size: 26rpx;
		color: $u-tips-color;
		margin-left: 10rpx;
	}

	.u-tab-view {
		width: 200rpx;
		height: 100%;
	}

	.u-tab-item {
		height: 110rpx;
		background: #f6f6f6;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 26rpx;
		color: #444;
		font-weight: 400;
		line-height: 1;
	}
	
	.u-tab-item-active {
		position: relative;
		color: #000;
		font-size: 30rpx;
		font-weight: 600;
		background: #fff;
	}
	
	.u-tab-item-active::before {
		content: "";
		position: absolute;
		border-left: 4px solid $u-type-primary;
		height: 32rpx;
		left: 0;
		top: 39rpx;
	}

	.u-tab-view {
		height: 100%;
	}
	
	.right-box {
		background-color: rgb(250, 250, 250);
	}
	
	.page-view {
		padding: 16rpx;
	}
	
	.class-item {
		margin-bottom: 30rpx;
		background-color: #fff;
		padding: 16rpx;
		border-radius: 8rpx;
	}
	
	.item-title {
		font-size: 26rpx;
		color: $u-main-color;
		font-weight: bold;
	}
	
	.item-menu-name {
		font-weight: normal;
		font-size: 24rpx;
		color: $u-main-color;
		
	}
	
	.item-container {
		display: flex;
		flex-wrap: wrap;
		
	}
	
	.thumb-box {
		width: 33.333333%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		padding: 40rpx;
	}
	
	.item-menu-image {
		width: 120rpx;
		height: 120rpx;
	}
</style>
