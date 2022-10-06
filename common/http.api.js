// 如果没有通过拦截器配置域名的话，可以在这里写上完整的URL(加上域名部分)
// let hotSearchUrl = '/ebapi/store_api/hot_search';
// let indexUrl = '/ebapi/public_api/index';

// 此处第二个参数vm，就是我们在页面使用的this，你可以通过vm获取vuex等操作，更多内容详见uView对拦截器的介绍部分：
// https://uviewui.com/js/http.html#%E4%BD%95%E8%B0%93%E8%AF%B7%E6%B1%82%E6%8B%A6%E6%88%AA%EF%BC%9F
const install = (Vue, vm) => {
	// 首页
	let index = (params = {}) => vm.$u.get('api/index',params);
	
	//认证相关
	let login = params => vm.$u.post('api/auth/login',params) //登录
	let register = params => vm.$u.post('api/auth/register',params) //注册
	let logout = () => vm.$u.post('api/auth/logout') //退出登录
	let ossToken = () => vm.$u.get('api/auth/oss/token') //获取oss token
	
	//用户相关
	let user = () =>vm.$u.get('api/user') //请求用户信息
	let userInfo = params =>vm.$u.put('api/user',params) //更新用户信息
	let userAvatar = params =>vm.$u.post('api/user/avatar',params) //更换用户头像
	
	//商品相关
	let goodsInfo = id => vm.$u.get(`api/goods/${id}`) //商品详情
	let goodsCollect = id => vm.$u.post(`api/collects/goods/${id}`) //商品收藏和取消
	let goodsList = (params = {}) => vm.$u.get('api/goods',params) 
	
	//购物车相关
	let cartAdd = params => vm.$u.post('api/carts',params) //加入购物车
	let cartList = () => vm.$u.get('api/carts') //获取购物车信息
	let cartInfo = () => vm.$u.get('api/carts?include=goods') //购物车列表
	let cartDelete = cart_id => vm.$u.delete(`api/carts/${cart_id}`) //移除购物车
	let cartNum  = (num,cart_id) => vm.$u.put(`api/carts/${cart_id}`,{num}) //改变购物车商品数量
	let cartChange = cart_ids => vm.$u.patch(`api/carts/checked`,{cart_ids}) //改变购物车的选中状态
	
	//订单相关
	let ordersInfo = () => vm.$u.get('api/orders/preview') //订单列表
	let ordersSubmit = params => vm.$u.post('api/orders',params) //提交订单
	let ordersPay = (order,type) => vm.$u.get(`api/orders/${order}/pay`,{type}) //支付订单
	let orders = (order_id) => vm.$u.get(`api/orders/${order_id}?include=orderDetails.goods,address`) //订单详情
	let ordersList = params => vm.$u.get('api/orders?include=orderDetails.goods',params) //我的订单
	
	//地址相关
	let addressList = () => vm.$u.get('api/address') //地址列表
	let addressDefault = address_id => vm.$u.patch(`api/address/${address_id}/default`) //设置默认地址
	let addressDel = address_id => vm.$u.delete(`api/address/${address_id}`) //删除地址
	let addressDetails = address_id => vm.$u.get(`api/address/${address_id}`) //地址详情
	let addressUpdate = (address_id,params) => vm.$u.put(`api/address/${address_id}`,params) //更新地址
	let addressCreate = params => vm.$u.post('api/address',params) //添加地址
	
	//收藏相关
	let myCollects = page => vm.$u.get('api/collects',{page})
	let collects = goods_id => vm.$u.post(`api/collects/goods/${goods_id}`)
	
	// 将各个定义的接口名称，统一放进对象挂载到vm.$u.api(因为vm就是this，也即this.$u.api)下
	vm.$u.api = {
		index,
		login,
		register,
		logout,
		ossToken,
		user,
		userInfo,
		userAvatar,
		goodsInfo,
		goodsCollect,
		goodsList,
		cartAdd,
		cartList,
		cartInfo,
		cartDelete,
		cartNum,
		cartChange,
		ordersInfo,
		ordersSubmit,
		ordersPay,
		orders,
		ordersList,
		addressList,
		addressDefault,
		addressDel,
		addressDetails,
		addressUpdate,
		addressCreate,
		myCollects,
		collects
	};
}

export default {
	install
}