import config from '@/config'
const {
	domian
} = config

/**
 * @description 扫描库位，获取库位中相关物料信息
 * 用于盘点前扫描库位码，获取对应库位中的物料信息。
 */
export const getLocalMateInfo = (LocalID,userName,password,userID) => {
	console.log("getLocalMateInfo入参：LocalID:" + LocalID);
	console.log("getLocalMateInfo入参：userName:" + userName);
	console.log("getLocalMateInfo入参：password:" + password);
	console.log("getLocalMateInfo入参：userID:" + userID);
	return uni.request({
		url: domian + 'common/wms_Server_Data.asp?action=GetLocalMateInfo&LocalID='+LocalID+"&UserName="+userName+"&Password="+password+"&UserID="+userID
	});
}
/**
 * * @description盘点
 *作用： 手机扫描库位码后，调用getLocalMateInfo接口直接获取当前库位物料（但不显示数量），
 * 然后手工输入盘点数量
 */
export const saveInventoryInfo = (data) => {
	console.log("saveInventoryInfo入参：" + JSON.stringify(data));
	return uni.request({
		url: domian + 'common/wms_Server_Data.asp?action=SaveInventoryInfo',
		type: "GET",
		dataType: "JSON",
		data: data
	});
}

/**
@description获取待盘点库位信息
*作用： 获取待盘点库位信息
 */
export const getPdTaskList = (data) => {
	console.log("getLocationList入参：" + JSON.stringify(data));
	return uni.request({
		url: domian + 'common/wms_Server_Data.asp?action=GetPdTaskList',
		type: "POST",
		dataType: "JSON",
		data: data
	});
}
