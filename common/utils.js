const install = (Vue,vm) => {
	const isLogin = () => {
		//如果没有token，跳转到登录页
		if(!vm.vuex_token){
			//console.log(getCurrentPages());
			//来自哪个页面
			const currentPage = getCurrentPages().pop();
			//console.log(currentPage.route);
			
			//获取页面路径和请求参数
			const {options,route} = currentPage;
			//参数的key
			const optionsKeys = Object.keys(options);
			let params = '';
			if(optionsKeys.length !== 0){
				params = optionsKeys.reduce((pre,current) => {
					return `${pre}${current}=${options[current]}&`
				},'?').slice(0,-1)
			};
			//缓存当前页面的地址，用于登录或者注册之后的跳转
			uni.setStorageSync('back_url',route+params);
			
			vm.$u.toast('请先登录');
			setTimeout(() => {
				vm.$u.route({
					type:'redirect',
					url: 'pages/auth/login',
				})
			}, 1000)
			return false;
		}
		return true;
	};
	
	//更新用户信息
	const userInfoUpdate = async () => {
		//请求用户信息
		const userInfo = await vm.$u.api.user();
		//缓存用户信息
		vm.$u.vuex('vuex_user',userInfo)
	}
	vm.$u.utils = {
		isLogin,
		userInfoUpdate,
	}
}

export default {
	install
}