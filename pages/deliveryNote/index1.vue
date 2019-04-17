<template>
	<view style="width: 100%;">
		<view class="uni-padding-wrap uni-common-mt">
			<view v-show="data.length > 0" class="wxc-card">
				<view class="wxc-card_list" v-for="item in data" v-bind:key="item.RegionName">
					<view class="wxc-card_list_header">
						<view class="wxc-card_list_header_title">区域名称:{{ item.RegionName }}</view>
						<view class="wxc-card_list_header_title">库位名称:{{ item.LocalName }}</view>
					</view>
					<view class="wxc-card_list_content">
						<view class="wxc-card_list_header_extra1">物料编码:{{ item.MNumber }}</view>
						<view class="wxc-card_list_header_extra1">物料名称:{{ item.MName }}</view>
					</view>
				</view>
				<view>
					<view v-show="!isNext" style="text-align: center;">没有更多数据</view>
					<button type="primary" v-show="isNext" @click="goMore">加载更多</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { addUserParam, parseForRule, authAccount, isEmptyObject } from '@/libs/util.js';
import { getPdTaskList } from '@/api/deliveryNote.js';
import { mapState } from 'vuex';
export default {
	// {"PdFlag":1,"pageSize":20,"pageIndex":0,"sortField":"LocalName","sortOrder":"asc","UserName":"admin","Password":"admin123","UserID":1}
	data() {
		return {
			total: 0,
			FreezeFlag: '',
			RegionID: '',
			LocalID: '',
			LocalName: '',
			PdFlag: 0, //查询物料编码
			pageSize: 20, //分页
			pageIndex: 0, //当前页码
			sortField: 'LocalName', //排序字段
			sortOrder: 'asc', //
			data: []
		};
	},
	created() {
		this.total = 0;
		this.FreezeFlag = '';
		this.RegionID = '';
		this.LocalID = '';
		this.LocalName = '';
		this.PdFlag = 1;
		this.pageSize = 20;
		this.pageIndex = 0;
		this.sortField = 'LocalName';
		this.sortOrder = 'asc';
		this.data = [];
		this.sureQuery();
	},
	computed: {
		...mapState(['forcedLogin', 'hasLogin', 'userName', 'password', 'userID']),
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
			var _this = this;
			getPdTaskList(addUserParam(this.generateModel(), this.userName, this.password, this.userID)).then(data => {
				var [error, res] = data;
				console.log('getLocationList.data:' + JSON.stringify(data));
				console.log('getLocationList.res:' + JSON.stringify(res));
				var result = parseForRule(res.data);
				console.log('getLocationList.result:' + JSON.stringify(result));
				if (result && !isEmptyObject(result)) {
					_this.addDeliveryNoteModel(result);
				} else {
					uni.showModal({
						title: '提示',
						content: '没有查询出盘点信息',
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
		},
		//返回
		cancle: function() {
			uni.navigateBack();
		},
		//加载下一页
		goMore: function() {
			var result = [];
			this.pageIndex++;
			this.sureQuery();
		},
		//重置函数
		reset: function() {
			this.total = 0;
			this.PdFlag = 1;
			this.pageSize = 20;
			this.pageIndex = 0;
			this.FreezeFlag = '';
			this.RegionID = '';
			this.LocalID = '';
			this.LocalName = '';
			this.sortField = 'LocalName';
			this.sortOrder = 'asc';
			this.data = [];
		},
		//添加物料信息
		addDeliveryNoteModel: function(data) {
			this.total = data.total;
			for (let item of data.data) {
				this.data.push(item);
			}
		},
		//生成提交查询入库model
		generateModel: function() {
			var model = new Object();
			model.PdFlag = this.PdFlag;
			model.pageSize = this.pageSize;
			model.pageIndex = this.pageIndex;
			model.sortField = this.sortField;
			model.sortOrder = this.sortOrder;
			model.FreezeFlag = this.FreezeFlag;
			model.RegionID = this.RegionID;
			model.LocalID = this.LocalID;
			model.LocalName = this.LocalName;
			return model;
		}
	},
	onLoad(option) {
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
