<template>
	<view class="content">
		<view class="example">
			<view class="uni-btn">
				<button type="primary" @click="scanMateria">扫描送货单</button>
				<button type="primary" @click="goQueryPage()">手动输入</button>
			</view>
		</view>
	</view>
</template>

<script>
import { authAccount, parseForRule } from '@/libs/util.js';
import { mapState } from 'vuex';
export default {
	data() {
		return {};
	},
	computed: {
		...mapState(['forcedLogin', 'hasLogin', 'userName'])
	},
	methods: {
		//扫描送货单号
		scanMateria: function() {
			var _this = this;
			uni.scanCode({
				onlyFromCamera: true,
				success: function(res) {
					console.log('res' + JSON.stringify(res));
					var result = parseForRule(res.result);
					console.log('result' + JSON.stringify(res.result));
					if (res && res.result && res.result != '' && res.result.indexOf('FCB') != '-1') {
						_this.goQueryPage(res.result);
					} else {
						uni.showModal({
							title: '提示',
							showCancel: false,
							content: '物料信息错误：' + JSON.stringify(res),
							success: function(res) {
								if (res.confirm) {
									console.log('用户点击确定');
								}
							}
						});
					}
				}
			});
		},
		//进入查询界面
		goQueryPage: function(res) {
			if (res) {
				console.log('res' + JSON.stringify(res));
				uni.navigateTo({ url: '/pages/zhongtai/index1?res=' + res });
			} else {
				uni.navigateTo({ url: '/pages/zhongtai/index1'});
			}
		}
	},
	onLoad() {
		authAccount(this.hasLogin, this.forcedLogin, this.userName);
	}
};
</script>

<style>
.uni-btn > button {
	margin-top: 12px;
}
</style>