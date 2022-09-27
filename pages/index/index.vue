<template>
	<view>
		{{vuex_name}}
	</view>
</template>

<script>
	export default {
		data() {
			return {
				auth:{
					email:'test@a.com',
					password:123123
				}
			}
		},
		async onLoad() {
			// const res = await this.$u.api.login(this.auth);
			// console.log(res);
			console.log(this.vuex_name);
		},
		methods:{
			
		}
	}
</script>

<style lang="scss" scoped>
	
</style>
