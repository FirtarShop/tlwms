<template>
	<view class="content">
		<view class="example">
			<button type="primary" v-bind:disabled="currentSteps == 1" @click="scanWarehouse">扫库位码</button>
			<view v-if="LocalID != ''">
				<view class="wxc-list">
					<view class="wxc-list-title">库位ID号:</view>
					<view class="wxc-list-extra">{{ LocalID }}</view>
				</view>
				<view class="wxc-list">
					<view class="wxc-list-title">库位名称:</view>
					<view class="wxc-list-extra">{{ LocalName }}</view>
				</view>
				<view class="wxc-list">
					<view class="wxc-list-title">物料编码:</view>
					<view class="wxc-list-extra">{{ MNumber }}</view>
				</view>
				<view class="wxc-list">
					<view class="wxc-list-title">物料名称:</view>
					<view class="wxc-list-extra">{{ MName }}</view>
				</view>
				<view class="wxc-list">
					<view class="wxc-list-title">物料供应商:</view>
					<view class="wxc-list-extra">{{ SupplyName }}</view>
				</view>
				<view class="wxc-list">
					<view class="wxc-list-title">入库时间:</view>
					<view class="wxc-list-extra">{{ InDate }}</view>
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">输入数量盘点数量</view>
					<input class="uni-input" v-model="updateEndQuan"  placeholder="请输需要盘点的数量" type="number" />
				</view>
			</view>
			<button type="primary" @click="updateAmount" v-bind:disabled="!sureUpdateAmount">确认盘点库存</button>
			<button type="default" @click="goBack">返回</button>
		</view>
	</view>
</template>

<script>
import neilModal from '@/components/neil-modal/neil-modal.vue';
import { addUserParam,authAccount, parseForRule, parseWarehouseCode} from '@/libs/util.js';
import { getLocalMateInfo, saveInventoryInfo } from '@/api/deliveryNote.js';
import { mapState } from 'vuex';
export default {
	data() {
		return {
			currentSteps: 0,
			LocalID: '', //库位ID号
			LocalName: '', //库位名称,
			MNumber: '', //当前库位物料编码
			MName: '', //当前库位物料名称
			SupplyName: '', //当前物料供应商
			InDate: '', //入库时间
			EndQuan: '', //当前库位数量
			updateEndQuan: '0'
		};
	},
	computed: {
		...mapState(['forcedLogin', 'hasLogin', 'userName','password','userID']),
		sureUpdateAmount() {
			if (this.currentSteps == 1) {
				return true;
			} else {
				return false;
			}
		}
	},
	methods: {
		//设置货架物料信息
		setStorageInfo: function(data) {
			try {
				this.LocalID = data.LocalID;
				this.LocalName = data.LocalName;
				this.MNumber = data.MNumber;
				this.MName = data.MName;
				this.LocalName = data.LocalName;
				this.SupplyName = data.SupplyName;
				this.InDate = data.InDate;
				this.EndQuan = data.EndQuan;
				return true;
			} catch (e) {
				return false;
			}
		},
		//扫描库位码
		scanWarehouse: function() {
			var _this = this;
			uni.scanCode({
				onlyFromCamera: true,
				success: function(res) {
					console.log('res' + JSON.stringify(res));
					var result = parseWarehouseCode(res.result);
					console.log('result' + JSON.stringify(result));
					if (result && result.codeid && result.codeid != '') {
						getLocalMateInfo(result.codeid,_this.userName,_this.password,_this.userID).then(data => {
							var [error, res] = data;
							console.log('getLocalMateInfo.data:' + JSON.stringify(data));
							console.log('getLocalMateInfo.res:' + JSON.stringify(res));
							var checkResult = parseForRule(res.data);
							console.log('checkResult:' + JSON.stringify(checkResult));
							if (checkResult && checkResult != {}) {
								if (_this.setStorageInfo(checkResult)) {
									_this.currentSteps = 1;
								} else {
									uni.showToast({
										icon: 'none',
										duration: 2500,
										title: '物料信息错误：' + JSON.stringify(checkResult)
									});
								}
							} else {
								uni.showModal({
									title: '提示',
									content: '没有获取库位中相关物料信息',
									showCancel: false,
									success: function(res) {
										if (res.confirm) {
											console.log('用户点击确定');
										}
									}
								});
							}
						});
					} else {
						uni.showToast({
							icon: 'none',
							duration: 2500,
							title: '库位信息错误:' + res.result
						});
					}
				}
			});
		},
		//修改盘点数量
		updateAmount: function() {
			var _this = this;
			console.log('updateEndQuan:' + this.updateEndQuan);
			saveInventoryInfo(addUserParam({"MNumber":this.MNumber,"PdQuan":this.updateEndQuan,"LocalID":this.LocalID},this.userName,this.password,this.userID)).then(data => {
				var [error, res] = data;
				console.log('saveInventoryInfo.data:' + JSON.stringify(data));
				console.log('saveInventoryInfo.res:' + JSON.stringify(res));
				var result = parseForRule(res.data);
				console.log('result:' + JSON.stringify(result));
				if (result.success) {
					console.log(result);
					_this.currentSteps = 2;
					uni.showToast({
						icon: 'success',
						title: '盘点成功！'
					});
				} else {
					uni.showModal({
						title: '提示',
						content: result.ResponseText,
						showCancel: false,
						success: function(res) {
							if (res.confirm) {
								console.log('用户点击确定');
							}
						}
					});
				}
			});
		},
		//返回
		goBack: function() {
			uni.navigateBack();
		},
	},
	onLoad() {
		authAccount(this.hasLogin, this.forcedLogin, this.userName);
	}
};
</script>

<style lang="scss">
button {
	margin-top: 10px;
}
.wxc-list {
	position: relative;
	display: flex;
	flex-direction: row;
	padding-left: $uni-spacing-col-base;
	padding-right: $uni-spacing-col-base;
	padding-right: 0px;
	align-items: center;

	&-title {
		flex: 0 0 auto;
		width: 40%;
		margin-right: $uni-spacing-col-base;
		justify-content: flex-start;
		align-items: right;
	}

	&-extra {
		width: 60%;
	}
}
</style>
