<template>
	<view>
		<u-form class="u-m-l-60 u-m-r-80" :error-type="errorType" :model="userForm" ref="userFormRef">
			<u-form-item label="昵称" prop="name" required>
				<u-input v-model="userForm.name" />
			</u-form-item>
		</u-form>
		<u-button type="primary" class="u-m-l-60 u-m-r-60"  @click="submit">提交</u-button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				errorType:['message'],
				userForm:{
					name:'',
				},
				rules:{
					name:[
						{required:true,message:'请输入昵称',trigger:['change','blur']}
					]
				}
			}
		},
		methods: {
			submit(){
				this.$refs.userFormRef.validate(async valid => {
					if(!valid) return;
					await this.$u.api.userInfo(this.userForm);
					//重新获取用户信息
					this.$u.utils.userInfoUpdate();
					this.$u.toast('修改昵称成功');
				})
			}
		},
		onReady() {
			this.$refs.userFormRef.setRules(this.rules);
			this.userForm.name = this.vuex_user.name;
		}
	}
</script>

<style lang="scss" scoped>

</style>
