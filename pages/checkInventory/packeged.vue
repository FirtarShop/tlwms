<template>
	<view class="content">
		<view class="example">
			<uni-steps :data="steps" :active="currentSteps - 1"></uni-steps>
			<button type="primary" v-bind:disabled="currentSteps > 1" v-on:click="scanMaterial"><text>扫描物料码</text></button>
			<view v-if="materials.materials.length > 0">
				<view class="uni-card" v-for="material in materials.materials" v-bind:key="material.id">
					<view class="uni-card__header">
						<view class="uni-card__header-title-text">{{ material.code }}</view>
						<view class="uni-card__header-extra-text">{{ material.totalAmount }}</view>
					</view>
					<view class="uni-card__content uni-card__content--pd">
						<view v-for="(item, _index) in material.goods" v-bind:key="_index" class="wxc-list">
							<view class="wxc-list-title-text">
								{{ materials.FourSName == '' ? '等待填写收货信息，可继续扫描物料' : '已填写收货信息' }}
								<text style="color: #0FAEFF;margin-left: 4px;">{{ materials.FourSName }}</text>
							</view>
							<view class="wxc-list-extra-text">{{ item }}</view>
						</view>
					</view>
					<view class="uni-card__footer">
						生成包装码:
						<text>{{ materials.FourSName }}</text>
					</view>
				</view>
			</view>
			<view class="uni-padding-wrap uni-common-mt" v-show="currentSteps >= 1">
				<view class="uni-form-item uni-column">
					<view class="title">收货4S店名</view>
					<input class="uni-input" name="input" v-model="materials.FourSName" placeholder="请输入收货4S店名" />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">收货地址</view>
					<input class="uni-input" name="input" v-model="materials.RecAdds" placeholder="请输入收货地址" />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">承运公司</view>
					<input class="uni-input" name="input" v-model="materials.TranCom" placeholder="请输入承运公司" />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">收件人</view>
					<input class="uni-input" name="input" v-model="materials.RecLinkMan" placeholder="请输入收件人" />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">收件人电话</view>
					<input class="uni-input" name="input" v-model="materials.RecLinkTel" placeholder="请输入收件人电话" />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">发件人</view>
					<input class="uni-input" name="input" v-model="materials.SendLinkMan" placeholder="请输入发件人" />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">发件人电话</view>
					<input class="uni-input" name="input" v-model="materials.SendLinkTel" placeholder="请输入发件人电话" />
				</view>
			</view>
			<button type="primary" v-bind:disabled="!isCanGenerateBzd" @click="sureGenerateFcd">确认生成包装码</button>
			<button type="primary" v-show="currentSteps == 2" @click="goBack">返回</button>
			<!-- <button type="primary"  @click="logMessage">
				浏览器打印
			</button> -->
		</view>
	</view>
</template>

<script>
import { uniSteps, uniCard, uniList, uniListItem } from '@dcloudio/uni-ui';
import { bulidBzd } from '@/api/checkInventory.js';
import checkInventoryPackegeModel from '@/model/checkInventoryPackegeModel.js';
import { mapState } from 'vuex';
import { addUserParam,authAccount, parseForRule } from '@/libs/util.js';
export default {
	data() {
		return {
			materials: checkInventoryPackegeModel,
			currentSteps: 0, //当前执行步骤，
			steps: [
				{
					title: '扫物料码'
				},
				{
					title: '生成包装码'
				}
			]
		};
	},
	created() {
		this.currentSteps = 0;
		this.materials.reset();
	},
	components: {
		uniSteps,
		uniCard,
		uniList,
		uniListItem
	},
	computed: {
		...mapState(['forcedLogin', 'hasLogin', 'userName','password','userID']),
		isCanGenerateBzd() {
			if (this.currentSteps == 1) {
				return true;
			} else {
				return false;
			}
		}
	},
	methods: {
		//扫描物料码
		scanMaterial: function(res) {
			var _this = this;
			uni.scanCode({
				onlyFromCamera: true,
				success: function(res) {
					console.log('res' + JSON.stringify(res));
					var result = parseForRule(res.result);
					console.log('result' + JSON.stringify(result));
					if (result && result.code && result.code != '' && result.count) {
						_this.materials.setMaterial(result);
						_this.currentSteps = 1;
					} else {
						uni.showToast({
							icon: 'none',
							duration: 2500,
							title: '物料信息错误:' + res.result
						});
					}
				}
			});
		},
		//确定生成发车单
		sureGenerateFcd: function(res) {
			if (this.materials.FourSName == '' || this.materials.RecAdds == '') {
				uni.showModal({
					title: '提示',
					showCancel: false,
					content: '请填写收货店名和收货地址',
					success: function(res) {
						if (res.confirm) {
							console.log('用户点击确定');
						}
					}
				});
			} else {
				var _this = this;
				bulidBzd(addUserParam(this.materials.generateModel(),this.userName,this.password,this.userID)).then(data => {
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
							title: '生成备货包装码成功！'
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
			}
		},
		//返回
		goBack: function() {
			uni.navigateBack();
		},
		logMessage: function() {
			debugger;
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
			width: 10%;
			margin-left: $uni-spacing-col-base;
			font-size: $uni-font-size-base;
			text-align: right;
			@include text-omit;
		}
	}
}
</style>
