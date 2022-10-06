<template>
	<view class="wrap">
		<view class="content">
			<view class="title">欢迎登录图书商城</view>
			<input class="u-border-bottom" v-model="email" placeholder="请输入邮箱" />
			<input class="u-border-bottom" type="password" v-model="password" placeholder="请输入密码" />
			<button @tap="submit" :style="[inputStyle]" class="getCaptcha">登录</button>
			<view class="alternative">
				<view class="issue" @click="toRegister">注册用户</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			email:'',
			password:'',
		}
	},
	computed: {
		inputStyle() {
			let style = {};
			if(this.$u.test.email(this.email) && this.password) {
				style.color = "#fff";
				style.backgroundColor = this.$u.color['warning'];
			}
			return style;
		}
	},
	
	methods: {
		async submit() {
			if(!this.$u.test.email(this.email) || !this.password) return;
			const params = {
				email:this.email,
				password:this.password
			};
			const loginRes = await this.$u.api.login(params);
			
			
			//缓存token
			this.$u.vuex('vuex_token',loginRes.access_token);
			
			this.$u.toast('登录成功');
			
			//获取用户信息
			this.$u.utils.userInfoUpdate();
			//提取存储的来源页地址
			const backUrl = uni.getStorageSync('back_url') ? uni.getStorageSync('back_url') : 'pages/index/index';
			
			console.log(backUrl);
			if(backUrl === 'pages/index/index' || backUrl === 'pages/center/center' || backUrl === 'pages/cart/cart' || backUrl === 'pages/goods/goods'){
				//登录之后跳转到来源页
				setTimeout(() => {
					this.$u.route({
						type:'switchTab',
						url: backUrl
					})
				}, 1000)
			}else{
				setTimeout(() => {
					this.$u.route({
						type:'redirectTo',
						url: backUrl
					})
				}, 1000)
			}
		},
		
		toRegister(){
			this.$u.route({
				url:'/pages/auth/register',
			})
		}
	}
};
</script>

<style lang="scss" scoped>
.u-border-bottom{
	margin-bottom: 40rpx !important;
}
.wrap {
	font-size: 28rpx;
	.content {
		width: 600rpx;
		margin: 80rpx auto 0;

		.title {
			text-align: center;
			font-size: 50rpx;
			font-weight: 500;
			margin-bottom: 100rpx;
		}
		input {
			text-align: left;
			margin-bottom: 10rpx;
			padding-bottom: 6rpx;
		}
		.getCaptcha {
			background-color: rgb(253, 243, 208);
			color: $u-tips-color;
			border: none;
			font-size: 30rpx;
			padding: 12rpx 0;
			
			&::after {
				border: none;
			}
		}
		.alternative {
			color: $u-tips-color;
			text-align: center;
			margin-top: 30rpx;
		}
	}
	
}
</style>
