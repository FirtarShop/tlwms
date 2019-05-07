import config from '@/config'
const {
	domian
} = config

/**
 * @description 扫描入库前，检查库位是否满足入库要求
 * 用于物料在移入良品区之前检查库位是否可用，一般在提交数据到数据库保存前检查，
 * 检查通过则提交数据保存并更新库存。库位存放要求：良品区库位只能存放一种物料，
 * 冻结库位不能存放物料，不同批次的物料不能存放在同一库位。
 */
export const checkLocal = (MNumber,LocalID,userName,password,userID) => {
	console.log("checkLocal:入参:" +MNumber,+LocalID);
	return uni.request({
		url: domian + 'common/wms_Server_Data.asp?action=CheckLocal&MNumber='+MNumber+"&LocalID="+LocalID+"&UserName="+userName+"&Password="+password+"&UserID="+userID
	});
}

/**
 * @description 紧急入库（没有送货单和包装码，系统打印入库码入库）
 * 用于提交和保存数据，并更新库存。应用场景是：
 * 在货物上架之前扫描入库码，提取入库码对应信息并提交
 */
export const saveEmergentInInfo = (data) => {
	console.log("saveEmergentInInfo入参：" + JSON.stringify(data))
	return uni.request({
		url: domian + 'common/wms_Server_Data.asp?action=SaveEmergentInInfo',
		type: "POST",
		dataType: "JSON",
		data: data,
	});
}




/**
 * @description 扫描供应商送货包装码，获取相应信息
 * 用于扫描包装码入库前，获取包装码对应的信息，获取
 * 后如果连续扫描物料放置在同一库位时，前端需要检查
 * 送货单号和物料是否一致，如果一致则累加当前包装数量。不一致则提醒用户错误原因。
 */
export const getDeliBillBarcodeInfo = (BzBarCode,userName,password,userID) => {
	console.log("getDeliBillBarcodeInfo:入参 number:" + BzBarCode);
	console.log("getDeliBillBarcodeInfo:入参 userName:" + userName);
	console.log("getDeliBillBarcodeInfo:入参 password:" + password);
	console.log("getDeliBillBarcodeInfo:入参 userID:" + userID);
	return uni.request({
		url: domian + 'common/wms_Server_Data.asp?action=GetDeliBillBarcodeInfo'+"&BzBarCode="+BzBarCode+"&UserName="+userName+"&Password="+password+"&UserID="+userID
	});
}

/**
 * @description 包装码收货入库
 * 用于提交和保存数据，并更新库存。应用场景是：
 * 在货物上架之前扫描包装码
 */
export const savePutInByDeliBill = (data) => {
	console.log("savePutInByDeliBill:入参 :" + data);
	return uni.request({
		url: domian + 'common/wms_Server_Data.asp?action=SavePutInByDeliBill'+data
	});
}



export const ResearchDeliBill = (data) => {
	console.log("ResearchDeliBill入参：" + JSON.stringify(data))
	return uni.request({
		url: domian + 'common/wms_Server_Data.asp?action=ResearchDeliBill',
		type: "POST",
		dataType: "JSON",
		data: data,
	});
}

export const saveMateMoveInfo = (data) => {
	console.log("SaveMateMoveInfo入参：" + JSON.stringify(data))
	return uni.request({
		url: domian + 'common/wms_Server_Data.asp?action=SaveMateMoveInfo',
		type: "POST",
		dataType: "JSON",
		data: data,
	});
}


/**
 * @description 扫描库位，获取库位中相关物料信息区别于11接口
 * 用于移库前扫描库位码，获取对应库位中的物料信息。
 */
export const getLocalMateList = (LocalID,userName,password,userID) => {
	console.log("getLocalMateList:入参:"+LocalID);
	return uni.request({
		url: domian + 'common/wms_Server_Data.asp?action=GetLocalMateList&&LocalID='+LocalID+"&UserName="+userName+"&Password="+password+"&UserID="+userID
	});
}



