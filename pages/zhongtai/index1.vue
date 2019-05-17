<template>
	<view style="width: 100%;">
		<view class="uni-padding-wrap uni-common-mt">
			<view v-show="data.length <= 0 || flag">
				<view class=""><input class="uni-input" name="input" v-model="BillNum" placeholder="请填写送货单" /></view>
				<view class="uni-btn-v">
					<button type="primary" @click="sureQuery">确定</button>
					<button type="default" @click="goBack">返回</button>
				</view>
			</view>
			<view v-show="data.length > 0 && !flag" class="wxc-card">
				<view class="wxc-card_list" v-for="item in data" v-bind:key="item.NowQuanId">
					<view class="wxc-card_list_header">
						<view class="wxc-card_list_header_title">拣货码{{ item.PickGoodsCode}}</view>
						<view class="wxc-card_list_header_extra">件号{{ item.MNumber}}</view>
					</view>
					<view class="wxc-card_list_header">
						<view class="wxc-card_list_content_text">名称:{{ item.MName}}</view>
						<view class="wxc-card_list_content_text">是否扫描:{{ item.IsScan}}</view>
					</view>
					<view class="wxc-card_list_content">
						<view class="wxc-card_list_content_text">发货数量:{{ item.Qty}}</view>
						<view class="wxc-card_list_content_text">实收数量:{{item.ShQty}}</view>
					</view>
				</view>
				<view>
					<view v-show="!isNext" style="text-align: center;">没有更多数据</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { addUserParam,parseForRule, authAccount, isEmptyObject } from '@/libs/util.js';
import { ResearchZoteRecGoods } from '@/api/zhongtai.js';
import { mapState } from 'vuex';
export default {
	data() {
		return {
			flag: false, //在有数据的情况下，是否显示查询按钮
			total: 0,
			BillNum:'' ,
			data: []
		};
	},
	created() {
		this.flag = false;
		this.total = 0;
		this.BillNum = '';
		this.data = [];
	},
	computed: {
		...mapState(['forcedLogin', 'hasLogin', 'userName','password','userID']),
		isNext() {
			if (this.total > this.data.length) {
				return true;
			} else {
				return false;
			}
		}
	},
	methods: {
		//确定查询
		sureQuery: function() {
			if (this.MNumber == '') {
				uni.showModal({
					title: '提示',
					content: '请填写物料编码',
					showCancel: false,
					success: function(res) {
						if (res.confirm) {
							console.log('用户点击确定');
							return;
						}
					}
				});
			} else {
				var _this = this;
				ResearchZoteRecGoods(addUserParam(this.generateModel(),this.userName,this.password,this.userID)).then(data => {
						var [error, res] = data;
						console.log('ResearchZoteRecGoods.data:' + JSON.stringify(data));
						console.log('ResearchZoteRecGoods.res:' + JSON.stringify(res));
						var result = parseForRule(res.data);
						console.log('ResearchZoteRecGoods.result:' + JSON.stringify(result));
						if (result && !isEmptyObject(result)) {
							_this.addMaterialModel(result);
						} else {
							uni.showModal({
								title: '提示',
								content: '没有查询出拣货信息',
								showCancel: false,
								success: function(res) {
									if (res.confirm) {
										console.log('用户点击确定');
										return;
									}
								}
							});
						}
					});
			}
		},
		//返回
		goBack: function() {
			uni.navigateBack();
		},
		//重置函数
		reset: function() {
			this.total = 0;
			this.BillNum = '';
		},
		//添加物料信息
		addMaterialModel: function(data, flag) {
			this.total = data.total;
			if (this.flag) {
				this.data = [];
			}
			for (let item of data.data) {
				this.data.push(item);
			}
			this.flag = false;
		},
		//生成提交查询入库model
		generateModel: function() {
			var model = new Object();
			model.BillNum = this.BillNum;
			return model;
		},
		//退仓入库原因
	},
	onLoad(option) {
		console.log('option:' + JSON.stringify(option));
		if (option.res) {
			this.BillNum = option.res;
		}
		authAccount(this.hasLogin, this.forcedLogin, this.userName);
	}
};
</script>

<style lang="scss">
.wxc-card {
	margin: $uni-spacing-col-base;
	position: relative;
	display: flex;
	flex-direction: column;

	&_list {
		background: $uni-bg-color;
		margin-bottom: $uni-spacing-col-base;

		&_header {
			position: relative;
			display: flex;
			flex-direction: row;
			padding: $uni-spacing-col-base;
			align-items: left;
		}

		&_header {
			&_title {
				margin-right: $uni-spacing-col-base;
				display: flex;
				flex-direction: row;
				justify-content: flex-start;
				align-items: center;
				font-size: $uni-font-size-lg;
			}

			&_extra {
				margin-right: $uni-spacing-col-base;
			}
			&_extra:last-child {
				margin-right: 0upx;
			}
		}

		&_content {
			position: relative;
			display: flex;
			flex-direction: row;
			padding: 0 $uni-spacing-col-base;
			align-items: left;

			&_text {
				font-weight: 100;
				padding: $uni-spacing-col-base;
			}
		}
	}
}
</style>
