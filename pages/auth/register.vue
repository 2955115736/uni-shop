<template>
	<view class="wrap">
		<view class="top"></view>
		<view class="content">
			<view class="title">注册用户</view>
			<input class="u-border-bottom" v-model="name" placeholder="请输入昵称" />
			<input class="u-border-bottom" v-model="email" placeholder="请输入邮箱" />
			<input class="u-border-bottom" type="password" v-model="password" placeholder="请输入密码" />
			<input class="u-border-bottom" type="password" v-model="password_confirmation" placeholder="请再次输入密码" />
			<button @tap="submit" :style="[inputStyle]" class="getCaptcha">注册</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				name:'',
				email:'',
				password:'',
				password_confirmation:'',
			}
		},
		computed: {
			inputStyle() {
				let style = {};
				if(this.name && this.$u.test.email(this.email) && this.password &&this.password_confirmation) {
					style.color = "#fff";
					style.backgroundColor = this.$u.color['warning'];
				}
				return style;
			}
		},
		methods: {
			async submit(){
				//规则验证
				if(!this.name || !this.$u.test.email(this.email) || !this.password || !this.password_confirmation) returh;
				
				//准备参数
				let params = {
					name:this.name,
					email:this.email,
					password:this.password,
					password_confirmation:this.password_confirmation
				}
				
				//请求注册api
				const registerRes = await this.$u.api.register(params);
				
				//跳转到登录页
				this.$u.toast('注册成功')
				setTimeout(()=>{
					this.$u.route({
						type:'redirect',
						url:'pages/auth/login'
					})
				},1000)
			}
		}
	}
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
	}
}
</style>

