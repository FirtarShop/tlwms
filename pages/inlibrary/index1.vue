<template>
	<view class="content">
		<view class="example">
			<uni-steps :data="steps" :active="currentSteps - 1"></uni-steps>
			<button type="primary" v-bind:disabled="currentSteps > 1" v-on:click="scanPackegel"><text>扫码包装码</text></button>
			<button type="primary" v-bind:disabled="currentSteps != 1" v-on:click="scanWarehouse"><text>扫码库位码</text></button>
			<view v-if="material.BillNum.length > 0">
				<view class="uni-card">
					<view class="uni-card__header">
						<view class="uni-card__header-title-text">{{ material.BillNum }}:{{ material.MName }}</view>
						<view class="uni-card__header-extra-text">{{ material.totalAmount }}</view>
					</view>
					<view class="uni-card__content uni-card__content--pd">
						<view v-for="(item, index) in material.packages" v-bind:key="index" class="wxc-list">
							<view class="wxc-list-title-text">
								{{ item.BzBarCode }}
								<!-- <text style="color: #0FAEFF;margin-left: 4px;" v-if="material.storage!=null">{{material.storage.code}}</text> -->
							</view>
							<view class="wxc-list-extra-text">{{ item.BzQty }}</view>
							<span style="margin: 5upx; font-size: 30upx; color: #0079FF;" @click="modification(index)">修改</span>
						</view>
						<view class="wxc-list" style="color: #0FAEFF;">
							<view class="wxc-list-title-text">
								{{ material.storage == null ? '正在等待库位码，可继续扫描包装码' : '已对应货架' }}
								<text style="color: #0FAEFF;margin-left: 4px;" v-if="material.storage != null">{{ material.storage.code }}</text>
							</view>
							<!-- <view class="wxc-list-extra-text">{{item}}</view> -->
						</view>
					</view>
					<view class="uni-card__footer">
						包装码入库:{{ material.BillNum }}
						<text v-if="material.storage != null">{{ material.storage.code }}</text>
					</view>
				</view>
			</view>
			<button type="primary" v-bind:disabled="!sureInlibrarys" @click="sureInlibrary">确认入库</button>
			<neil-modal :show="show" title="修改提示" @close="closeModificationModal" @confirm="modifierNumber('modifierNumber')">
				<view style="min-height: 90upx;padding: 32upx 24upx;">
					<view style="text-align: center;">
						请输入个数
						<input type="number" step="0.0000000001" v-enter-number v-model="inputNumber" placeholder="输入个数...." />
					</view>
				</view>
			</neil-modal>
		</view>
	</view>
</template>

<script>
import { uniSteps, uniCard, uniList, uniListItem } from '@dcloudio/uni-ui';
import inlibraryModel from '@/model/inlibraryByBillModel.js';
import neilModal from '@/components/neil-modal/neil-modal.vue';
import { addUserParam, authAccount, parseForRule, parseWarehouseCode, isEmptyObject } from '@/libs/util.js';
import { checkLocal, getDeliBillBarcodeInfo, savePutInByDeliBill } from '@/api/inlibrary.js';
import { mapState } from 'vuex';
export default {
	data() {
		return {
			material: inlibraryModel,
			currentSteps: 0, //当前执行步骤，
			currentIndex: 0, //当前需要修改数量的货物索引
			show: false,
			inputNumber: 12,
			steps: [
				{
					title: '扫物包装码'
				},
				{
					title: '扫库位码'
				},
				{
					title: '入库完成'
				}
			]
		};
	},
	created() {
		this.currentSteps = 0;
		this.material.reset();
	},
	components: {
		uniSteps,
		neilModal,
		uniCard,
		uniList,
		uniListItem
	},
	computed: {
		...mapState(['forcedLogin', 'hasLogin', 'userName', 'password', 'userID']),
		sureInlibrarys() {
			if (this.currentSteps == 2) {
				return true;
			} else {
				return false;
			}
		}
	},
	methods: {
		//扫描包装码
		scanPackegel: function(res) {
			var _this = this;
			uni.scanCode({
				onlyFromCamera: true,
				success: function(res) {
					console.log('res' + JSON.stringify(res));
					if (res && res.result && res.result != '' && res.result.indexOf('TML') != '-1') {
						getDeliBillBarcodeInfo(res.result, _this.userName, _this.password, _this.userID).then(data => {
							var [error, res] = data;
							console.log('getDeliBillBarcodeInfo.data:' + JSON.stringify(data));
							console.log('getDeliBillBarcodeInfo.res:' + JSON.stringify(res));
							var result = parseForRule(res.data);
							console.log('result:' + JSON.stringify(result));
							if (result && !isEmptyObject(result)) {
								_this.setPackege(result);
							} else {
								uni.showModal({
									title: '提示',
									content: '没有获取到包装码信息，请检查包装',
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
							title: '包装码错误,请重新扫描；'
						});
					}
				}
			});
		},
		//扫描库位码
		scanWarehouse: function(res) {
			var _this = this;
			uni.scanCode({
				onlyFromCamera: true,
				success: function(res) {
					console.log('res' + JSON.stringify(res));
					var result = parseWarehouseCode(res.result);
					console.log('result' + JSON.stringify(result));
					if (result && result.codeid && result.codeid != '') {
						checkLocal(_this.material.MNumber, result.codeid, _this.userName, _this.password, _this.userID).then(data => {
							var [error, res] = data;
							console.log('checkLocal.data:' + JSON.stringify(data));
							console.log('checkLocal.res:' + JSON.stringify(res));
							var checkResult = parseForRule(res.data);
							console.log('checkResult:' + JSON.stringify(checkResult));
							if (checkResult.success) {
								if (_this.material.addStorage(result)) {
									_this.currentSteps = 2;
								} else {
									uni.showToast({
										icon: 'none',
										duration: 2500,
										title: '库位信息错误：' + JSON.stringify(result)
									});
								}
							} else {
								uni.showModal({
									title: '提示',
									content: checkResult.ResponseText,
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
		//确定入库
		sureInlibrary: function(res) {
			var _this = this;
			savePutInByDeliBill(addUserParam(this.material.generateModel(), this.userName, this.password, this.userID)).then(data => {
				var [error, res] = data;
				console.log('data:' + JSON.stringify(data));
				console.log('res:' + JSON.stringify(res));
				var result = parseForRule(res.data);
				console.log('result:' + JSON.stringify(result));
				if (result.success) {
					console.log(result);
					_this.currentSteps = 3;
					uni.showToast({
						icon: 'success',
						title: '入库成功'
					});
				} else {
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
		//设置包装码信息
		setPackege: function(data) {
			if (this.material.judgePackege(data)) {
				if (this.material.judgeCommonPackege(data)) {
					uni.showModal({
						title: '提示',
						content: data.BzBarCode + '包装码已经扫描过！',
						showCancel: false,
						success: function(res) {
							if (res.confirm) {
								console.log('用户点击确定');
							}
						}
					});
				} else {
					this.material.addPackege(data);
					this.currentSteps = 1;
				}
			} else {
				uni.showModal({
					title: '提示',
					content: '送货单号不一致或物料不同！',
					showCancel: false,
					success: function(res) {
						if (res.confirm) {
							console.log('用户点击确定');
						}
					}
				});
			}
		},
		logMessage: function() {
			debugger;
		},
		modification: function(index) {
			console.log('index:' + index);
			try {
				console.log(this.inputNumber)
				this.inputNumber = this.material.packages[index];
				this.currentIndex = index;
				this.show = true;
			} catch (e) {
				console.log('异常：' + JSON.stringify(e));
			}

			console.log('modification:end');
		},
		//关闭弹框事件
		closeModificationModal: function(data) {
			this.show = false;
		},
		modifierNumber: function(ref) {
			console.log('修改后的值：' + this.inputNumber);
			try {
				this.material.modifierNumber(this.currentIndex, this.inputNumber);
			} catch (e) {
				console.log('异常：' + JSON.stringify(e));
			}
			this.show = false;
		}
	},

	onLoad() {
		authAccount(this.hasLogin, this.forcedLogin, this.userName);
	}
};
</script>
<style lang="scss">
.materialnumber {
	width: auto;
	height: 100%;
	float: right;
}

button {
	margin-top: 10px;
}
.bank {
	width: auto;
	height: 100%;
	margin: 0 60%;
	position: absolute;
}

$card-extra-width: 30%;

@mixin text-omit {
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}

.uni-card {
	margin: $uni-spacing-col-base;
	background: $uni-bg-color;
	position: relative;
	display: flex;
	flex-direction: column;

	&:after {
		content: '';
		position: absolute;
		transform-origin: center;
		box-sizing: border-box;
		pointer-events: none;
		top: -50%;
		left: -50%;
		right: -50%;
		bottom: -50%;
		border: 1px solid $uni-border-color;
		border-radius: $uni-border-radius-lg;
		transform: scale(0.5);
	}

	&__footer,
	&__header {
		position: relative;
		display: flex;
		flex-direction: row;
		padding: $uni-spacing-col-base;
		align-items: center;
	}

	&__header {
		&:after {
			position: absolute;
			bottom: 0;
			right: 0;
			left: 0;
			height: 1px;
			content: '';
			-webkit-transform: scaleY(0.5);
			transform: scaleY(0.5);
			background-color: $uni-border-color;
		}

		&-title {
			flex: 1;
			margin-right: $uni-spacing-col-base;
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			align-items: center;

			&-text {
				font-size: $uni-font-size-lg;
				flex: 1;
				@include text-omit;
			}
		}

		&-extra {
			&-img-view {
				display: flex;
			}

			&-img {
				height: $uni-img-size-sm;
				width: $uni-img-size-sm;
				margin-right: $uni-spacing-col-base;
			}

			&-text {
				flex: 0 0 auto;
				width: $card-extra-width;
				margin-left: $uni-spacing-col-base;
				font-size: $uni-font-size-base;
				text-align: right;
				@include text-omit;
			}
		}
	}

	&__content {
		&--pd {
			padding: $uni-spacing-col-base;
		}
	}

	&__footer {
		justify-content: space-between;
		color: $uni-text-color-grey;
		font-size: $uni-font-size-sm;
		padding-top: 0;
	}
}

.wxc-list {
	position: relative;
	display: flex;
	flex-direction: row;
	padding: $uni-spacing-col-base;
	padding-right: 0px;
	align-items: center;

	&:after {
		position: absolute;
		bottom: 0;
		right: 0;
		left: 0;
		height: 1px;
		content: '';
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
		background-color: $uni-border-color;
	}

	&-title {
		flex: 1;
		margin-right: $uni-spacing-col-base;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;

		&-text {
			font-size: $uni-font-size-base;
			flex: 1;
			@include text-omit;
		}
	}

	&-extra {
		&-img-view {
			display: flex;
		}

		&-img {
			height: $uni-img-size-sm;
			width: $uni-img-size-sm;
			margin-right: $uni-spacing-col-base;
		}

		&-text {
			flex: 0 0 auto;
			width: $card-extra-width;
			margin-left: $uni-spacing-col-base;
			font-size: $uni-font-size-base;
			text-align: right;
			@include text-omit;
		}
	}
}
</style>
