<template>
	<view class="content">
		<u-form class="u-m-l-60 u-m-r-80" :error-type="errorType" :model="addressForm" ref="addressFormRef">
				<u-form-item label-width="150" label="联系姓名" prop="name" required>
					<u-input v-model="addressForm.name" placeholder="请输入联系姓名"/>
				</u-form-item>
				<u-form-item label-width="150" label="联系电话" prop="phone" required>
					<u-input v-model="addressForm.phone" placeholder="请输入联系电话"/>
				</u-form-item>
				<u-form-item class="select" label-width="150" label="选择城市" required>
					<view class="u-demo">
						<view class="u-demo-wrap">
							<view class="u-demo-area">
								<city-select v-model="show" @city-change="cityChange"></city-select>
								<view v-if="addressForm.province === ''">
									<u-input placeholder="请选择城市" @click="show = true"></u-input>
								</view>
								<view v-else class="u-demo-result-line">
									{{addressForm.province}}-{{addressForm.city}}-{{addressForm.county}}
								</view>
							</view>
						</view>
					</view>
					<view class="icon" @click="show = true">
						<u-icon name="arrow-right"></u-icon>
					</view>
				</u-form-item>
				<u-form-item label-width="150" label="详细地址" prop="address" required>
					<u-input v-model="addressForm.address" placeholder="请输入详细地址"/>
				</u-form-item>
			</u-form>
			<u-button type="primary" class="u-m-l-60 u-m-r-60" @click="submit">添加地址</u-button>
		</view>
</template>

<script>
	import citySelect from "@/common/u-city-select.vue";
	
	export default {
		components: {
			citySelect
		},
		data() {
			return {
				check:false,
				show:false,
				addressId:null,
				errorType:['message'],
				addressForm:{
					name:'',
					phone:'',
					province:'',
					city:'',
					county:'',
					address:'',
				},
				rules:{
					name:[
						{
							required: true,
							message: '请输入联系姓名',
							// 可以单个或者同时写两个触发验证方式
							trigger:['change','blur']
						}
					],
					phone:[
						{
							required: true,
							message: '请输入联系电话',
							// 可以单个或者同时写两个触发验证方式
							trigger:['change','blur']
						},
						{
							// 自定义验证函数，见上说明
							validator: (rule, value, callback) => {
								// 上面有说，返回true表示校验通过，返回false表示不通过
								// this.$u.test.mobile()就是返回true或者false的
								return this.$u.test.mobile(value);
							},
							message: '请输入正确的手机号码',
							// 触发器可以同时用blur和change
							trigger: ['change','blur'],
						}
					],
					address:[
						{
							required: true,
							message: '请输入详细地址',
							// 可以单个或者同时写两个触发验证方式
							trigger:['change','blur']
						}
					]
				}
			}
		},
		//开启表单验证
		onReady() {
			this.$refs.addressFormRef.setRules(this.rules);
		},
		methods: {
			//选择城市
			cityChange(e) {
				// this.input = e.province.label + '-' + e.city.label + '-' + e.area.label;
				this.addressForm.province = e.province.label;
				this.addressForm.city = e.city.label;
				this.addressForm.county = e.area.label;
			},
			
			//添加地址
			submit(){
				this.$refs.addressFormRef.validate(async valid => {
					if(!valid || this.addressForm.province === '') return this.$u.toast('请填写完整信息');
					await this.$u.api.addressCreate(this.addressForm);
					this.$u.toast('添加地址成功');
					this.$u.route({
						type:'redirectTo',
						url:'/pages/orders/address',
						params:{
							fromAdd:1
						}
					})
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
.content{
	/* #ifdef MP-WEIXIN */
	padding: 0 40rpx;
	/* #endif */
}
.select{
	position: relative;
	.icon{
		position: absolute;
		right: 0%;
	}
}
</style>
