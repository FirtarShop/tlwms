import config from '@/config'
const {
	domian
} = config

/**
 * @description 获取指定物料的库存信息
 *  扫描库位，获取库位中相关物料信息
 *  作用：用于盘点前扫描库位码，获取对应库位中的物料信息。
 */
export const getStockList = (data) => {
	console.log("getStockList:入参 :" + JSON.stringify(data));
	return uni.request({
		url: domian + 'common/wms_Server_Data.asp?action=GetStockList',
		type: "POST",
		dataType: "JSON",
		data: data
	});
}
