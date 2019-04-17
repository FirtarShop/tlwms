<template>
	<view class="content">
		<view class="">
			<button :type="btnType" v-on:click="scanPackege">
				<text>{{ btnText }}</text>
			</button>
			<view v-show="TlJpdID != ''">
				<view class="">
					<view class="wxc-list">
						<view class="wxc-list-title">需求单号:</view>
						<view class="wxc-list-extra">{{ OperBillNum }}</view>
					</view>
					<view class="wxc-list">
						<view class="wxc-list-title">条码内容:</view>
						<view class="wxc-list-extra">{{ BillNum }}</view>
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
						<view class="wxc-list-title">包装数量:</view>
						<view class="wxc-list-extra">{{ OutPackage }}</view>
					</view>
					<view class="wxc-list">
						<view class="wxc-list-title">对应数量:</view>
						<view class="wxc-list-extra">{{ Qty }}</view>
					</view>
					<view class="wxc-list">
						<view class="wxc-list-title">出库库位:</view>
						<view class="wxc-list-extra">{{ LocalName }}</view>
					</view>
				</view>
			</view>
			<button type="primary" v-show="isShowOutlibrary" v-bind:disabled="!isCanOutlibrary" v-on:click="sureOutlibrary"><text>确定出库</text></button>
			<button type="default" v-show="isShowOutlibrary" @click="resetPage">重置页面</button>
			<!-- 	<button type="primary"  @click="logMessage">
				浏览器打印
			</button> -->
		</view>
	</view>
</template>

<script>
import { addUserParam,authAccount, parseForRule, isEmptyObject } from '@/libs/util.js';
import { getPickGoodsCodeInfo, sureStockOut } from '@/api/outlibrary.js';
import { mapState } from 'vuex';
export default {
	data() {
		return {
			currentSteps: 0, //当前执行步骤，
			TlJpdID: '', //拣货码ID号
			OperBillNum: '', //需求单号
			BillNum: '', //拣货码条码内容
			MNumber: '', //当前拣货码物料编码
			MName: '', //当前拣货码物料名称
			OutPackage: '', //出库单包装数量
			Qty: '', //当前拣货码对应数量
			LocalName: ''
		};
	},
	created() {
		this.currentSteps = 0;
		this.TlJpdID = '';
		this.OperBillNum = '';
		this.BillNum = '';
		this.MNumber = '';
		this.MName = '';
		this.OutPackage = '';
		this.LocalName = '';
		this.Qty = '';
	},
	computed: {
		...mapState(['forcedLogin', 'hasLogin', 'userName', 'password', 'userID']),
		isCanOutlibrary() {
			if (this.currentSteps == 1) {
				return true;
			} else {
				return false;
			}
		},
		isShowOutlibrary() {
			if (this.TlJpdID && this.TlJpdID != '') {
				return true;
			} else {
				return false;
			}
		},
		btnText() {
			if (this.TlJpdID && this.TlJpdID != '') {
				return '取消并重新扫描拣货码';
			} else {
				return '扫描拣货码';
			}
		},
		btnType() {
			if (this.TlJpdID && this.TlJpdID != '') {
				return 'default';
			} else {
				return 'primary';
			}
		}
	},
	methods: {
		//扫描拣货码
		scanPackege: function(res) {
			if (this.isCanOutlibrary) {
				this.resetScanPackege();
			} else {
				var _this = this;
				uni.scanCode({
					onlyFromCamera: true,
					success: function(res) {
						console.log('res' + JSON.stringify(res));
						if (res && res.result && res.result != '' && res.result.indexOf('PGC') != '-1') {
							getPickGoodsCodeInfo(res.result, _this.userName, _this.password, _this.userID).then(data => {
								var [error, res] = data;
								console.log('getPickGoodsCodeInfo.data:' + JSON.stringify(data));
								console.log('getPickGoodsCodeInfo.res:' + JSON.stringify(res));
								var result = parseForRule(res.data);
								console.log('result:' + JSON.stringify(result));
								if (result && !isEmptyObject(result)) {
									_this.currentSteps = 1;
									_this.setPackege(result);
								} else {
									uni.showModal({
										title: '提示',
										content: '没有获取到拣货码信息，请检查拣货码',
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
								title: '拣货码错误,请重新扫描；'
							});
						}
					}
				});
			}
		},
		resetScanPackege: function(res) {
			var _this = this;
			uni.showModal({
				title: '提示',
				content: '是否放弃当前拣货码，重新扫描拣货码',
				success: function(res) {
					if (res.confirm) {
						_this.initPackege();
						uni.scanCode({
							onlyFromCamera: true,
							success: function(res) {
								console.log('res' + JSON.stringify(res));
								if (res && res.result && res.result != '' && res.result.indexOf('PGC') != '-1') {
									getPickGoodsCodeInfo(res.result, _this.userName, _this.password, _this.userID).then(data => {
										var [error, res] = data;
										console.log('getPickGoodsCodeInfo.data:' + JSON.stringify(data));
										console.log('getPickGoodsCodeInfo.res:' + JSON.stringify(res));
										var result = parseForRule(res.data);
										var result = isEmptyObject(result);
										console.log('result:' + JSON.stringify(result));
										if (result && !isEmptyObject(result)) {
											_this.currentSteps = 1;
											_this.setPackege(result);
										} else {
											uni.showModal({
												title: '提示',
												content: '没有获取到拣货码信息，请检查拣货码',
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
										title: '拣货码错误,请重新扫描；'
									});
								}
							}
						});
					} else if (res.cancel) {
					}
				}
			});
		},
		//初始化拣货码信息
		initPackege: function() {
			this.currentSteps = 0;
			this.TlJpdID = '';
			this.OperBillNum = '';
			this.BillNum = '';
			this.MNumber = '';
			this.MName = '';
			this.OutPackage = '';
			this.LocalName = '';
			this.Qty = '';
		},
		//设置拣货码信息
		setPackege: function(result) {
			this.TlJpdID = result.TlJpdID;
			this.OperBillNum = result.OperBillNum;
			this.BillNum = result.BillNum;
			this.MNumber = result.MNumber;
			this.MName = result.MName;
			this.OutPackage = result.OutPackage;
			this.LocalName = result.LocalName;
			this.Qty = result.Qty;
		},
		//确定出库
		sureOutlibrary: function(res) {
			var _this = this;
			sureStockOut(this.BillNum, this.userName, this.password, this.userID).then(data => {
				var [error, res] = data;
				console.log('data:' + JSON.stringify(data));
				console.log('res:' + JSON.stringify(res));
				var result = parseForRule(res.data);
				console.log('result:' + JSON.stringify(result));
				if (result.success) {
					_this.currentSteps = 2;
					console.log(result);
					console.log('正确');
					uni.showToast({
						icon: 'success',
						title: '出库成功！'
					});
				} else {
					console.log('错误');
					uni.showModal({
						title: '提示',
						showCancel: false,
						content: result.ResponseText,
						success: function(res) {
							if (res.confirm) {
								console.log('用户点击确定');
							}
						}
					});
				}
			});
		},
		//重置页面
		resetPage: function() {
			if (this.isCanOutlibrary) {
				var _this = this;
				uni.showModal({
					title: '提示',
					content: '是否放弃当前拣货码，重新扫描拣货码',
					success: function(res) {
						if (res.confirm) {
							_this.initPackege();
						} else if (res.cancel) {
						}
					}
				});
			}
		},
		logMessage: function() {}
	},
	onLoad() {
		authAccount(this.hasLogin, this.forcedLogin, this.userName);
	}
};
</script>
<style lang="scss">
button {
	margin-top: 12upx;
}

.wxc-list {
	position: relative;
	display: flex;
	flex-direction: row;
	padding: $uni-spacing-col-base;
	padding-right: 0px;
	align-items: center;

	&-title {
		flex: 0 0 auto;
		margin-right: $uni-spacing-col-base;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		font-size: $uni-font-size-lg;
	}

	&-extra {
		flex: 1;

		// width: $card-extra-width;
		margin-left: $uni-spacing-col-base;
		font-size: $uni-font-size-lg;
		// text-align: left;
	}
}
</style>
