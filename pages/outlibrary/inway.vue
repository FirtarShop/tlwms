<template>
	<view class="content">
		<view class="example-title">选择出库方式</view>
		<uni-list>
			<uni-list-item title="紧急出库" note="扫描物料码出库" v-on:click="goOutlibraryByMaterial"></uni-list-item>
			<uni-list-item title="拣货码出库" note="扫拣货码出库" v-on:click="goInlibraryByBill"></uni-list-item>
			<uni-list-item title="平面库出库" note="平面库出库" v-on:click="goOutPmkStock"></uni-list-item>
			<uni-list-item title="生成装车单" note="生成装车单发车" v-on:click="goGenerateVehicle"></uni-list-item>
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
	computed: mapState(['forcedLogin', 'hasLogin', 'userName','password','userID']),
	methods: {
		//紧急出库
		goOutlibraryByMaterial: function() {
			uni.navigateTo({ url: '/pages/outlibrary/index' });
		},
		//拣货码出库
		goInlibraryByBill: function() {
			uni.navigateTo({ url: '/pages/outlibrary/index1' });
		},
		//平面库出库
		goOutPmkStock:function(){
			uni.navigateTo({ url: '/pages/outlibrary/index3' });
		},
		//生成装车单
		goGenerateVehicle: function() {
			uni.navigateTo({ url: '/pages/outlibrary/index2' });
		}
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
