import config from '@/config'
const {
	domian
} = config

/**
 * @description 紧急入库（没有送货单和包装码，系统打印入库码入库）
 * 用于提交和保存数据，并更新库存。应用场景是：
 * 在货物上架之前扫描入库码，提取入库码对应信息并提交
 */
             
export const saveEmergentOutInfo = (data) => {
	console.log("saveEmergentOutInfo入参：" + JSON.stringify(data))
	return uni.request({
		url: domian + 'common/wms_Server_Data.asp?action=SaveEmergentOutInfo',
		type: "GET",
		dataType: "JSON",
		data: data,
	});
}


/**
 * @description 获取拣货码信息
 * 用于根据拣货码扫描出库前获取的相关信息，并进行界面的内容显示。
 */
export const getPickGoodsCodeInfo = (BillNum,userName,password,userID) => {
	console.log("getPickGoodsCodeInfo入参BillNum：" + BillNum);
	console.log("getPickGoodsCodeInfo入参userName：" + userName);
	console.log("getPickGoodsCodeInfo入参password：" + password);
	console.log("getPickGoodsCodeInfo入参userID：" + userID);
	return uni.request({
		url: domian + 'common/wms_Server_Data.asp?action=GetPickGoodsCodeInfo'+"&BillNum="+BillNum+"&UserName="+userName+"&Password="+password+"&UserID="+userID
	});
}

/**
 * @description 根据拣货码扫描出库
 * 客户没有给出相关完整的出库计划或拣货时，
 * 用于的出库。用户可先通过手机端查看所需要
 * 出库的物料所在的库位分布信息，然后进行的出库操作。
 */
export const sureStockOut = (BillNum,userName,password,userID) => {
	console.log("sureStockOut入参：" + BillNum)
	console.log("sureStockOut入参BillNum：" + BillNum);
	console.log("sureStockOut入参userName：" + userName);
	console.log("sureStockOut入参password：" + password);
	console.log("sureStockOut入参userID：" + userID);
	return uni.request({
		url: domian + 'common/wms_Server_Data.asp?action=SureStockOut'+"&BillNum="+BillNum+"&UserName="+userName+"&Password="+password+"&UserID="+userID
	});
}

/**
 * @description 根据拣货码扫描出库
 * 客户没有给出相关完整的出库计划或拣货时，
 * 用于的出库。用户可先通过手机端查看所需要
 * 出库的物料所在的库位分布信息，然后进行的出库操作。
 */
export const bulidFcd = (data) => {
	console.log("bulidFcd入参：" + JSON.stringify(data))
	return uni.request({
		url: domian + 'common/wms_Server_Data.asp?action=BulidFcd',
		type: "GET",
		dataType: "JSON",
		data:data
	});
}

/**
    装车前检查拣货码是否完成出库
    用于在出库管理—生成装车单界面调用该接口
	扫描拣货码时判断当前拣货码是否完成出库。
 */
export const checkPickGoodsCode = (BillNum,userName,password,userID) => {
	console.log("checkPickGoodsCode入参BillNum：" + BillNum);
	console.log("checkPickGoodsCode入参userName：" + userName);
	console.log("checkPickGoodsCode入参password：" + password);
	console.log("checkPickGoodsCode入参userID：" + userID);
	return uni.request({
		url: domian + 'common/wms_Server_Data.asp?action=CheckPickGoodsCode'+"&BillNums="+BillNum+"&UserName="+userName+"&Password="+password+"&UserID="+userID
	});
}