<template>
	<view>
		<view class="item">
			<u-swipe-action 
				:show="item.show" 
				v-for="(item, index) in siteList" 
				:index="index"
				:key="item.id" 
				@click="clickOne"
				@open="open"
				btn-width="250"
				:disabled="swipe"
				:options="options">
				<view class="item u-border-bottom">
					<!-- 此层wrap在此为必写的，否则可能会出现标题定位错误 -->
					<view class="title-wrap">
						<view @click="backOrders(item.id)">
							<view class="top">
								<view class="name">{{ item.name }}</view>
								<view class="phone">{{ item.phone }}</view>
								<view class="tag">
									<text v-if="item.is_default === 1" class="red">默认</text>
								</view>
							</view>
							<view class="bottom">
								{{item.province}}{{item.city}}{{item.county}}
								<u-icon name="edit-pen" :size="40" color="#999999" @click="updateAddress(item.id)"></u-icon>
							</view>
						</view>
					</view>
				</view>
			</u-swipe-action>
			
			<u-modal @confirm="confirm" @cancel="cancel" v-model="isShow" :content="content" :show-cancel-button="true"></u-modal>
		</view>
		<view class="addSite" @click="toAddAddress">
			<view class="add">
				<u-icon name="plus" color="#ffffff" class="icon" :size="30"></u-icon>新建收货地址
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			show:false,
			isShow:false,
			content:'请确定是否删除地址',
			siteList: [],
			addressId:null,
			defaultId:null,
			from:{},
			swipe:false,
			options: [
						{
							text: '设为默认',
							style: {
								backgroundColor: '#007aff'
							}
						},
						{
							text: '删除',
							style: {
								backgroundColor: '#dd524d'
							}
						}
					],
		};
	},
	onLoad(options) {
		this.from = options;
		if(JSON.stringify(this.from) == '{}'){
			this.swipe = true;
		}
	},
	//更新地址列表
	onShow() {
		this.getAddressList();
	},
	methods: {
		//获取地址列表
		async getAddressList(){
			const {data} = await this.$u.api.addressList();
			this.siteList = data;
			//console.log(this.siteList);
		},
		
		//返回订单
		async backOrders(id){
			if(this.from.fromCenter === '1' || this.from.fromAdd === '1') return;
			await this.$u.api.addressDefault(id);
			this.$u.route({
				type:'redirectTo',
				url:'pages/orders/orders'
			})
		},
		
		//点击设置默认或者删除
		async clickOne(index,index1) {
			//console.log(index,index1);
			this.addressId = this.siteList[index].id;
			if(index1 === 0){
				await this.$u.api.addressDefault(this.addressId);
				this.siteList[index].show = false;
				this.getAddressList();
				this.$u.toast('设置默认地址成功');
			}else if(index1 === 1){
				this.isShow = true;
			}
		},
		
		// 如果打开一个的时候，不需要关闭其他，则无需实现本方法
		open(index) {
				// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
				// 原本为'false'，再次设置为'false'会无效
				for(let i=0; i<this.siteList.length; i++){
					this.$set(this.siteList[i],'show','false')
				}
				//console.log(index);
				this.siteList[index].show = true;
				this.siteList.map((val, idx) => {
				if(index != idx) this.siteList[idx].show = false;
			})
		},
		
		//跳转到地址更新
		updateAddress(id){
			this.$u.route({
				url:'/pages/orders/adrUpdate',
				params:{
					id:id
				}
			})
		},
		//点击确认的事件
		async confirm(){
			this.siteList.filter(item => {
				if(item.is_default === 1){
					return this.defaultId = item.id
				}
			})
			if(this.defaultId === this.addressId){
				this.getAddressList();
				this.isShow = false;
				return this.$u.toast('默认地址不能删除')
			}
			await this.$u.api.addressDel(this.addressId);
			this.getAddressList();
			this.isShow = false;
			this.$u.toast('删除地址成功');
		},
		//点击取消的事件
		cancel(){
			this.getAddressList();
			this.isShow = false;
			this.$u.toast('已取消删除地址');
		},
		
		//跳转新建收货地址
		toAddAddress(){
			this.$u.route({
				type:'redirectTo',
				url:'/pages/orders/addAddress'
			})
		}
	}
};
</script>

<style lang="scss" scoped>
.item {
	padding: 40rpx 20rpx;
	.top {
		display: flex;
		font-weight: bold;
		font-size: 32rpx;
		.phone {
			margin-left: 20rpx;
		}
		.tag {
			display: flex;
			font-weight: normal;
			align-items: center;
			text {
				display: block;
				width: 60rpx;
				height: 34rpx;
				line-height: 34rpx;
				color: #ffffff;
				font-size: 20rpx;
				border-radius: 6rpx;
				text-align: center;
				margin-left: 30rpx;
				background-color:rgb(49, 145, 253);
			}
			.red{
				background-color:red
			}
		}
	}
	.bottom {
		display: flex;
		margin-top: 20rpx;
		font-size: 28rpx;
		justify-content: space-between;
		color: #999999;
	}
}
.addSite {
	display: flex;
	justify-content: space-around;
	width: 600rpx;
	line-height: 100rpx;
	position: absolute;
	bottom: 30rpx;
	left: 80rpx;
	background-color: red;
	border-radius: 15rpx;
	font-size: 30rpx;
	.add{
		display: flex;
		align-items: center;
		color: #ffffff;
		.icon{
			margin-right: 10rpx;
		}
	}
}
</style>
