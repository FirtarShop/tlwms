<template>
	<view class="content">
		<view class="example-title">选择入库方式</view>
		<uni-list>
			<uni-list-item title="众泰收货" note="众泰收货" v-on:click="zhongtaiReceiving"></uni-list-item>
			<uni-list-item title="查询收货完成" note="众泰查询收货完成" v-on:click="zhongtaiQueryGoods"></uni-list-item>
		</uni-list>
	</view>
</template>

<script>
import { mapState } from 'vuex';
import { authAccount } from '@/libs/util.js';
import { uniList, uniListItem } from '@dcloudio/uni-ui';
export default {
	data() {
		return {};
	},
	components: { uniList, uniListItem },
	computed: mapState(['forcedLogin', 'hasLogin', 'userName','code']),
	methods: {
		zhongtaiReceiving: function() {
			uni.navigateTo({ url: '/pages/zhongtai/index' });
		},
		zhongtaiQueryGoods: function() {
			uni.navigateTo({ url: '/pages/zhongtai/index1way' });
		},
	},
	onLoad() {
		authAccount(this.hasLogin, this.forcedLogin, this.userName);
	}
};
</script>

<style>
.example-title {
	border-left: #007aff solid 6upx;
	padding-left: 18upx;
}
</style>
