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
 * @description 不良品入库（从主机厂退库）
 * 主机厂发现不良品，不良品退回至仓库的操作（入库至仓库）
 */
export const saveStockInForBad = (data) => {
    console.log("saveStockInForBad 入参："+JSON.stringify(data));
	return uni.request({
		url: domian + 'common/wms_Server_Data.asp?action=SaveStockInForBad',
		type: "POST",
		dataType: "JSON",
		data: data
	});
}
/**
 * @description 不良品返厂出库（从仓库出库退回给供应商）
 * 仓库中的不良品退回给供应商（从仓库中出库）
 */
export const saveStockOutByBadMate = (data) => {
    console.log("SaveStockOutByBadMate 入参："+JSON.stringify(data));
	return uni.request({
		url: domian + 'common/wms_Server_Data.asp?action=SaveStockOutByBadMate',
		type: "GET",
		dataType: "JSON",
		data: data
	});
}

export const getBadMatePickGoodsInfo = (BillNum,userName,password,userID) => {
	console.log("getBadMatePickGoodsInfo入参BillNum：" + BillNum);
	console.log("getBadMatePickGoodsInfo入参userName：" + userName);
	console.log("getBadMatePickGoodsInfo入参password：" + password);
	console.log("getBadMatePickGoodsInfo入参userID：" + userID);
	return uni.request({
		url: domian + 'common/wms_Server_Data.asp?action=GetBadMatePickGoodsInfo'+"&BillNum="+BillNum+"&UserName="+userName+"&Password="+password+"&UserID="+userID
	});
}





/**
 * @description 不良品返厂出库（从仓库出库退回给供应商）
 * 仓库中的不良品退回给供应商（从仓库中出库））
 */
export const sureBadMateStockOut = (BillNum,userName,password,userID) => {
    console.log("sureBadMateStockOut入参BillNum：" + BillNum);
    console.log("sureBadMateStockOut入参userName：" + userName);
    console.log("sureBadMateStockOut入参password：" + password);
    console.log("sureBadMateStockOut入参userID：" + userID);
	return uni.request({
		url: domian + 'common/wms_Server_Data.asp?action=SureBadMateStockOut'+"&BillNum="+BillNum+"&UserName="+userName+"&Password="+password+"&UserID="+userID
	});
}
