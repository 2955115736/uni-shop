<template>
	<view class="avatar-body">
		<u-upload 
		ref="uploadRef"
		:action="action" 
		:max-size="5 * 1024 * 1024" 
		max-count="1"
		:multiple="false"
		:custom-btn="true"
		:before-upload="beforeUpload"
		:form-data="formData"
		:show-progress="false"
		:show-upload-list="true"
		:deletable="false"
		width="0"
		height="0"
		@on-success="onSuccess"
		 >
			<u-avatar slot="addBtn" :src="vuex_user.avatar_url" size="140"></u-avatar>
		</u-upload>
	</view>
</template>

<script>
	let _this = {}
	export default {
		name:'oss-upload',
		data() {
			return {
				action:'',
				formData:{},
				upFileName:'',
				headImg:''
			}
		},
		created(){
			_this = this;
		},
		methods: {
			//上传前的事件
			//在小程序中this可能会丢失
			async beforeUpload(index,list){
				//处理图片的唯一性
				//console.log(list); 选中图片的信息
				const {file} = list[0];
				//获取文件名
				// #ifdef H5
				const fileName = file.name;
				// #endif
				
				// #ifndef H5
				const fileName = flie.path
				// #endif
				//请求api获取oss-token
				const osstoken = await _this.$u.api.ossToken();
				console.log(_this);
				//设置上传的域名
				_this.action = osstoken.host;
				//console.log(_this.action);
				
				//裁剪文件名后缀
				const suffix = fileName.slice(fileName.lastIndexOf('.'))
				//处理唯一文件名 guid:生成随机数
				const newFileName = _this.$u.guid(20) + suffix
				_this.upFileName = newFileName
				
				_this.formData = {
					'key':newFileName, //上传后的文件名
					'policy':osstoken.policy,
					'OSSAccessKeyId':osstoken.accessid,
					'success_action_status':'200',
					'signature':osstoken.signature
				}
				return true;
			},
			
			async onSuccess(){
				//移除预览区域图片
				this.$refs.uploadRef.remove(0);
				await this.$u.api.userAvatar({avatar:this.upFileName});
				this.$u.utils.userInfoUpdate();
				this.$u.toast('用户头像更换成功');	
			}
		}
	}
</script>

<style lang="scss" scoped>
.avatar-body{
	height: 70px;
	width: 70px;
}

</style>
