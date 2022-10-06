<template>
	<view>
		<view class="u-flex user-box u-p-t-40 u-p-l-30 u-p-r-20 u-p-b-30">
			<view class="u-m-r-10">
				<oss-upload></oss-upload>
			</view>
			<view class="u-flex-1">
				<view class="u-font-18 u-p-b-20">{{vuex_user.name ? vuex_user.name : ''}}</view>
				<view class="u-font-14 u-tips-color">邮箱：{{vuex_user.email ? vuex_user.email : ''}}</view>
			</view>
		</view>
		
		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item icon="setting" @click="toUserInfo" title="个人信息"></u-cell-item>
			</u-cell-group>
		</view>
		
		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item icon="order" title="我的订单" @click="toOrderDetails"></u-cell-item>
				<u-cell-item icon="star" title="我的收藏" @click="toMyCollects"></u-cell-item>
				<u-cell-item icon="map" title="收货地址" @click="toAddress"></u-cell-item>
			</u-cell-group>
		</view>
		
		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item icon="reload" @click="logout" title="退出登录"></u-cell-item>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show:true
			}
		},
		onLoad() {
			if(!this.$u.utils.isLogin()) return;
		},
		methods: {
			//进入个人信息页面
			toUserInfo(){
				this.$u.route({
					url:'pages/center/userInfo'
				})
			},
			
			//退出登录
			async logout(){
				await this.$u.api.logout();
				this.$u.toast('退出成功');
				setTimeout(() => {
					//清空token和用户信息
					this.$u.vuex('vuex_token',null);
					this.$u.vuex('vuex_user',{});
					
					//跳转首页
					this.$u.route({
						type:'reLaunch',
						url:'pages/index/index'
					})
				},1500)
			},
			
			//跳转我的订单
			toOrderDetails(){
				this.$u.route({
					type:'navigateTo',
					url:'/pages/orders/myOrders'
				})
			},
			
			//跳转地址管理
			toAddress(){
				this.$u.route({
					type:'navigateTo',
					url:'/pages/orders/address',
					params:{
						fromCenter:1
					}
				})
			},
			
			//跳转我的收藏
			toMyCollects(){
				type:'navigateTo',
				this.$u.route({
					url:'/pages/center/myCollects',
				})
			}
		}
	}
</script>

<style lang="scss">
page{
	background-color: #ededed;
}

.user-box{
	background-color: #fff;
}

</style>



