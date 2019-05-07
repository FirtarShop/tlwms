<template>
	<view class="content">
		<view class="example">
			<uni-steps :data="steps" :active="currentSteps - 1"></uni-steps>
			<button type="primary" v-bind:disabled="!scanMaterials" v-on:click="scanMaterial"><text>扫拣货码</text></button>
			<view v-if="materials.materials.length > 0">
				<view class="uni-card" v-for="(material, index)  in materials.materials" v-bind:key="material.BillNum">
					<view class="">
						<view class="wxc-list-extra">id:{{ material.TlJpdID }}</view>
						<view class="wxc-list-extra">单号:{{ material.OperBillNum }}</view>
						<view class="wxc-list-extra">条码内容:{{ material.BillNum }}</view>
						<view class="wxc-list-extra">物料编码:{{ material.MNumber }}</view>
						<view class="wxc-list-extra">物料名称:{{ material.MName }}</view>
						<view class="wxc-list-extra">出库库位:{{ material.LocalName }}</view>
						<view class="wxc-list-extra">出库单包装:{{ material.OutPackage }}</view>
						<view class="wxc-list-extra">
							出库数量:{{ material.Qty }}
							<span style="margin: 5upx; font-size: 30upx; color: #0079FF;" @click="modification(index)">修改</span>
						</view>
					</view>
				</view>
			</view>
			<button type="primary" v-bind:disabled="!sureOutlibrarys" @click="sureOutlibrary">确认收货</button>
			<button type="default" v-show="isReseatPage" @click="resetPage">返回扫描</button>
			<button type="primary" v-show="currentSteps == 2" @click="goBack">返回</button>
			<!-- <button type="primary"  @click="logMessage">
				浏览器打印
			</button> -->
		</view>
		<neil-modal :show="show" title="修改提示" @close="closeModificationModal" @confirm="modifierNumber('modifierNumber')">
			<view style="min-height: 90upx;padding: 32upx 24upx;">
				<view style="text-align: center;">
					请输入个数
					<input type="number" step="0.0000000001" v-enter-number v-model="inputNumber" placeholder="输入个数...." />
				</view>
			</view>
		</neil-modal>
	</view>
</template>

<script>
import neilModal from '@/components/neil-modal/neil-modal.vue';
import { uniSteps, uniCard, uniList, uniListItem } from '@dcloudio/uni-ui';
import zhongtaiModel from '@/model/zhongtaiModel.js';
import { addUserParam, authAccount, parseForRule, isEmptyObject } from '@/libs/util.js';
import { getPickGoodsCodeInfo, ZoteRecGoods } from '@/api/zhongtai.js';
import { mapState } from 'vuex';
export default {
	data() {
		return {
			show: false,
			inputNumber: 12,
			currentIndex: 0, //当前需要修改数量的货物索引
			materials: zhongtaiModel,
			currentSteps: 0, //当前执行步骤，
			steps: [
				{
					title: '扫拣货码'
				},
				{
					title: '收货完成'
				}
			]
		};
	},
	created() {
		this.currentSteps = 0;
		this.materials.reset();
	},
	components: {
		neilModal,
		uniSteps,
		uniCard,
		uniList,
		uniListItem
	},
	computed: {
		...mapState(['forcedLogin', 'hasLogin', 'userName', 'password', 'userID']),
		sureOutlibrarys() {
			if (this.currentSteps == 1) {
				return true;
			} else {
				return false;
			}
		},
		scanMaterials() {
			if (this.currentSteps == 0) {
				return true;
			} else {
				return false;
			}
		},
		//是否重置页面
		isReseatPage() {
			if (this.currentSteps == 1) {
				return true;
			} else {
				return false;
			}
		}
	},
	methods: {
		//扫描拣货码
		scanMaterial: function(res) {
			var _this = this;
			uni.scanCode({
				onlyFromCamera: true,
				success: function(res) {
					console.log('res' + JSON.stringify(res));
					if (res && res.result && res.result != '' && res.result.indexOf('PGC') != '-1') {
						getPickGoodsCodeInfo(res.result, _this.userName, _this.password, _this.userID).then(data => {
							console.log('res' + JSON.stringify(res));
							var [error, res] = data;
							console.log('getPickGoodsCodeInfo.data:' + JSON.stringify(data));
							console.log('getPickGoodsCodeInfo.res:' + JSON.stringify(res));
							var result = parseForRule(res.data);
							console.log('result:' + JSON.stringify(result));
							if (result && !isEmptyObject(result)) {
								_this.currentSteps = 1;
								console.log('测:' + JSON.stringify(result));
								_this.materials.picking(result);
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
		},
		//确定出库
		sureOutlibrary: function(res) {
			var _this = this;
			console.log('测:' + JSON.stringify(res));
			ZoteRecGoods(addUserParam(this.materials.generateModel(), this.userName, this.password, this.userID)).then(data => {
				var [error, res] = data;
				console.log('data:' + JSON.stringify(data));
				console.log('res:' + JSON.stringify(res));
				var result = parseForRule(res.data);
				console.log('result:' + JSON.stringify(result));
				if (result.success) {
					console.log(result);
					_this.currentSteps = 2;
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
		//返回
		goBack: function() {
			uni.navigateBack();
		},
		logMessage: function() {
			debugger;
		},
		//修改出库数量
		modification: function(index) {
			try {
				console.log(this.inputNumber);
				console.log(JSON.stringify(this.materials));
				this.inputNumber = this.materials.materials[index].Qty;
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
		//修改个数
		modifierNumber: function(ref) {
			console.log('修改后的值：' + this.inputNumber);
			try {
				this.materials.modifierNumber(this.currentIndex, this.inputNumber);
			} catch (e) {
				console.log('异常：' + JSON.stringify(e));
			}
			this.show = false;
		},
		//继续扫描
		resetPage: function() {
			this.currentSteps = 0;
			this.materials.reset();
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
